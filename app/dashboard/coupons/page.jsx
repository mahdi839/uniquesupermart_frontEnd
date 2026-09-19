"use client";

import React, { useEffect, useState } from "react";
import CouponTable from "./components/CouponTable";
import Link from "next/link";
import PageLoader from "@/app/components/loader/pageLoader";
import Pagination from "../orders/components/Pagination";
import { FaSearch } from "react-icons/fa";

export default function Page() {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const params = new URLSearchParams({ page: String(page) });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`${baseUrl}api/coupons?${params.toString()}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });

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
    <div className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Coupons</h1>
        <Link href="/dashboard/coupons/add">
          <button className="btn btn-success btn-md">Add Coupon</button>
        </Link>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
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
            <div className="col-md-4 text-end text-muted">
              Total: <strong>{pagination.total}</strong> coupons
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!error && (
        <>
          <CouponTable coupons={coupons} onDeleted={fetchCoupons} />
          {pagination.last_page > 1 && (
            <Pagination page={page} setPage={setPage} pagination={pagination} />
          )}
        </>
      )}
    </div>
  );
}
