"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increament, decreament, removeCart, clearCart } from "@/redux/slices/CartSlice";
import axios from "axios";
import Swal from "sweetalert2";
import { getPrimaryColor } from "@/lib/theme";
import './style.css';
import { toast } from "react-toastify";
import CartDrawerHeader from "./CartDrawerHeader";
import CartStep from "./CartStep";
import CheckoutStep from "./CheckoutStep";
import Portal from "../../Portal";

export default function CartDrawer({ isOpen, onClose, isDirectBuy }) {
  const [currentStep, setCurrentStep] = useState("cart");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    payment_method: "cash",
    delivery_notes: "",
  });
  const [shippingAmount, setShippingAmount] = useState(0);
  const [removingItem, setRemovingItem] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Tracking refs
  const abandonedCheckoutSent = useRef(false);
  const formInteracted = useRef(false);
  const orderSubmittingRef = useRef(false);

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = useSelector((state) => state.cart.count);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const discountAmount = appliedCoupon?.discount_amount || 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount) + shippingAmount;

  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem("checkout_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("checkout_session_id", sessionId);
    }
    return sessionId;
  };

  // Send abandoned checkout data
  const sendAbandonedCheckout = async () => {
    // Only send if:
    // 1. User has items in cart
    // 2. User has filled phone number (minimum requirement)
    // 3. Order not completed
    // 4. Not already sent
    // 5. User has interacted with the form
    // 6. Currently on checkout step
    if (
      !orderCompleted &&
      !orderSubmittingRef.current &&
      cartItems.length > 0 &&
      formData.phone &&
      !abandonedCheckoutSent.current &&
      formInteracted.current &&
      currentStep === "checkout"
    ) {
      const checkoutData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        cart_items: cartItems,
      };

      try {
        const sessionId = getSessionId();
        if (navigator.sendBeacon) {
          // Use fetch with keepalive for better reliability
          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/track-abandoned-checkout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Session-ID": sessionId,
              },
              body: JSON.stringify(checkoutData),
              keepalive: true,
            }
          );
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/track-abandoned-checkout`,
            checkoutData,
            {
              headers: {
                "X-Session-ID": sessionId,
              },
              withCredentials: true,
            }
          );
        }
        abandonedCheckoutSent.current = true;
        console.log("Abandoned checkout tracked");
      } catch (err) {
        console.error("Abandoned checkout tracking failed:", err);
      }
    }
  };

  // Track before user leaves page or closes drawer
  useEffect(() => {
    const handleBeforeUnload = () => {
      sendAbandonedCheckout();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendAbandonedCheckout();
      }
    };

    // Only add listeners when on checkout step with phone number
    if (isOpen && currentStep === "checkout" && formData.phone && formInteracted.current) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [isOpen, currentStep, cartItems, formData.phone, formData.name, formData.address, orderCompleted]);

  // Debounced save - save after user stops typing for 3 seconds
  useEffect(() => {
    if (!formData.phone || !formInteracted.current || currentStep !== "checkout") return;

    const timer = setTimeout(() => {
      sendAbandonedCheckout();
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData.phone, formData.name, formData.address, currentStep]);

  // Track when drawer closes without completing order
  useEffect(() => {
    if (!isOpen && currentStep === "checkout") {
      sendAbandonedCheckout();
    }
  }, [isOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        // Track before closing if on checkout
        if (currentStep === "checkout") {
          sendAbandonedCheckout();
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, currentStep]);

  // Reset tracking when drawer opens fresh
  useEffect(() => {
    if (isOpen) {
      abandonedCheckoutSent.current = false;
      formInteracted.current = false;
      orderSubmittingRef.current = false;
      setOrderCompleted(false);
      setIsSubmittingOrder(false);
    }
  }, [isOpen]);

  // Cart functions
  const handleIncreament = (id) => dispatch(increament({ id }));
  const handleDecreament = (id) => dispatch(decreament({ id }));

  const handleRemove = (id) => {
    setRemovingItem(id);
    setTimeout(() => {
      dispatch(removeCart({ id }));
      setRemovingItem(null);
    }, 300);
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is empty",
        text: "Please add items to your cart before checkout",
        confirmButtonColor: getPrimaryColor(),
      });
      return;
    }
    setCurrentStep("checkout");
  };

  useEffect(() => {
    if (isDirectBuy && isOpen) {
      setCurrentStep("checkout");
    }
  }, [isDirectBuy, isOpen]);

  // Checkout functions with tracking
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    formInteracted.current = true; // Mark that user has interacted
  };

  const handleDistrictChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      district: selectedOption?.value || ""
    }));
    formInteracted.current = true;
  };

  // Fetch shipping cost
  useEffect(() => {
    if (formData.district) {
      const fetchShippingCost = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/shipping-costs-latest`
          );
          const data = response.data;

          if (formData.district === "dhaka") {
            setShippingAmount(data.inside_dhaka || data.one_shipping_cost || 0);
          } else {
            setShippingAmount(data.outside_dhaka || data.one_shipping_cost || 0);
          }
        } catch (error) {
          console.error("Error fetching shipping cost:", error);
          setShippingAmount(0);
        }
      };

      fetchShippingCost();
    }
  }, [formData.district]);
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (orderSubmittingRef.current) return;

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Your cart is empty",
        text: "Please add items to your cart before checking out.",
        confirmButtonColor: getPrimaryColor(),
      });
      return;
    }

    orderSubmittingRef.current = true;
    setIsSubmittingOrder(true);

    // Mark order as completed BEFORE API call
    setOrderCompleted(true);

    const getFacebookParams = () => {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      return {
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
      };
    };

    const { fbp, fbc } = getFacebookParams();
    const user_id = localStorage.getItem('user_id') ?? null;

    const orderData = {
      ...formData,
      cart: cartItems,
      user_id,
      shipping_cost: shippingAmount,
      total_amount: finalTotal,
      coupon_code: appliedCoupon?.code || null,
      checkout_session_id: getSessionId(),
      fbp: fbp,
      fbc: fbc,
      event_source_url: window.location.href,
    };

    try {
      // Mark abandoned checkout as converted BEFORE placing order
      if (formData.phone) {
        try {
          const session_id = getSessionId();
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/mark-checkout-converted`,
            { session_id, phone: formData.phone },
            { withCredentials: true }
          );
        } catch (err) {
          console.error("Failed to mark checkout as converted:", err);
        }
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders`,
        orderData
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: "Thank you for your purchase! Order placed successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
        });

        dispatch(clearCart());
        setCurrentStep("cart");
        setFormData({
          name: "",
          phone: "",
          address: "",
          district: "",
          payment_method: "cash",
          delivery_notes: "",
        });
        setAppliedCoupon(null);

        // Reset tracking flags
        abandonedCheckoutSent.current = false;
        formInteracted.current = false;
        orderSubmittingRef.current = false;
        setIsSubmittingOrder(false);

        onClose();
      } else {
        throw new Error("Unexpected order response");
      }
    } catch (error) {
      console.error("Order submission error:", error);

      setOrderCompleted(false);
      orderSubmittingRef.current = false;
      setIsSubmittingOrder(false);
      const couponError = error.response?.data?.errors?.coupon_code?.[0];
      if (couponError) {
        setAppliedCoupon(null);
        toast.error(couponError);
        return;
      }
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const backToCart = () => {
    // Track before going back if user filled phone
    if (formData.phone && formInteracted.current) {
      sendAbandonedCheckout();
    }
    setCurrentStep("cart");
  };

  const handleClose = () => {
    // Track before closing if on checkout
    if (currentStep === "checkout") {
      sendAbandonedCheckout();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="cart-drawer-overlay">
        <div className="cart-drawer">
          <CartDrawerHeader
            currentStep={currentStep}
            cartCount={cartCount}
            onClose={handleClose}
            onBack={backToCart}
          />

          <div className="cart-drawer-content">
            {currentStep === "cart" ? (
              <CartStep
                cartItems={cartItems}
                totalPrice={totalPrice}
                onIncreament={handleIncreament}
                onDecreament={handleDecreament}
                onRemove={handleRemove}
                onProceed={proceedToCheckout}
                removingItem={removingItem}
                onClose={handleClose}
              />
            ) : (
              <CheckoutStep
                formData={formData}
                shippingAmount={shippingAmount}
                finalTotal={finalTotal}
                cartItems={cartItems}
                onInputChange={handleInputChange}
                onDistrictChange={handleDistrictChange}
                onSubmit={handleCheckoutSubmit}
                isSubmitting={isSubmittingOrder}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={setAppliedCoupon}
                onRemoveCoupon={() => setAppliedCoupon(null)}
              />
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
