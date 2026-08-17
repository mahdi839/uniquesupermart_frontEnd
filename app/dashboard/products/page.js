"use client";

import { useEffect, useState } from "react";
import ProductTable from "./components/ProductTable";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../orders/components/Pagination";
import { toast } from "react-toastify";
import { FaPlus, FaSpinner } from "react-icons/fa";

export default function ProductIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State ---
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [productData, setProductData] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // --- Build API URL ---
  const buildUrl = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    if (page) params.append("page", page);
    return `${baseUrl}api/products?${params.toString()}`;
  };

  // --- Fetch Products ---
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const response = await axios.get(buildUrl(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Paginated data from Laravel
      setProductData(Array.isArray(response.data?.data?.data) ? response.data.data.data : []);
      setPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total: response.data.data.total,
      });
    } catch (err) {
      console.error("Error fetching products", err);
      setError(err.response?.data?.message || "Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // --- Update URL query without reloading ---
  const updateURL = () => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page > 1) query.set("page", page);
    
    const queryString = query.toString();
    const newUrl = queryString ? `/dashboard/products?${queryString}` : '/dashboard/products';
    router.push(newUrl, { scroll: false });
  };

  // --- Effects ---
  useEffect(() => {
    fetchProducts();
  }, [page, status]);

  useEffect(() => {
    updateURL();
  }, [page, status, search]);

  // --- Debounce search ---
  useEffect(() => {
    const delay = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // Reset page when search changes
      } else {
        fetchProducts();
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const hasActiveFilters = search || status;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-bold text-gray-800">Products</h1>
          <p className="text-muted mb-0">
            Manage your product catalog
            {pagination.total !== undefined && (
              <span className="ms-2 badge bg-primary">{pagination.total} total</span>
            )}
          </p>
        </div>
        <Link href="/dashboard/products/add_product">
          <button className="btn btn-sm btn-primary px-4 py-2 fw-semibold shadow-sm">
            <FaPlus className="me-2" />
            Add Product
          </button>
        </Link>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Status Filter</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="prebook">Prebook</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              {hasActiveFilters && (
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <FaSpinner className="fa-spin fa-3x text-primary mb-3" />
            <p className="text-muted mb-0">Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchProducts}
          >
            Retry
          </button>
        </div>
      )}

      {/* Product Table */}
      {!loading && !error && (
        <ProductTable productData={productData} loading={loading} />
      )}

      {/* Pagination */}
      {!loading && !error && pagination.last_page > 1 && (
        <div className="mt-4">
          <Pagination page={page} setPage={setPage} pagination={pagination} />
        </div>
      )}
    </div>
  );
}
