"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import inventoryApi, { apiErrorMessage } from "@/lib/inventoryApi";
import AdjustStockModal from "./components/AdjustStockModal";
import EnforcementToggle from "./components/EnforcementToggle";
import ProductStockModal from "./components/ProductStockModal";
import StockInModal from "./components/StockInModal";
import "./inventory.css";

const STOCK_FILTERS = [
  { key: "", label: "All" },
  { key: "in", label: "In stock" },
  { key: "low", label: "Low stock" },
  { key: "out", label: "Out of stock" },
  { key: "preorder", label: "Pre-order" },
];

function StatCard({ label, value, hint, accent }) {
  return (
    <div className="inv-stat" style={{ "--inv-accent": accent }}>
      <div className="inv-stat-label">{label}</div>
      <div className="inv-stat-value">{value}</div>
      {hint && <div className="inv-stat-hint">{hint}</div>}
    </div>
  );
}

function StockBadge({ variant, threshold }) {
  if (!variant.is_active) {
    return <span className="inv-badge inv-badge-off">Inactive</span>;
  }

  const available = variant.available ?? 0;

  if (available > threshold) {
    return <span className="inv-badge inv-badge-in">In stock</span>;
  }

  if (available > 0) {
    return <span className="inv-badge inv-badge-low">Low</span>;
  }

  if (variant.allow_preorder) {
    return <span className="inv-badge inv-badge-pre">Pre-order</span>;
  }

  return <span className="inv-badge inv-badge-out">Out</span>;
}

