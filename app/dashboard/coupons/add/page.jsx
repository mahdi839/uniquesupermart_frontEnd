"use client";

import { useRouter } from "next/navigation";
import CouponForm from "../components/CouponForm";
import "../coupons.css";

export default function CreateCouponPage() {
  const router = useRouter();

  return (
    <div className="container-fluid px-4 py-4 coupon-page">
      <div className="coupon-hero mb-4">
        <div>
          <h1 className="h3 mb-1">Create Coupon</h1>
          <p className="text-muted mb-0">Set discount rules, schedule, and usage limits.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/coupons")}
          className="btn btn-outline-secondary"
        >
          Back to Coupons
        </button>
      </div>
      <CouponForm mode="create" />
    </div>
  );
}
