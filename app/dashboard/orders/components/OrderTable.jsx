// app/dashboard/orders/components/OrderTable.jsx
"use client";
import PageLoader from "@/app/components/loader/pageLoader";
import District from "@/app/frontEnd/checkout/components/District";
import React, { useState } from "react";
import ProductFilter from "./ProductFilter";
import axios from "axios";
import { toast } from "react-toastify";
import useFormatDate from "@/app/hooks/useFormatDate";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaPrint } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import './orderTable.css'
import Link from "next/link";
import Image from "next/image";

// Status badge color mapping
const STATUS_COLORS = {
  pending: { bg: '#fff3cd', color: '#856404', border: '#ffc107' },
  completed: { bg: '#d1e7dd', color: '#0a3622', border: '#198754' },
  placed: { bg: '#cfe2ff', color: '#084298', border: '#0d6efd' },
  cancelled: { bg: '#f8d7da', color: '#842029', border: '#dc3545' },
  processing: { bg: '#e2d9f3', color: '#432874', border: '#6f42c1' },
  returned: { bg: '#fde8d8', color: '#7d3c0f', border: '#fd7e14' },
  paid_returned: { bg: '#fde8d8', color: '#7d3c0f', border: '#fd7e14' },
  first_call: { bg: '#d0f4f7', color: '#0c6571', border: '#0dcaf0' },
  second_call: { bg: '#d0f4f7', color: '#0c6571', border: '#0dcaf0' },
  third_call: { bg: '#d0f4f7', color: '#0c6571', border: '#0dcaf0' },
  stock_sold: { bg: '#f8d7da', color: '#842029', border: '#dc3545' },
  shipped_to_you: { bg: '#cfe2ff', color: '#084298', border: '#0d6efd' },
  received_in_bd: { bg: '#d1e7dd', color: '#0a3622', border: '#198754' },
  order_sent_to_china: { bg: '#fff3cd', color: '#856404', border: '#ffc107' },
  file_completed: { bg: '#d1e7dd', color: '#0a3622', border: '#198754' },
  order_confirmed: { bg: '#d1e7dd', color: '#0a3622', border: '#198754' },
};

