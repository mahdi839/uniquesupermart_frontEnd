"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import inventoryApi, { apiErrorMessage } from "@/lib/inventoryApi";
import useFormatDate from "@/app/hooks/useFormatDate";
import "../inventory.css";

const TYPE_LABELS = {
  initial: { label: "Opening", accent: "#98a2b3" },
  purchase: { label: "Received", accent: "#17a97f" },
  adjustment: { label: "Adjusted", accent: "#6172f3" },
  reserve: { label: "Held", accent: "#f79009" },
  release: { label: "Released", accent: "#7f56d9" },
  sale: { label: "Sold", accent: "#f04438" },
  return: { label: "Returned", accent: "#0ba5ec" },
  damage: { label: "Damaged", accent: "#b42318" },
};

export default function StockMovementsPage() {
  const { formatDateParts } = useFormatDate();

  const [movements, setMovements] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await inventoryApi.movements({
        page,
        per_page: 40,
        type: type || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      const payload = data.data;
      setMovements(payload.data ?? []);
      setPagination({
        current_page: payload.current_page,
        last_page: payload.last_page,
        total: payload.total,
        from: payload.from,
        to: payload.to,
      });
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not load stock history"));
    } finally {
      setLoading(false);
    }
  }, [page, type, startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="inv-page">
      <div className="inv-head">
        <div>
          <h1 className="inv-title">Stock History</h1>
          <p className="inv-subtitle">
            Every change to a stock count, in order. This is how you answer "why
            is this 3 and not 5".
          </p>
        </div>
        <div className="inv-head-actions">
          <Link href="/dashboard/inventory">
            <button className="inv-btn inv-btn-ghost">
              <i className="fas fa-arrow-left" />
              Back to Inventory
            </button>
          </Link>
        </div>
      </div>

      <div className="inv-card">
        <div className="inv-filters">
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All movement types</option>
            {Object.entries(TYPE_LABELS).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
          />

          {(type || startDate || endDate) && (
            <button
              className="inv-chip"
              onClick={() => {
                setType("");
                setStartDate("");
                setEndDate("");
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <div className="inv-empty">
            <i className="fas fa-circle-notch fa-spin" />
            Loading history…
          </div>
        ) : movements.length === 0 ? (
          <div className="inv-empty">
            <i className="fas fa-clock-rotate-left" />
            No stock movements recorded yet.
          </div>
        ) : (
          <>
            <div className="inv-table-scroll">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Change</th>
                    <th style={{ textAlign: "right" }}>Stock after</th>
                    <th>Reference</th>
                    <th>By</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => {
                    const meta =
                      TYPE_LABELS[movement.type] || {
                        label: movement.type,
                        accent: "#98a2b3",
                      };
                    const { date, time } = formatDateParts(movement.created_at);
                    const qty = Number(movement.quantity) || 0;

                    return (
                      <tr key={movement.id}>
                        <td>
                          <div className="order-date-stack">
                            <span style={{ fontWeight: 600 }}>{date}</span>
                            <span style={{ fontSize: 11, color: "#98a2b3" }}>
                              {time}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="inv-product-title">
                            {movement.product?.title || "Deleted product"}
                          </div>
                          <div className="inv-product-sku">
                            {movement.product?.sku || "—"}
                          </div>
                        </td>

                        <td>{movement.variant_label || "Default"}</td>

                        <td>
                          <span
                            className="inv-badge"
                            style={{
                              background: `${meta.accent}1a`,
                              color: meta.accent,
                            }}
                          >
                            {meta.label}
                          </span>
                        </td>

                        <td
                          className={`inv-num ${
                            qty > 0
                              ? "ledger-qty-in"
                              : qty < 0
                              ? "ledger-qty-out"
                              : "ledger-qty-flat"
                          }`}
                        >
                          {qty > 0 ? `+${qty}` : qty === 0 ? "—" : qty}
                        </td>

                        <td className="inv-num">
                          {movement.stock_after}
                          {Number(movement.reserved_after) > 0 && (
                            <span className="inv-product-sku">
                              {" "}
                              ({movement.reserved_after} held)
                            </span>
                          )}
                        </td>

                        <td style={{ maxWidth: 220, whiteSpace: "normal" }}>
                          {movement.order_id ? (
                            <Link
                              href={`/dashboard/orders/edit/${movement.order_id}`}
                              style={{ fontWeight: 600 }}
                            >
                              Order #{movement.order_id}
                            </Link>
                          ) : null}
                          {movement.note && (
                            <div className="inv-product-sku">{movement.note}</div>
                          )}
                        </td>

                        <td>{movement.user?.name || "System"}</td>
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
    </div>
  );
}
