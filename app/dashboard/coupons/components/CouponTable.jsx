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
    const cap = coupon.max_discount ? ` (max ৳${coupon.max_discount})` : "";
    return `${coupon.discount_value}% off${cap}`;
  }
  return `৳${coupon.discount_value} off`;
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
      <table className="table table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Code</th>
            <th>Name</th>
            <th>Discount</th>
            <th>Scope</th>
            <th>Usage</th>
            <th>Per phone</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center text-danger">
                No Coupons Found
              </td>
            </tr>
          )}
          {coupons.map((coupon, index) => (
            <tr key={coupon.id}>
              <td>{index + 1}</td>
              <td>
                <code>{coupon.code}</code>
              </td>
              <td>{coupon.name}</td>
              <td>{formatValue(coupon)}</td>
              <td>
                {coupon.applies_to === "products" ? (
                  <span className="badge bg-info text-dark">
                    {(coupon.products || []).map((p) => p.title).join(", ") || "Products"}
                  </span>
                ) : (
                  <span className="badge bg-secondary">All products</span>
                )}
              </td>
              <td>{formatLimit(coupon.applied_usages_count || 0, coupon.usage_limit)}</td>
              <td>{coupon.per_phone_limit ?? "Unlimited"}</td>
              <td>
                {coupon.expires_at
                  ? new Date(coupon.expires_at).toLocaleString()
                  : "No expiry"}
              </td>
              <td>
                <span className={`badge ${coupon.is_active ? "bg-success" : "bg-danger"}`}>
                  {coupon.is_active ? "Active" : "Inactive"}
                </span>
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
