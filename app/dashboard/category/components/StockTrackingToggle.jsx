"use client";

import React from "react";

/**
 * Turns a category into a "stock category". When it is on, every product in the
 * category has its stock enforced and the storefront shows colour/size
 * availability filters.
 */
export default function StockTrackingToggle({
  value,
  onChange,
  disabled = false,
  applyToProducts,
  onApplyToProductsChange,
}) {
  const active = Boolean(value);

  return (
    <div className={`stock-toggle-card ${active ? "is-active" : ""}`}>
      <div className="stock-toggle-main">
        <div className="stock-toggle-icon">
          <i className={`fas ${active ? "fa-boxes-stacked" : "fa-box-open"}`} />
        </div>

        <div className="stock-toggle-copy">
          <div className="stock-toggle-title">
            Stock Tracking
            <span className={`stock-toggle-pill ${active ? "on" : "off"}`}>
              {active ? "ON" : "OFF"}
            </span>
          </div>
          <p className="stock-toggle-desc">
            {active
              ? "Products in this category keep a real stock count per colour and size. Customers see availability, and confirmed orders reduce stock automatically."
              : "Products in this category sell without a stock limit. Turn this on for categories where you hold physical inventory."}
          </p>
        </div>

        <button
          type="button"
          className={`stock-switch ${active ? "on" : ""}`}
          role="switch"
          aria-checked={active}
          aria-label="Toggle stock tracking for this category"
          disabled={disabled}
          onClick={() => onChange(!active)}
        >
          <span className="stock-switch-knob" />
        </button>
      </div>

      {active && typeof onApplyToProductsChange === "function" && (
        <label className="stock-toggle-extra">
          <input
            type="checkbox"
            checked={Boolean(applyToProducts)}
            onChange={(e) => onApplyToProductsChange(e.target.checked)}
            disabled={disabled}
          />
          <span>
            Also switch tracking on for every product already in this category
          </span>
        </label>
      )}

      <style jsx>{`
        .stock-toggle-card {
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #fff;
          padding: 18px 20px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .stock-toggle-card.is-active {
          border-color: #b8e6cf;
          background: linear-gradient(180deg, #f5fdf9 0%, #ffffff 100%);
          box-shadow: 0 6px 18px rgba(20, 121, 95, 0.08);
        }
        .stock-toggle-main {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .stock-toggle-icon {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          background: #f1f3f7;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        .stock-toggle-card.is-active .stock-toggle-icon {
          background: #e2f6ec;
          color: #14795f;
        }
        .stock-toggle-copy {
          flex: 1 1 auto;
          min-width: 0;
        }
        .stock-toggle-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }
        .stock-toggle-pill {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 20px;
        }
        .stock-toggle-pill.on {
          background: #d6f5e5;
          color: #0f6b52;
        }
        .stock-toggle-pill.off {
          background: #eef0f4;
          color: #7b8494;
        }
        .stock-toggle-desc {
          margin: 5px 0 0;
          font-size: 12.5px;
          line-height: 1.55;
          color: #6b7280;
        }
        .stock-switch {
          flex-shrink: 0;
          position: relative;
          width: 52px;
          height: 28px;
          border: none;
          border-radius: 999px;
          background: #d7dbe2;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s ease;
        }
        .stock-switch:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .stock-switch.on {
          background: #17a97f;
        }
        .stock-switch-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.22);
          transition: transform 0.2s ease;
        }
        .stock-switch.on .stock-switch-knob {
          transform: translateX(24px);
        }
        .stock-toggle-extra {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 16px 0 0;
          padding-top: 14px;
          border-top: 1px dashed #d9e5df;
          font-size: 12.5px;
          color: #4b5563;
          cursor: pointer;
        }
        .stock-toggle-extra input {
          margin-top: 2px;
          width: 15px;
          height: 15px;
          accent-color: #17a97f;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