const STATUS_LABELS = {
  completed: 'Delivery Completed',
  shipped_to_you: 'Shipped to Courier',
};

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#e2e3e5', color: '#41464b', border: '#adb5bd' };
  const label = STATUS_LABELS[status] || status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A';
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.3px',
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export default function OrderTable({
  loading,
  orders,
  filters,
  onApplyFilters,
  onResetFilters,
  selectedOrderIds = [],
  onSelectionChange,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const { formatDate } = useFormatDate();

  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const toggleRow = (orderId) => {
    setExpandedRows(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // ── Selection helpers ────────────────────────────────────────────────────
  const allSelected =
    orders.length > 0 && orders.every(o => selectedOrderIds.includes(o.id));

  const someSelected =
    orders.some(o => selectedOrderIds.includes(o.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      // Deselect all orders on current page
      onSelectionChange(
        selectedOrderIds.filter(id => !orders.find(o => o.id === id))
      );
    } else {
      // Select all orders on current page (keep already selected from other pages)
      const newIds = orders
        .map(o => o.id)
        .filter(id => !selectedOrderIds.includes(id));
      onSelectionChange([...selectedOrderIds, ...newIds]);
    }
  };

  const toggleOne = (id) => {
    onSelectionChange(
      selectedOrderIds.includes(id)
        ? selectedOrderIds.filter(i => i !== id)
        : [...selectedOrderIds, id]
    );
  };
  // ────────────────────────────────────────────────────────────────────────

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => onApplyFilters(draftFilters);
  const handleReset = () => onResetFilters();

  const handleSelectChange = (name) => (selectedOption) => {
    setDraftFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleProductChange = (selectedOption) => {
    setDraftFilters((prev) => ({
      ...prev,
      product_id: selectedOption?.id ? String(selectedOption.id) : "",
      product_title: selectedOption && !selectedOption.id ? selectedOption.title : "",
    }));
  };

  async function handleStatus(e, orderId, userPhone) {
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");
    if (!token) { toast.error("No auth token found"); return; }
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + `api/order_status/${orderId}`,
        { status: e.target.value, userPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Successfully Updated!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleCourierEntry(orderId, courierType) {
    if (!courierType) return;
    setLoadingStates(prev => ({ ...prev, [orderId]: true }));
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");
    if (!token) {
      toast.error("No auth token found");
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
      return;
    }
    try {
      if (courierType === "pathao") {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/pathao/orders/${orderId}/create`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          toast.success("Pathao courier entry created successfully!");
          window.location.reload();
        } else {
          toast.error(data.message || "Failed to create courier entry");
        }
      } else if (courierType === "steadfast") {
        toast.info("Steadfast integration coming soon");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to create courier entry");
    } finally {
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
    }
  }

  if (loading) return <PageLoader />;

  // ─── Shared filter section ───────────────────────────────────────────────
  const FilterSection = (
    <div className="card-header bg-light py-3">
      <div className="row g-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search name/phone..."
            name="search"
            value={draftFilters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <span className="input-group-text">৳</span>
            <input type="number" className="form-control" placeholder="Min" name="min" value={draftFilters.min} onChange={handleFilterChange} />
            <span className="input-group-text">-</span>
            <input type="number" className="form-control" placeholder="Max" name="max" value={draftFilters.max} onChange={handleFilterChange} />
          </div>
        </div>
        <div className="col-md-3">
          <div className="input-group">
            <input type="date" className="form-control" name="start_date" value={draftFilters.start_date} onChange={handleFilterChange} />
            <span className="input-group-text">to</span>
            <input type="date" className="form-control" name="end_date" value={draftFilters.end_date} onChange={handleFilterChange} />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" name="status" value={draftFilters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Delivery Completed</option>
            <option value="placed">Placed</option>
            <option value="cancelled">Cancelled</option>
            <option value="processing">Processing</option>
            <option value="returned">Returned</option>
            <option value="paid_returned">Paid Returned</option>
            <option value="first_call">1st Call Done</option>
            <option value="second_call">2nd Call Done</option>
            <option value="third_call">3rd Call Done</option>
            <option value="stock_sold">Stock Sold</option>
            <option value="shipped_to_you">Shipped to Courier</option>
            <option value="received_in_bd">Received In BD</option>
            <option value="order_sent_to_china">Order Sent To China</option>
            <option value="file_completed">File Completed</option>
            <option value="order_confirmed">Order Confirmed</option>
          </select>
        </div>
        <div className="col-md-3 mt-2">
          <label className="form-label small mb-1">District</label>
          <District value={draftFilters.district} onChange={handleSelectChange("district")} />
        </div>
        <div className="col-md-3 mt-2">
          <label className="form-label small mb-1">Product</label>
          <ProductFilter
            value={draftFilters.product_id}
            titleValue={draftFilters.product_title}
            onChange={handleProductChange}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-primary me-2" onClick={handleApply}>
            <i className="bi bi-funnel me-1"></i> Apply Filters
          </button>
          <button className="btn btn-outline-secondary" onClick={handleReset}>
            <i className="bi bi-arrow-repeat me-1"></i> Reset
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Expanded detail panel ────────────────────────────────────────────────
  const ExpandedDetail = ({ order }) => (
    <div style={{
      background: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      padding: '16px 20px',
      animation: 'expandFade 0.2s ease',
    }}>
      <div className="row g-3">
        {/* Ordered Products */}
        <div className="col-12 col-md-5">
          <p className="mb-2" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#6c757d', letterSpacing: '0.6px' }}>
            Ordered Products
          </p>
          {order.order_items?.map((item, itemIndex) => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>
                {itemIndex + 1}. {item.title}
              </div>
              <div style={{ fontSize: '12px', color: '#495057' }}>
                Qty: {item.qty} × ৳{item.unitPrice} = <strong>৳{item.totalPrice}</strong>
              </div>
              {item.selected_variant && (
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '3px' }}>
                  <strong>{item?.selected_variant?.attribute}:</strong> {item?.selected_variant?.value}
                </div>
              )}
              {item.colorImage && (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Color:</span>
                  <Zoom>
                    <Image width={36} height={36} src={item?.colorImage ?? ""} alt="" className="rounded-circle border" style={{ objectFit: 'cover' }} />
                  </Zoom>
                </div>
              )}
              {item.color_name && (
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '3px' }}>
                  <strong>Color Name:</strong> {item.color_name ?? "N/A"}
                </div>
              )}
              {item.size && (
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '3px' }}>
                  <strong>Size:</strong> {item?.size?.size ?? "N/A"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="col-12 col-md-3">
          <p className="mb-2" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#6c757d', letterSpacing: '0.6px' }}>
            Order Summary
          </p>
          <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '8px', padding: '12px' }}>
            {[
              ['Payment Method', order.payment_method],
              ['Shipping Cost', `৳${order.shipping_cost}`],
              ['Advance Payment', `৳${order?.advance_payment ?? 0}`],
              ['Total', `৳${order.total}`],
              ['Total Due', `৳${(order?.total - order?.advance_payment) ?? 0}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#6c757d' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status + Courier + Actions */}
        <div className="col-12 col-md-4">
          <p className="mb-2" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#6c757d', letterSpacing: '0.6px' }}>
            Manage Order
          </p>
          <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Status */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#495057', marginBottom: '4px', display: 'block' }}>Status</label>
              <select className="form-select form-select-sm" value={order.status} onChange={(e) => handleStatus(e, order.id, order.phone)}>
                <option value="pending">Pending</option>
                <option value="completed">Delivery Completed</option>
                <option value="placed">Placed</option>
                <option value="cancelled">Cancelled</option>
                <option value="processing">Processing</option>
                <option value="returned">Returned</option>
                <option value="paid_returned">Paid Returned</option>
                <option value="first_call">1st Call Done</option>
                <option value="second_call">2nd Call Done</option>
                <option value="third_call">3rd Call Done</option>
                <option value="stock_sold">Stock Sold</option>
                <option value="shipped_to_you">Shipped to Courier</option>
                <option value="received_in_bd">Received In BD</option>
                <option value="order_sent_to_china">Order Sent To China</option>
                <option value="file_completed">File Completed</option>
                <option value="order_confirmed">Order Confirmed</option>
              </select>
            </div>

            {/* Courier */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#495057', marginBottom: '4px', display: 'block' }}>Courier Entry</label>
              {order.courier_entry ? (
                <span className="badge bg-success w-100 py-2">✓ Entry Created</span>
              ) : (
                <select
                  className="form-select form-select-sm"
                  onChange={(e) => handleCourierEntry(order.id, e.target.value)}
                  disabled={loadingStates[order.id]}
                  defaultValue=""
                >
                  <option value="" disabled>
                    {loadingStates[order.id] ? "Processing..." : "Select Courier"}
                  </option>
                  <option value="pathao">Entry Pathao</option>
                </select>
              )}
            </div>

            {/* Actions */}
            <div className="d-flex gap-2">
              <Link href={`/dashboard/orders/edit/${order.id}`} className="flex-fill">
                <button className="btn btn-sm btn-warning w-100">
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
              </Link>
              <Link href={`/dashboard/orders/invoice/${order.id}`} className="flex-fill">
                <button className="btn btn-sm btn-outline-secondary w-100" title="Print Invoice">
                  <FaPrint size={14} className="me-1" /> Invoice
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes expandFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .order-row-summary {
          transition: background 0.15s;
        }
        .order-row-summary:hover {
          background: #f0f4ff !important;
          cursor: pointer;
        }
        .order-row-summary.expanded {
          background: #e8eeff !important;
        }
        .order-row-summary.selected {
          background: #eef6ff !important;
        }
        .order-row-summary.selected:hover {
          background: #ddeeff !important;
        }
        .expand-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid #dee2e6;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .expand-btn:hover {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #fff;
        }
        .expand-btn.active {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #fff;
        }
        .order-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #0d6efd;
          flex-shrink: 0;
        }
        .select-all-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
          accent-color: #0d6efd;
        }
      `}</style>

      <div className="card">
        {FilterSection}

        {/* Selection info bar */}
        {selectedOrderIds.length > 0 && (
          <div style={{
            padding: '8px 16px',
            background: '#e7f1ff',
            borderBottom: '1px solid #b8d4f8',
            fontSize: '13px',
            color: '#084298',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <i className="bi bi-check2-square"></i>
            <strong>{selectedOrderIds.length}</strong> order{selectedOrderIds.length > 1 ? 's' : ''} selected
            <button
              onClick={() => onSelectionChange([])}
              style={{
                marginLeft: 'auto',
                fontSize: '12px',
                background: 'none',
                border: 'none',
                color: '#084298',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="card-body p-0">
          {orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              No orders found
            </div>
          ) : (
            <div>
              {/* ── Column header row ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '32px auto auto auto auto auto auto',
                gap: '0 12px',
                padding: '12px 16px',
                alignItems: 'center',
                background: '#f8f9fa',
                borderBottom: '2px solid #e9ecef',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#6c757d',
              }}>
                {/* Select all checkbox */}
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    className="select-all-checkbox"
                    checked={allSelected}
                    ref={el => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                    title={allSelected ? 'Deselect all on this page' : 'Select all on this page'}
                  />
                </span>
                <span>#</span>
                <span>Customer</span>
                <span className="text-center d-none d-lg-block">Status</span>
                <span className="d-none d-md-block text-center">Date</span>
                <span className="text-right">Expand</span>
              </div>

              {/* ── Order rows ── */}
              {orders.map((order, index) => {
                const isExpanded = !!expandedRows[order.id];
                const isSelected = selectedOrderIds.includes(order.id);
                return (
                  <div key={order.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    {/* Summary row */}
                    <div
                      className={`order-row-summary${isExpanded ? ' expanded' : ''}${isSelected ? ' selected' : ''}`}
                      onClick={() => toggleRow(order.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '32px auto auto auto auto auto',
                        gap: '0 12px',
                        padding: '12px 16px',
                        alignItems: 'center',
                      }}
                    >
                      {/* Checkbox — stopPropagation so it doesn't expand the row */}
                      <span
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <input
                          type="checkbox"
                          className="order-checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(order.id)}
                        />
                      </span>

                      {/* # */}
                      <span style={{ fontSize: '13px', color: '#adb5bd', fontWeight: 600 }}>
                        {index + 1}
                      </span>

                      {/* Customer info */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#212529', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.name || 'N/A'}
                          {order.customer_type === 'Repeat Customer' && (
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '10px',
                              background: '#fff3cd',
                              color: '#856404',
                              border: '1px solid #ffc107',
                              borderRadius: '10px',
                              padding: '1px 6px',
                              fontWeight: 600,
                              verticalAlign: 'middle',
                            }}>
                              Repeat
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                          {order.phone || 'N/A'}
                          <span className="d-none d-md-inline" style={{ marginLeft: '8px', color: '#adb5bd' }}>
                            {order.district || ''}
                          </span>
                          {/* Date - hidden on mobile */}
                          <div className="d-block d-md-none mt-2" style={{ fontSize: '10px', color: '#6c757d', whiteSpace: 'nowrap' }}>
                            {formatDate(order.created_at || '')}
                          </div>
                          {/* Status badge on mobile */}
                          <div className="d-block d-md-none mt-2">
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      </div>

                      {/* Status badge — desktop */}
                      <div className="d-none d-md-block ml-lg-5">
                        <StatusBadge status={order.status} />
                      </div>

                      {/* Date — desktop */}
                      <div className="d-none d-md-block text-left" style={{ fontSize: '12px', color: '#6c757d', whiteSpace: 'nowrap' }}>
                        {formatDate(order.created_at || '')}
                      </div>

                      {/* Expand toggle */}
                      <div
                        className="text-left"
                        onClick={(e) => { e.stopPropagation(); toggleRow(order.id); }}
                      >
                        <span className={`expand-btn${isExpanded ? ' active' : ''}`}>
                          {isExpanded
                            ? <FiChevronUp size={16} />
                            : <FiChevronDown size={16} />
                          }
                        </span>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && <ExpandedDetail order={order} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
