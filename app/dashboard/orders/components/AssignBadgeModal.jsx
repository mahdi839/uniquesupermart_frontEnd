"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CUSTOMER_BADGES } from "../../customers/badgeConfig";

export default function AssignBadgeModal({ order, onClose, onSaved }) {
  const [badgeTitle, setBadgeTitle] = useState(order?.assigned_badge?.title || "");
  const [saving, setSaving] = useState(false);

  if (!order) return null;

  const handleSave = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("No auth token found");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/customer-profiles/assign-badge`,
        {
          phone: order.phone,
          name: order.name,
          badge_title: badgeTitle || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Badge saved successfully");
      onSaved?.(data.data?.assigned_badge || null);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save badge");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign Customer Badge</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-2">
              <strong>{order.name || "N/A"}</strong>
            </p>
            <p className="text-muted small mb-3">{order.phone || "No phone"}</p>
            <label className="form-label fw-semibold">Badge</label>
            <select
              className="form-select"
              value={badgeTitle}
              onChange={(e) => setBadgeTitle(e.target.value)}
            >
              <option value="">No badge</option>
              {CUSTOMER_BADGES.map((badge) => (
                <option key={badge.title} value={badge.title}>
                  {badge.label}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || !order.phone}
            >
              {saving ? "Saving..." : "Save Badge"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
