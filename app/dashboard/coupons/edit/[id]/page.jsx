"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CouponForm from "../../components/CouponForm";
import "../../coupons.css";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id;

  return (
    <div className="container-fluid px-4 py-4 coupon-page">
      <div className="coupon-hero mb-4">
        <div>
          <h1 className="h3 mb-1">Edit Coupon</h1>
          <p className="text-muted mb-0">Update this code without changing past order discounts.</p>
        </div>
        <div className="d-flex gap-2">
          <Link href={`/dashboard/coupon-logs?coupon_id=${couponId}`}>
            <button className="btn btn-outline-secondary">View Logs</button>
          </Link>
          <button
            onClick={() => router.push("/dashboard/coupons")}
            className="btn btn-outline-secondary"
          >
            Back to Coupons
          </button>
        </div>
      </div>

      <CouponForm mode="edit" couponId={couponId} />
    </div>
  );
}
