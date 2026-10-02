"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { apiErrorMessage } from "@/lib/inventoryApi";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * The global kill switch. While it is off, stock is still counted, held and
 * deducted exactly as normal — the shop just never refuses an order because of
 * it. That lets the counts be verified against the shelves before customers can
 * be turned away.
 */
export default function EnforcementToggle() {
  const [enabled, setEnabled] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseUrl}api/site-settings`)
      .then(({ data }) =>
        setEnabled(Boolean(data?.data?.inventory_enforcement_enabled))
      )
      .catch(() => setEnabled(false));
  }, []);

  const toggle = useCallback(async () => {
    const next = !enabled;

    if (next) {
      const confirmed = await Swal.fire({
        title: "Start blocking out-of-stock orders?",
        html:
          "Customers will no longer be able to order a colour or size that shows " +
          "zero available.<br/><br/><b>Only turn this on once your counts match the shelves.</b>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, enforce stock",
        confirmButtonColor: "#7d0ba7",
      });

      if (!confirmed.isConfirmed) return;
    }

    setSaving(true);
    try {
      await axios.put(
        `${baseUrl}api/site-settings`,
        { inventory_enforcement_enabled: next },
        { headers: authHeaders() }
      );
      setEnabled(next);
      toast.success(
        next
          ? "Out-of-stock orders will now be blocked."
          : "Stock is being counted but orders are never blocked."
      );
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not save the setting"));
    } finally {
      setSaving(false);
    }
  }, [enabled]);

  if (enabled === null) return null;

  return (
    <div className={`enf-card ${enabled ? "on" : ""}`}>
      <div className="enf-text">
        <div className="enf-title">
          {enabled ? "Stock is enforced" : "Counting only"}
          <span className="enf-pill">{enabled ? "ON" : "OFF"}</span>
        </div>
        <p className="enf-desc">
          {enabled
            ? "Orders are refused when the chosen colour and size has nothing available."
            : "Stock is held and deducted as normal, but no order is ever refused. Safe to leave here until your counts are verified."}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Enforce stock limits at checkout"
        className={`enf-switch ${enabled ? "on" : ""}`}
        onClick={toggle}
        disabled={saving}
      >
        <span className="enf-knob" />
      </button>

      <style jsx>{`
        .enf-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 18px;
          border: 1px solid #e4e7ec;
          border-left: 3px solid #98a2b3;
          border-radius: 12px;
          background: #fff;
          margin-bottom: 18px;
        }
        .enf-card.on {
          border-left-color: #12b76a;
          background: linear-gradient(90deg, #f6fef9, #fff 60%);
        }
        .enf-text {
          flex: 1;
          min-width: 0;
        }
        .enf-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 800;
          color: #101828;
        }
        .enf-pill {
          padding: 1px 7px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          background: #f2f4f7;
          color: #667085;
        }
        .enf-card.on .enf-pill {
          background: #d1fadf;
          color: #027a48;
        }
        .enf-desc {
          margin: 4px 0 0;
          font-size: 12px;
          line-height: 1.5;
          color: #667085;
        }
        .enf-switch {
          flex-shrink: 0;
          width: 46px;
          height: 26px;
          border: none;
          border-radius: 999px;
          background: #d0d5dd;
          position: relative;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .enf-switch.on {
          background: #12b76a;
        }
        .enf-switch:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .enf-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(16, 24, 40, 0.2);
          transition: transform 0.2s ease;
        }
        .enf-switch.on .enf-knob {
          transform: translateX(20px);
        }

        @media (max-width: 575.98px) {
          .enf-card {
            gap: 12px;
            padding: 12px 14px;
          }
        }
      `}</style>
    </div>
  );
}