export default function InventoryPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  const [summary, setSummary] = useState(null);
  const [variants, setVariants] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [trackedOnly, setTrackedOnly] = useState(false);

  const [adjustTarget, setAdjustTarget] = useState(null);
  const [matrixProductId, setMatrixProductId] = useState(null);
  const [showStockIn, setShowStockIn] = useState(false);

  const threshold = summary?.low_stock_threshold ?? 3;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const loadSummary = useCallback(async () => {
    try {
      const { data } = await inventoryApi.summary();
      setSummary(data.data);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not load inventory summary"));
    }
  }, []);

  const loadVariants = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await inventoryApi.variants({
        page,
        per_page: 30,
        search: debouncedSearch || undefined,
        stock_status: stockStatus || undefined,
        tracked_only: trackedOnly ? 1 : undefined,
      });

      const payload = data.data;
      setVariants(payload.data ?? []);
      setPagination({
        current_page: payload.current_page,
        last_page: payload.last_page,
        total: payload.total,
        from: payload.from,
        to: payload.to,
      });
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not load inventory"));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, stockStatus, trackedOnly]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadVariants();
  }, [loadVariants]);

  const refreshAll = useCallback(() => {
    loadSummary();
    loadVariants();
  }, [loadSummary, loadVariants]);

  const stats = useMemo(() => {
    if (!summary) return [];

    return [
      {
        label: "Available units",
        value: (summary.units_on_hand - summary.units_reserved).toLocaleString(),
        hint: `${summary.units_on_hand.toLocaleString()} on hand · ${summary.units_reserved.toLocaleString()} held`,
        accent: "#17a97f",
      },
      {
        label: "Low stock",
        value: summary.low_stock.toLocaleString(),
        hint: `At or below ${summary.low_stock_threshold} units`,
        accent: "#f79009",
      },
      {
        label: "Out of stock",
        value: summary.out_of_stock.toLocaleString(),
        hint: "Nothing left to sell",
        accent: "#f04438",
      },
      {
        label: "Tracked products",
        value: summary.tracked_products.toLocaleString(),
        hint: `${summary.total_variants.toLocaleString()} colour/size rows`,
        accent: "#6172f3",
      },
      {
        label: "Stock value",
        value: `৳${Math.round(summary.stock_value).toLocaleString()}`,
        hint: "At recorded purchase cost",
        accent: "#1f2d4d",
      },
    ];
  }, [summary]);

  return (
    <div className="inv-page">
      <div className="inv-head">
        <div>
          <h1 className="inv-title">Inventory</h1>
          <p className="inv-subtitle">
            Stock is held when an order is placed and deducted once you mark it
            Order Confirmed. Cancelling or returning puts it back.
          </p>
        </div>

        <div className="inv-head-actions">
          <Link href="/dashboard/inventory/movements">
            <button className="inv-btn inv-btn-ghost">
              <i className="fas fa-clock-rotate-left" />
              Stock History
            </button>
          </Link>
          <button
            className="inv-btn inv-btn-primary"
            onClick={() => setShowStockIn(true)}
          >
            <i className="fas fa-truck-ramp-box" />
            Receive Stock
          </button>
        </div>
      </div>

      <EnforcementToggle />

      {stats.length > 0 && (
        <div className="inv-stats">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      <div className="inv-card">
        <div className="inv-filters">
          <input
            className="inv-filter-search"
            placeholder="Search product name, product SKU or variant SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="inv-chip-row">
            {STOCK_FILTERS.map((filter) => (
              <button
                key={filter.key || "all"}
                className={`inv-chip ${stockStatus === filter.key ? "active" : ""}`}
                onClick={() => {
                  setStockStatus(filter.key);
                  setPage(1);
                }}
              >
                {filter.label}
              </button>
            ))}
            <button
              className={`inv-chip ${trackedOnly ? "active" : ""}`}
              onClick={() => {
                setTrackedOnly((prev) => !prev);
                setPage(1);
              }}
            >
              Tracked only
            </button>
          </div>
        </div>

        {loading ? (
          <div className="inv-empty">
            <i className="fas fa-circle-notch fa-spin" />
            Loading inventory…
          </div>
        ) : variants.length === 0 ? (
          <div className="inv-empty">
            <i className="fas fa-boxes-stacked" />
            No stock rows match these filters.
            <div className="mt-2" style={{ fontSize: 12.5 }}>
              Stock rows are created automatically when you save a product that
              has colours or sizes.
            </div>
          </div>
        ) : (
          <>
            <div className="inv-table-scroll">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th style={{ textAlign: "right" }}>On hand</th>
                    <th style={{ textAlign: "right" }}>Held</th>
                    <th style={{ textAlign: "right" }}>Available</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => {
                    const thumb = variant.product?.first_image?.image;

                    return (
                      <tr key={variant.id}>
                        <td>
                          <div className="inv-product-cell">
                            {thumb ? (
                              <Image
                                className="inv-thumb"
                                src={`${baseUrl}${thumb}`}
                                alt=""
                                width={38}
                                height={38}
                              />
                            ) : (
                              <span className="inv-thumb" />
                            )}
                            <div>
                              <div className="inv-product-title">
                                {variant.product?.title || "Deleted product"}
                              </div>
                              <div className="inv-product-sku">
                                {variant.product?.sku || "—"}
                                {!variant.product?.track_inventory && (
                                  <span className="inv-tag ms-2">
                                    not tracked
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="inv-variant-cell">
                            {variant.color?.code && (
                              <span
                                className="inv-swatch"
                                style={{ background: variant.color.code }}
                              />
                            )}
                            <span>{variant.label || "Default"}</span>
                          </span>
                          {variant.sku && (
                            <div className="inv-product-sku">{variant.sku}</div>
                          )}
                        </td>

                        <td className="inv-num">{variant.stock}</td>
                        <td className="inv-num">{variant.reserved}</td>
                        <td
                          className="inv-num"
                          style={{
                            color:
                              variant.available <= 0
                                ? "#b42318"
                                : variant.available <= threshold
                                ? "#b54708"
                                : "#0f6b52",
                          }}
                        >
                          {variant.available}
                        </td>

                        <td>
                          <StockBadge variant={variant} threshold={threshold} />
                        </td>

                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button
                            className="inv-btn inv-btn-ghost inv-btn-sm me-1"
                            onClick={() => setAdjustTarget(variant)}
                          >
                            Adjust
                          </button>
                          <button
                            className="inv-btn inv-btn-dark inv-btn-sm"
                            onClick={() => setMatrixProductId(variant.product_id)}
                          >
                            Grid
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="inv-pager">
              <span>
                Showing {pagination?.from ?? 0}–{pagination?.to ?? 0} of{" "}
                {pagination?.total ?? 0}
              </span>
              <div className="d-flex gap-2">
                <button
                  className="inv-btn inv-btn-ghost inv-btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  className="inv-btn inv-btn-ghost inv-btn-sm"
                  disabled={page >= (pagination?.last_page ?? 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {adjustTarget && (
        <AdjustStockModal
          variant={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSaved={refreshAll}
        />
      )}

      {matrixProductId && (
        <ProductStockModal
          productId={matrixProductId}
          onClose={() => setMatrixProductId(null)}
          onSaved={refreshAll}
        />
      )}

      {showStockIn && (
        <StockInModal
          onClose={() => setShowStockIn(false)}
          onSaved={refreshAll}
        />
      )}
    </div>
  );
}
