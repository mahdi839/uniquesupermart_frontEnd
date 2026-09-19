"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CouponForm from "../../components/CouponForm";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id;
  const [usages, setUsages] = useState([]);
  const [loadingUsages, setLoadingUsages] = useState(true);

  useEffect(() => {
    async function loadUsages() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupons/${couponId}/usages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsages(res.data.data || []);
      } catch (error) {
        setUsages([]);
      } finally {
        setLoadingUsages(false);
      }
    }

    if (couponId) loadUsages();
  }, [couponId]);

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">Edit Coupon</h1>
        <button
          onClick={() => router.push("/dashboard/coupons")}
          className="btn btn-outline-secondary"
        >
          Back to Coupons
        </button>
      </div>

      <CouponForm mode="edit" couponId={couponId} />

      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 fw-bold text-primary">Usage Log</h6>
        </div>
        <div className="card-body">
          {loadingUsages ? (
            <p className="text-muted mb-0">Loading usages...</p>
          ) : usages.length === 0 ? (
            <p className="text-muted mb-0">No orders have used this coupon yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Phone</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {usages.map((usage) => (
                    <tr key={usage.id}>
                      <td>{usage.order?.order_number || usage.order_id}</td>
                      <td>{usage.phone}</td>
                      <td>৳{usage.discount_amount}</td>
                      <td>
                        <span
                          className={`badge ${
                            usage.status === "applied" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {usage.status}
                        </span>
                      </td>
                      <td>{usage.created_at ? new Date(usage.created_at).toLocaleString() : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
