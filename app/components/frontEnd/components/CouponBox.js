"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function CouponBox({
  phone,
  cartItems,
  appliedCoupon,
  onApply,
  onRemove,
}) {
  const [code, setCode] = useState(appliedCoupon?.code || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lastValidatedRef = useRef("");

  useEffect(() => {
    if (appliedCoupon?.code && appliedCoupon.code !== code) {
      setCode(appliedCoupon.code);
    }
    if (!appliedCoupon) {
      lastValidatedRef.current = "";
    }
  }, [appliedCoupon, code]);

  const cartKey = (cartItems || [])
    .map((item) => `${item.id}:${item.qty}:${item.totalPrice}`)
    .join("|");

  useEffect(() => {
    if (!appliedCoupon?.code) return;

    const applyFromServer = async () => {
      if (!phone) {
        onRemove?.();
        setError("Enter your phone number to use a coupon.");
        return;
      }

      const signature = `${appliedCoupon.code}|${phone}|${cartKey}`;
      if (lastValidatedRef.current === signature) return;
      lastValidatedRef.current = signature;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupons/validate`,
          { code: appliedCoupon.code, phone, cart: cartItems }
        );
        onApply?.({
          code: res.data.coupon.code,
          name: res.data.coupon.name,
          discount_amount: res.data.discount_amount,
        });
        setError("");
      } catch (err) {
        const message =
          err.response?.data?.errors?.coupon_code?.[0] ||
          err.response?.data?.message ||
          "This coupon is no longer valid.";
        setError(message);
        onRemove?.();
      }
    };

    applyFromServer();
  }, [appliedCoupon?.code, phone, cartKey]);

  const handleApply = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a coupon code.");
      return;
    }
    if (!phone) {
      setError("Enter your phone number first.");
      return;
    }
    if (!cartItems?.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupons/validate`,
        { code: trimmed, phone, cart: cartItems }
      );
      lastValidatedRef.current = `${res.data.coupon.code}|${phone}|${cartKey}`;
      onApply?.({
        code: res.data.coupon.code,
        name: res.data.coupon.name,
        discount_amount: res.data.discount_amount,
      });
      setCode(res.data.coupon.code);
    } catch (err) {
      const message =
        err.response?.data?.errors?.coupon_code?.[0] ||
        err.response?.data?.message ||
        "Invalid coupon code.";
      setError(message);
      onRemove?.();
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setError("");
    lastValidatedRef.current = "";
    onRemove?.();
  };

  return (
    <div className="coupon-box mt-3 mb-3">
      <label className="form-label fw-semibold mb-2">Have a coupon?</label>
      {appliedCoupon ? (
        <div className="coupon-applied d-flex justify-content-between align-items-center gap-2 p-2 border border-success rounded bg-light">
          <div>
            <strong>{appliedCoupon.code}</strong>
            {appliedCoupon.name ? (
              <span className="text-muted"> — {appliedCoupon.name}</span>
            ) : null}
            <div className="text-success small">-৳{appliedCoupon.discount_amount}</div>
          </div>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleRemove}>
            Remove
          </button>
        </div>
      ) : (
        <div className="coupon-input-row d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApply(e);
              }
            }}
            disabled={!phone || loading}
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleApply}
            disabled={!phone || loading}
          >
            {loading ? "..." : "Apply"}
          </button>
        </div>
      )}
      {!phone && (
        <small className="text-muted d-block mt-1">
          Enter your phone number first to apply a coupon.
        </small>
      )}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
