// app/components/navbar/client/CartButton.jsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";


// Drawer is only loaded when user clicks the cart icon
const CartDrawer = dynamic(() => import("../../components/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

export default function CartButton() {
  const cartCount = useSelector((state) => state.cart.count);
  const cartItems = useSelector((state) => state.cart.items);

  const [isOpen, setIsOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setCartTotal(total);
  }, [cartItems]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-end">
        <button
          onClick={() => setIsOpen(true)}
          className="cart-icon-btn border-0 bg-transparent position-relative me-3"
          aria-label="Open cart"
        >
          <FaShoppingCart size={20} />
          {cartCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill theme-bg-primary"
            >
              {cartCount}
            </span>
          )}
        </button>

        <div className="header__cart__price d-none d-lg-block">
          <span className="fw-bold">Cart Total: {cartTotal} Tk</span>
        </div>
      </div>

      {/* Drawer is only mounted when opened */}
      {isOpen && <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
