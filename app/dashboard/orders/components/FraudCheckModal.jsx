"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaShieldAlt,
  FaSyncAlt,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
import "./fraudCheckModal.css";

const EMPTY_RESULT = {
  summary: { total_parcel: 0, success_parcel: 0, cancelled_parcel: 0, success_ratio: 0 },
  couriers: [],
  reports: [],
  meta: {},
};

function number(value) {
  return Number(value || 0).toLocaleString();
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function scoreState(ratio, total) {
  if (!total) return { tone: "neutral", label: "No history", description: "No parcel history was found for this phone number." };
  if (ratio >= 80) return { tone: "good", label: "Strong", description: "Most recorded parcels were delivered successfully." };
  if (ratio >= 60) return { tone: "warning", label: "Mixed", description: "Delivery outcomes are mixed; review the order details." };
  return { tone: "danger", label: "Review", description: "A high cancellation rate needs additional review." };
}

function Metric({ icon, label, value, tone = "neutral" }) {
  return (
    <div className={`courier-metric courier-metric-${tone}`}>
      <span className="courier-metric-icon">{icon}</span>
      <span className="courier-metric-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function FraudCheckModal({ order, onClose }) {
  const [result, setResult] = useState(EMPTY_RESULT);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchResult = useCallback(async (forceRefresh = false) => {
    if (!order?.id) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setError("");
    forceRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${order.id}/courier-check`,
        forceRefresh ? { force_refresh: true } : {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(data.data || EMPTY_RESULT);
    } catch (err) {
      const message = err.response?.data?.message || "Courier check failed.";
      setError(message);
      if (forceRefresh) toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [order?.id]);

  useEffect(() => { fetchResult(); }, [fetchResult]);

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  const summary = result.summary || EMPTY_RESULT.summary;
  const ratio = Math.max(0, Math.min(100, Number(summary.success_ratio || 0)));
  const state = scoreState(ratio, Number(summary.total_parcel || 0));
  const scoreStyle = { "--score-angle": `${ratio * 3.6}deg` };

  return (
    <div className="courier-modal-backdrop" onMouseDown={onClose}>
      <div
        className="courier-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="courier-check-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="courier-modal-header">
          <div className="courier-modal-heading">
            <span className="courier-header-icon"><FaShieldAlt /></span>
            <div>
              <span className="courier-eyebrow">Customer intelligence</span>
              <h2 id="courier-check-title">Courier delivery profile</h2>
              <div className="courier-customer-line">
                <strong>{order?.name || "Customer"}</strong>
                <span><FaPhoneAlt /> {order?.phone || "No phone number"}</span>
              </div>
            </div>
          </div>
          <button type="button" className="courier-close-btn" aria-label="Close courier profile" onClick={onClose}>
            <FaTimes />
          </button>
        </header>

        <main className="courier-modal-body">
          {loading ? (
            <div className="courier-state courier-loading-state">
              <span className="courier-loading-icon"><FaShieldAlt /></span>
              <h3>Checking delivery history</h3>
              <p>We’re securely retrieving this customer’s courier records.</p>
            </div>
          ) : error ? (
            <div className="courier-state courier-error-state">
              <span className="courier-state-icon"><FaExclamationTriangle /></span>
              <h3>We couldn’t complete the check</h3>
              <p>{error}</p>
              <button type="button" className="courier-primary-btn" onClick={() => fetchResult(true)} disabled={refreshing}>
                <FaSyncAlt className={refreshing ? "courier-spin" : ""} /> Try again
              </button>
            </div>
          ) : (
            <>
              <section className={`courier-overview courier-overview-${state.tone}`}>
                <div className="courier-score-wrap">
                  <div className="courier-score" style={scoreStyle}>
                    <div className="courier-score-inner"><strong>{ratio.toFixed(0)}%</strong><span>success</span></div>
                  </div>
                </div>
                <div className="courier-overview-copy">
                  <div className="courier-overview-kicker">Overall delivery success <span className={`courier-rating courier-rating-${state.tone}`}>{state.label}</span></div>
                  <p>{state.description}</p>
                  <div className="courier-progress"><span style={{ width: `${ratio}%` }} /></div>
                  <small>Based on {number(summary.total_parcel)} recorded parcel{Number(summary.total_parcel) === 1 ? "" : "s"} across supported couriers.</small>
                </div>
              </section>

              <section className="courier-metrics-grid" aria-label="Delivery summary">
                <Metric icon={<FaBoxOpen />} label="Total parcels" value={number(summary.total_parcel)} />
                <Metric icon={<FaCheckCircle />} label="Delivered" value={number(summary.success_parcel)} tone="good" />
                <Metric icon={<FaTimesCircle />} label="Cancelled" value={number(summary.cancelled_parcel)} tone="danger" />
              </section>

              <section className="courier-section">
                <div className="courier-section-heading"><div><span className="courier-eyebrow">Network view</span><h3>Courier breakdown</h3></div><span className="courier-section-count">{result.couriers?.length || 0} couriers</span></div>
                {result.couriers?.length > 0 ? (
                  <div className="courier-breakdown-list">
                    {result.couriers.map((courier, index) => {
                      const courierRatio = Math.max(0, Math.min(100, Number(courier.success_ratio || 0)));
                      return (
                        <div className={`courier-breakdown-row courier-theme-${index % 6}`} key={courier.key || courier.name}>
                          <div className="courier-brand">
                            {courier.logo ? <img src={courier.logo} alt="" /> : <span className="courier-brand-fallback"><FaBoxOpen /></span>}
                            <div><strong>{courier.name || "Courier"}</strong><small>{number(courier.total_parcel)} total parcels</small></div>
                          </div>
                          <div className="courier-breakdown-stats"><span><FaCheckCircle /> {number(courier.success_parcel)} delivered</span><span><FaTimesCircle /> {number(courier.cancelled_parcel)} cancelled</span></div>
                          <div className="courier-row-score"><strong>{courierRatio.toFixed(1)}%</strong><div className="courier-progress"><span style={{ width: `${courierRatio}%` }} /></div></div>
                        </div>
                      );
                    })}
                  </div>
                ) : <div className="courier-empty"><FaClock /><span>No courier-specific history was returned.</span></div>}
              </section>

              <section className="courier-section courier-reports-section">
                <div className="courier-section-heading"><div><span className="courier-eyebrow">Risk signals</span><h3>Merchant reports</h3></div><span className="courier-section-count">{result.reports?.length || 0} reports</span></div>
                {result.reports?.length > 0 ? (
                  <div className="courier-reports-list">
                    {result.reports.map((report, index) => (
                      <div className="courier-report-card" key={report.id || `${report.courier_name || report.courierName}-${index}`}>
                        <span className="courier-report-icon"><FaExclamationTriangle /></span>
                        <div><div className="courier-report-meta"><strong>{report.courier_name || report.courierName || "Courier"}</strong><small>{formatDate(report.created_at)}</small></div><p><strong>{report.name || "Merchant report"}</strong>{report.details ? ` — ${report.details}` : ""}</p></div>
                      </div>
                    ))}
                  </div>
                ) : <div className="courier-empty"><FaCheckCircle /><span>No merchant reports were returned.</span></div>}
                <p className="courier-disclaimer"><FaShieldAlt /> Courier history is an external signal, not a definitive fraud verdict. Consider the full order context before taking action.</p>
              </section>
            </>
          )}
        </main>

        <footer className="courier-modal-footer">
          <span className="courier-checked-at">{result.meta?.checked_at ? <><FaClock /> Checked {formatDate(result.meta.checked_at)}{result.meta.cached ? " · cached" : ""}</> : ""}</span>
          <div className="courier-footer-actions">
            {!loading && !error && <button type="button" className="courier-refresh-btn" onClick={() => fetchResult(true)} disabled={refreshing}><FaSyncAlt className={refreshing ? "courier-spin" : ""} /> {refreshing ? "Refreshing" : "Refresh"}</button>}
            <button type="button" className="courier-done-btn" onClick={onClose}>Done</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
