"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../orders/components/Pagination";
import CustomerTable from "./components/CustomerTable";
import useIndexData from "@/app/hooks/useIndexData";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    badge: "",
  });

  const buildIndexUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `api/customer-profiles?page=${page}`;
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return `${baseUrl}&${params.toString()}`;
  };

  const { indexData, loading, data, pagination } = useIndexData();

  useEffect(() => {
    indexData(buildIndexUrl());
  }, [page, filters]);

  const handleApplyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      search: "",
      badge: "",
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Customers</h2>
      </div>

      <CustomerTable
        loading={loading}
        customers={data.data || []}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {pagination.last_page > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          pagination={pagination}
        />
      )}
    </div>
  );
}
