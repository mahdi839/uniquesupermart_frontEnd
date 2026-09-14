"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import "./plan.css";

const EMPTY_PLAN = {
  has_subscription: false,
  plan_id: null,
  plan_name: "No active plan",
  plan_type: "",
  is_free: false,
  status: "unknown",
  next_due_date: null,
  expires_at: null,
  days_remaining: 0,
  frequency: "",
  price: null,
  api_calls: 0,
  paid_calls: 0,
  call_limit: 0,
  paid_limit: 0,
  remaining_free_calls: 0,
  remaining_paid_calls: 0,
};

function number(value) {
  return Number(value || 0).toLocaleString();
}

function date(value, includeTime = false) {
  if (!value) return "Not available";
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, includeTime
    ? { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" });
}

function usagePercent(remaining, limit) {
  if (!Number(limit)) return 0;
  return Math.max(0, Math.min(100, (Number(remaining || 0) / Number(limit)) * 100));
}

function UsageCard({ label, icon, remaining, limit, tone }) {
  const remainingValue = Number(remaining || 0);
  const limitValue = Number(limit || 0);
  return (
    <div className={`plan-usage-card plan-usage-${tone}`}>
      <div className="plan-usage-card-top">
        <span className="plan-usage-icon">{icon}</span>
        <div><span className="plan-card-label">{label}</span><strong>{number(remainingValue)}</strong><small>remaining</small></div>
      </div>
      <div className="plan-usage-track"><span style={{ width: `${usagePercent(remainingValue, limitValue)}%` }} /></div>
      <div className="plan-usage-foot"><span>Allowance</span><strong>{limitValue ? number(limitValue) : "Not provided"}</strong></div>
    </div>
  );
}

export default function CourierPlanPage() {
  const [plan, setPlan] = useState(EMPTY_PLAN);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPlan = useCallback(async (forceRefresh = false) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setError("");
    forceRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/fraud-checker/plan`, {
        params: forceRefresh ? { force_refresh: true } : {},
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlan({ ...EMPTY_PLAN, ...(data.data?.plan || {}) });
      setMeta(data.data?.meta || {});
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to load courier plan details.";
      setError(message);
      if (forceRefresh) toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const active = plan.status?.toLowerCase() === "active";
  const hasPlan = Boolean(
    plan.has_subscription ||
    plan.is_free ||
    (plan.plan_name && plan.plan_name !== EMPTY_PLAN.plan_name)
  );
  const planType = plan.is_free ? "Free plan" : (plan.plan_type ? `${plan.plan_type} plan` : "Subscription");

  if (loading) {
    return <div className="courier-plan-page courier-plan-state"><div className="courier-plan-spinner"><FaShieldAlt /></div><h3>Loading courier plan</h3><p>Retrieving subscription and usage details...</p></div>;
  }

  if (error) {
    return <div className="courier-plan-page courier-plan-state"><div className="courier-plan-state-icon courier-plan-error"><FaExclamationTriangle /></div><h3>Couldn’t load your courier plan</h3><p>{error}</p><button type="button" className="courier-plan-primary-btn" onClick={() => fetchPlan(true)} disabled={refreshing}><FaSyncAlt className={refreshing ? "courier-plan-spin" : ""} /> Try again</button></div>;
  }

  return (
    <div className="courier-plan-page">
      <div className="courier-plan-heading-row">
        <div><span className="courier-plan-eyebrow">BD Courier account</span><h1>Courier Plan &amp; Usage</h1><p>Monitor your subscription, renewal date, and available courier checker calls.</p></div>
        <button type="button" className="courier-plan-refresh-btn" onClick={() => fetchPlan(true)} disabled={refreshing}><FaSyncAlt className={refreshing ? "courier-plan-spin" : ""} /> {refreshing ? "Refreshing" : "Refresh"}</button>
      </div>

      {!hasPlan ? (
        <section className="courier-plan-empty-card"><span className="courier-plan-empty-icon"><FaCreditCard /></span><div><h2>No active subscription</h2><p>This API key does not currently have an active BD Courier subscription. Configure a valid key from Courier Checker settings, then refresh this page.</p></div><span className="courier-plan-status status-neutral">Not subscribed</span></section>
      ) : (
        <>
          <section className={`courier-plan-hero ${active ? "plan-hero-active" : "plan-hero-inactive"}`}>
            <div className="courier-plan-hero-main"><span className="courier-plan-hero-icon"><FaShieldAlt /></span><div><div className="courier-plan-label-row"><span className="courier-plan-eyebrow">Current subscription</span><span className={`courier-plan-status ${active ? "status-active" : "status-warning"}`}>{plan.status || "Unknown"}</span></div><h2>{plan.plan_name}</h2><p>{planType}{plan.plan_id ? ` · Plan #${plan.plan_id}` : ""}</p></div></div>
            <div className="courier-plan-days"><strong>{number(plan.days_remaining)}</strong><span>days remaining</span></div>
          </section>

          <div className="courier-plan-info-grid">
            <div className="courier-plan-info-card"><span className="courier-plan-info-icon"><FaCalendarAlt /></span><div><span>Next due date</span><strong>{date(plan.next_due_date)}</strong><small>Expires {date(plan.expires_at)}</small></div></div>
            <div className="courier-plan-info-card"><span className="courier-plan-info-icon"><FaMoneyBillWave /></span><div><span>Plan price</span><strong>{plan.price === null ? "Not provided" : `৳${number(plan.price)}`}</strong><small>{plan.frequency ? `Billed ${plan.frequency}` : "Billing frequency not provided"}</small></div></div>
            <div className="courier-plan-info-card"><span className="courier-plan-info-icon"><FaChartLine /></span><div><span>Total API calls</span><strong>{number(plan.api_calls)}</strong><small>{number(plan.paid_calls)} paid calls</small></div></div>
          </div>

          <section className="courier-plan-section"><div className="courier-plan-section-title"><div><span className="courier-plan-eyebrow">Call allowance</span><h2>Remaining usage</h2></div><span className="courier-plan-updated"><FaClock /> {meta.checked_at ? `Updated ${date(meta.checked_at, true)}` : "Usage from provider"}{meta.cached ? " · cached" : ""}</span></div><div className="courier-plan-usage-grid"><UsageCard label="Free calls" icon={<FaCheckCircle />} remaining={plan.remaining_free_calls} limit={plan.call_limit} tone="free" /><UsageCard label="Paid calls" icon={<FaCreditCard />} remaining={plan.remaining_paid_calls} limit={plan.paid_limit} tone="paid" /></div></section>

          <section className="courier-plan-details"><div className="courier-plan-section-title"><div><span className="courier-plan-eyebrow">Subscription information</span><h2>Plan details</h2></div></div><div className="courier-plan-details-grid"><div><span>Plan type</span><strong>{planType}</strong></div><div><span>Subscription status</span><strong>{plan.status || "Unknown"}</strong></div><div><span>Plan ID</span><strong>{plan.plan_id || "Not provided"}</strong></div><div><span>Renewal frequency</span><strong>{plan.frequency || "Not provided"}</strong></div></div></section>
        </>
      )}
    </div>
  );
}
