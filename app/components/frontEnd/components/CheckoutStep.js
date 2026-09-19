import React from "react";
import { FaCreditCard } from "react-icons/fa";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import CouponBox from "./CouponBox";

export default function CheckoutStep({
  formData,
  shippingAmount,
  finalTotal,
  cartItems,
  onInputChange,
  onDistrictChange,
  onSubmit,
  isSubmitting = false,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  return (
    <div className="checkout-step">
      <form onSubmit={onSubmit} className="checkout-form">
        <CheckoutForm
          formData={formData}
          onInputChange={onInputChange}
          onDistrictChange={onDistrictChange}
        />

        <CouponBox
          phone={formData.phone}
          cartItems={cartItems}
          appliedCoupon={appliedCoupon}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />

        <OrderSummary
          cartItems={cartItems}
          shippingAmount={shippingAmount}
          finalTotal={finalTotal}
          discountAmount={appliedCoupon?.discount_amount || 0}
          couponCode={appliedCoupon?.code}
        />

        <button type="submit" className="btn btn-sm w-100 btn-grad" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Placing Order...
            </>
          ) : (
            <>
              <FaCreditCard className="me-2" />
              Place Order
            </>
          )}
        </button>
      </form>
    </div>
  );
}
