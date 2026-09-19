"use client";

import React, { useEffect, useState } from "react";
import CouponTable from "./components/CouponTable";
import CouponStatCards from "./components/CouponStatCards";
import Link from "next/link";
import PageLoader from "@/app/components/loader/pageLoader";
import Pagination from "../orders/components/Pagination";
import { FaPlus, FaSearch, FaTicketAlt, FaBolt, FaChartLine, FaCalendarDay } from "react-icons/fa";
import "./coupons.css";

export default function Page() {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    total_usage: 0,
    today_usage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupons/summary`, {
        cache: "no-store",
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        total: data.total || 0,
        ongoing: data.ongoing || 0,
        total_usage: data.total_usage || 0,
        today_usage: data.today_usage || 0,
      });
    } catch (err) {
      // Keep the table usable even if summary fails.
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ page: String(page) });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/coupons?${params.toString()}`,
        { cache: "no-store", headers: authHeaders() }
      );

      if (!res.ok) throw new Error("Failed to load coupons");

      const data = await res.json();
      setCoupons(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== "") {
        setPage(1);
        setIsSearching(true);
        fetchCoupons();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (loading && !isSearching) return <PageLoader />;

  return (
    <div className="container-fluid my-4 coupon-page">
      <div className="coupon-hero mb-4">
        <div>
          <h1 className="h3 mb-1">Coupons</h1>
          <p className="text-muted mb-0">Create, schedule, and monitor discount codes.</p>
        </div>
        <Link href="/dashboard/coupons/add">
          <button className="btn btn-success">
            <FaPlus className="me-2" />
            Add Coupon
          </button>
        </Link>
      </div>

      <CouponStatCards
        items={[
          { label: "Total Coupons", value: stats.total, tone: "coupon-stat-total", icon: <FaTicketAlt /> },
          { label: "Ongoing Coupons", value: stats.ongoing, tone: "coupon-stat-ongoing", icon: <FaBolt /> },
          { label: "Total Usage", value: stats.total_usage, tone: "coupon-stat-usage", icon: <FaChartLine /> },
          { label: "Today Usage", value: stats.today_usage, tone: "coupon-stat-today", icon: <FaCalendarDay /> },
        ]}
      />

      <div className="card coupon-panel mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search coupons by code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                  setTimeout(fetchCoupons, 0);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!error && (
        <div className="card coupon-panel">
          <div className="card-body p-0">
            <CouponTable
              coupons={coupons}
              onDeleted={() => {
                fetchCoupons();
                fetchSummary();
              }}
            />
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
