"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function formatLimit(used, limit) {
  if (limit == null) return `${used} / Unlimited`;
  return `${used} / ${limit}`;
}

function formatValue(coupon) {
  if (coupon.discount_type === "percent") {
    const cap = coupon.max_discount ? ` · max ৳${coupon.max_discount}` : "";
    return `${coupon.discount_value}% off${cap}`;
  }
  return `৳${coupon.discount_value} off`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CouponTable({ coupons, onDeleted }) {
  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/coupons/${id}`;

    const result = await Swal.fire({
      title: "Delete this coupon?",
      text: "Customers will no longer be able to use this code.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Coupon deleted");
      onDeleted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle coupon-table mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Code / Name</th>
            <th>Discount</th>
            <th>Start / Expires</th>
            <th>Scope / Status</th>
            <th>Usage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">
                No coupons found
              </td>
            </tr>
          )}
          {coupons.map((coupon, index) => (
            <tr key={coupon.id}>
              <td className="text-muted">{index + 1}</td>
              <td className="coupon-code-name">
                <code>{coupon.code}</code>
                <div className="fw-semibold mt-1">{coupon.name}</div>
              </td>
              <td>
                <span className="fw-semibold">{formatValue(coupon)}</span>
                {coupon.min_subtotal ? (
                  <div className="small text-muted">Min ৳{coupon.min_subtotal}</div>
                ) : null}
              </td>
              <td className="coupon-date-line">
                <div>
                  <strong>Start</strong> {formatDate(coupon.starts_at)}
                </div>
                <div>
                  <strong>End</strong> {coupon.expires_at ? formatDate(coupon.expires_at) : "No expiry"}
                </div>
              </td>
              <td>
                <div className="coupon-scope-status">
                  {coupon.applies_to === "products" ? (
                    <span className="badge bg-info text-dark">
                      {(coupon.products || []).map((p) => p.title).join(", ") || "Selected products"}
                    </span>
                  ) : coupon.applies_to === "categories" ? (
                    <span className="badge bg-warning text-dark">
                      {(coupon.categories || []).map((c) => c.name).join(", ") || "Selected categories"}
                    </span>
                  ) : (
                    <span className="badge bg-secondary">All products</span>
                  )}
                  <span className={`badge ${coupon.is_active ? "bg-success" : "bg-danger"}`}>
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </td>
              <td>
                <div className="fw-semibold">
                  {formatLimit(coupon.applied_usages_count || 0, coupon.usage_limit)}
                </div>
                <div className="small text-muted">
                  {coupon.per_phone_limit ? `${coupon.per_phone_limit} / phone` : "Unlimited / phone"}
                </div>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Link href={`/dashboard/coupons/edit/${coupon.id}`}>
                    <button className="btn btn-sm btn-outline-primary">
                      <FaEdit /> Edit
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(coupon.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
