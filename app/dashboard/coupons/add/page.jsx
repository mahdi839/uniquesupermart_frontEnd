"use client";

import { useRouter } from "next/navigation";
import CouponForm from "../components/CouponForm";

export default function CreateCouponPage() {
  const router = useRouter();

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">Create Coupon</h1>
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
