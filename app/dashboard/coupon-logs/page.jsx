"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PageLoader from "@/app/components/loader/pageLoader";
import Pagination from "../orders/components/Pagination";
import CouponStatCards from "../coupons/components/CouponStatCards";
import {
  FaSearch,
  FaClipboardList,
  FaCheckCircle,
  FaUndo,
  FaCalendarDay,
} from "react-icons/fa";
import "../coupons/coupons.css";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function CouponLogsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CouponLogsContent />
    </Suspense>
  );
}

function CouponLogsContent() {
  const searchParams = useSearchParams();
  const initialCouponId = searchParams.get("coupon_id") || "";

  const [logs, setLogs] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [stats, setStats] = useState({ total: 0, applied: 0, released: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [couponId, setCouponId] = useState(initialCouponId);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (searchQuery) params.set("search", searchQuery);
    if (status) params.set("status", status);
    if (couponId) params.set("coupon_id", couponId);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    return params.toString();
  }, [page, searchQuery, status, couponId, startDate, endDate]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupons/options`, {
          cache: "no-store",
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        setCoupons(data.data || []);
      } catch (err) {
        setCoupons([]);
      }
    }
    loadCoupons();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [queryString]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupon-usages?${queryString}`, {
        cache: "no-store",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load coupon logs");
      const data = await res.json();
      setLogs(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
      });
      setStats({
        total: data.stats?.total || 0,
        applied: data.stats?.applied || 0,
        released: data.stats?.released || 0,
        today: data.stats?.today || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatus("");
    setCouponId("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (loading && logs.length === 0) return <PageLoader />;

  return (
    <div className="container-fluid my-4 coupon-page">
      <div className="coupon-hero mb-4">
        <div>
          <h1 className="h3 mb-1">Coupon Logs</h1>
          <p className="text-muted mb-0">Every applied and released coupon use, by phone and order.</p>
        </div>
      </div>

      <CouponStatCards
        items={[
          { label: "Total Logs", value: stats.total, tone: "coupon-stat-total", icon: <FaClipboardList /> },
          { label: "Applied", value: stats.applied, tone: "coupon-stat-applied", icon: <FaCheckCircle /> },
          { label: "Released", value: stats.released, tone: "coupon-stat-released", icon: <FaUndo /> },
          { label: "Today Applied", value: stats.today, tone: "coupon-stat-today", icon: <FaCalendarDay /> },
        ]}
      />

      <div className="card coupon-panel mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-lg-4">
              <label className="form-label small text-muted mb-1">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone, order no, or coupon code"
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-2">
              <label className="form-label small text-muted mb-1">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
              >
                <option value="">All statuses</option>
                <option value="applied">Applied</option>
                <option value="released">Released</option>
              </select>
            </div>
            <div className="col-md-4 col-lg-2">
              <label className="form-label small text-muted mb-1">Coupon</label>
              <select
                className="form-select"
                value={couponId}
                onChange={(e) => {
                  setPage(1);
                  setCouponId(e.target.value);
                }}
              >
                <option value="">All coupons</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 col-lg-2">
              <label className="form-label small text-muted mb-1">From</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => {
                  setPage(1);
                  setStartDate(e.target.value);
                }}
              />
            </div>
            <div className="col-md-3 col-lg-2">
              <label className="form-label small text-muted mb-1">To</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => {
                  setPage(1);
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!error && (
        <div className="card coupon-panel">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle coupon-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Coupon</th>
                    <th>Order</th>
                    <th>Phone</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        No coupon logs found
                      </td>
                    </tr>
                  )}
                  {logs.map((usage, index) => (
                    <tr key={usage.id}>
                      <td className="text-muted">{index + 1}</td>
                      <td className="coupon-code-name">
                        <code>{usage.coupon?.code || "—"}</code>
                        <div className="small text-muted">{usage.coupon?.name}</div>
                      </td>
                      <td>
                        {usage.order?.id ? (
                          <Link href={`/dashboard/orders/edit/${usage.order.id}`}>
                            {usage.order.order_number}
                          </Link>
                        ) : (
                          usage.order_id
                        )}
                      </td>
                      <td>{usage.phone}</td>
                      <td className="fw-semibold">৳{usage.discount_amount}</td>
                      <td>
                        <span
                          className={`badge ${
                            usage.status === "applied" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {usage.status}
                        </span>
                      </td>
                      <td className="small">{formatDate(usage.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {pagination.last_page > 1 && (
            <div className="card-body border-top">
              <Pagination page={page} setPage={setPage} pagination={pagination} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
