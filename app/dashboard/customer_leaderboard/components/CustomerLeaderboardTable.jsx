"use client";
import PageLoader from "@/app/components/loader/pageLoader";
import District from "@/app/frontEnd/checkout/components/District";
import React, { useState } from "react";
import useFormatDate from "@/app/hooks/useFormatDate";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaTrophy, FaStar,
  FaSearch, FaFilter, FaRedo, FaEye, FaMedal, FaShoppingBag, FaWhatsapp
} from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import Link from "next/link";
import CustomerBadgeChip from "../../customers/components/CustomerBadgeChip";

export default function CustomerLeaderboardTable({
  loading,
  customers,
  filters,
  onApplyFilters,
  onResetFilters,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { formatDate } = useFormatDate();

  // Sync with parent filters when they change
  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
  };

  const handleReset = () => {
    onResetFilters();
  };

  // Special handler for react-select components
  const handleSelectChange = (name) => (selectedOption) => {
    setDraftFilters((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  // Get medal style based on rank
  const getMedalStyle = (index) => {
    if (index === 0) return { color: '#FFD700', icon: '🥇' }; // Gold
    if (index === 1) return { color: '#C0C0C0', icon: '🥈' }; // Silver
    if (index === 2) return { color: '#CD7F32', icon: '🥉' }; // Bronze
    return null;
  };

  const handleViewProducts = (customer) => {
    setSelectedCustomer(customer);
    setShowProductsModal(true);
  };

  const handleCloseModal = () => {
    setShowProductsModal(false);
    setSelectedCustomer(null);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="card border-0 shadow-sm">
        {/* Filter Section - Enhanced Design */}
        <div className="card-header bg-white border-bottom py-4">
          <div className="d-flex align-items-center mb-3">
            <FaFilter className="text-primary me-2" size={20} />
            <h5 className="mb-0 fw-bold">Filter & Sort Customers</h5>
          </div>

          <div className="row g-3">
            {/* Search Input - Enhanced */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-2">
                <FaSearch className="me-1" /> Search Customer
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FaSearch className="text-muted" size={14} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Name, phone, or email..."
                  name="search"
                  value={draftFilters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* District Filter - Enhanced */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-2">
                <FaMapMarkerAlt className="me-1" /> District
              </label>
              <District
                value={draftFilters.district}
                onChange={handleSelectChange("district")}
              />
            </div>

            {/* Date Range - Enhanced */}
            <div className="col-lg-5 col-md-12">
              <label className="form-label small fw-semibold text-muted mb-2">
                📅 Date Range
              </label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  name="date_from"
                  value={draftFilters.date_from}
                  onChange={handleFilterChange}
                />
                <span className="input-group-text bg-light">to</span>
                <input
                  type="date"
                  className="form-control"
                  name="date_to"
                  value={draftFilters.date_to}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Order Count Sort - Enhanced */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-2">
                <BiSortAlt2 className="me-1" /> Sort by Orders
              </label>
              <select
                className="form-select"
                name="order_count_sort"
                value={draftFilters.order_count_sort}
                onChange={handleFilterChange}
              >
                <option value="">Select...</option>
                <option value="desc">📈 Most Orders First</option>
                <option value="asc">📉 Least Orders First</option>
              </select>
            </div>

            {/* Total Spent Sort - Enhanced */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-2">
                <BiSortAlt2 className="me-1" /> Sort by Spending
              </label>
              <select
                className="form-select"
                name="total_spent_sort"
                value={draftFilters.total_spent_sort}
                onChange={handleFilterChange}
              >
                <option value="">Select...</option>
                <option value="desc">💰 Highest Spent First</option>
                <option value="asc">💸 Lowest Spent First</option>
              </select>
            </div>

            {/* Per Page - Enhanced */}
            <div className="col-lg-2 col-md-4">
              <label className="form-label small fw-semibold text-muted mb-2">
                Per Page
              </label>
              <select
                className="form-select"
                name="per_page"
                value={draftFilters.per_page}
                onChange={handleFilterChange}
              >
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="col-lg-4 col-md-8 d-flex align-items-end gap-2">
              <button
                className="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                onClick={handleApply}
              >
                <FaFilter size={14} />
                Apply Filters
              </button>
              <button
                className="btn btn-outline-secondary flex-fill d-flex align-items-center justify-content-center gap-2"
                onClick={handleReset}
              >
                <FaRedo size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table for Large Screens - Enhanced Design */}
        <div className="card-body d-none d-lg-block p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light sticky-top">
                <tr>
                  <th className="px-4 py-3 text-muted fw-semibold" width="8%">
                    <div className="d-flex align-items-center gap-2">
                      <FaMedal />
                      Rank
                    </div>
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold" width="18%">
                    <div className="d-flex align-items-center gap-2">
                      <HiUserGroup />
                      Customer
                    </div>
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold" width="15%">
                    <div className="d-flex align-items-center gap-2">
                      <FaPhone />
                      Contact
                    </div>
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold" width="15%">
                    <div className="d-flex align-items-center gap-2">
                      <BiSortAlt2 />
                      Statistics
                    </div>
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold" width="24%">
                    <div className="d-flex align-items-center gap-2">
                      💰 Total Spent
                    </div>
                  </th>
                  <th className="px-4 py-3 text-muted fw-semibold" width="10%">Status</th>
                  <th className="px-4 py-3 text-muted fw-semibold text-center" width="10%">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer, index) => {
                    const medalStyle = getMedalStyle(index);
                    return (
                      <tr key={customer.phone} className="border-bottom">
                        <td className="px-4">
                          <div className="d-flex align-items-center gap-2">
                            {medalStyle ? (
                              <span style={{ fontSize: '24px' }}>{medalStyle.icon}</span>
                            ) : (
                              <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-muted"
                                style={{ width: '32px', height: '32px', fontSize: '14px' }}
                              >
                                {index + 1}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4">
                          <div>
                            <h6 className="mb-1 fw-semibold">{customer.name || "N/A"}</h6>
                            {customer.assigned_badge && (
                              <div className="mb-1">
                                <CustomerBadgeChip badge={customer.assigned_badge} />
                              </div>
                            )}
                            <small className="text-muted d-flex align-items-center gap-1">
                              📅 {formatDate(customer.last_order_date || "")}
                            </small>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="small">
                            <div className="mb-2 d-flex align-items-center gap-2">
                              <FaPhone className="text-success" size={12} />
                              <span className="text-dark">{customer.phone || "N/A"}</span>
                            </div>
                            {customer.email && (
                              <div className="mb-2 d-flex align-items-center gap-2">
                                <FaEnvelope className="text-info" size={12} />
                                <span className="text-dark text-truncate" style={{ maxWidth: '150px' }}>
                                  {customer.email}
                                </span>
                              </div>
                            )}
                            <div className="d-flex align-items-center gap-2">
                              <FaMapMarkerAlt className="text-danger" size={12} />
                              <span className="text-dark">{customer.district || "N/A"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="badge bg-primary-subtle text-primary border border-primary"
                                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                              >
                                🛍️ {customer.total_orders} Orders
                              </span>
                            </div>
                            <span
                              className="badge bg-info text-white border border-primary"
                              onClick={() => handleViewProducts(customer)}
                              disabled={!customer.last_ordered_products?.length}
                              style={{ fontSize: '0.75rem', padding: '6px 12px', cursor: 'pointer' }}
                            >
                              View Latest Order
                            </span>
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="d-flex flex-column align-items-start gap-1">
                            <div className="fw-bold text-success" style={{ fontSize: '1.25rem' }}>
                              ৳ {customer.total_spent.toLocaleString()}
                            </div>
                            {customer.last_ordered_products?.length > 0 && (
                              <div className="mt-2">
                                <small className="text-muted d-flex align-items-center">
                                  <FaShoppingBag className="me-1" size={12} />
                                  {customer.last_ordered_products.length} products
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4">
                          <span
                            className={`badge ${customer.badge === "new"
                              ? "bg-info-subtle text-info border border-info"
                              : "bg-warning-subtle text-warning border border-warning"
                              } d-inline-flex align-items-center gap-1`}
                            style={{ fontSize: '0.75rem', padding: '8px 12px', fontWeight: '600' }}
                          >
                            {customer.badge === "new" ? (
                              <>
                                <FaStar size={12} />
                                New
                              </>
                            ) : (
                              <>
                                <FaTrophy size={12} />
                                Repeat
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 text-center d-flex justify-content-center gap-2">
                          {/* View Details */}
                          <Link href={`/dashboard/customer_leaderboard/${customer.phone}`}>
                            <button className="d-inline-flex align-items-center gap-2" style={{ outline: 'none', border: 'none' }}>
                              <FaEye size={14} />
                            </button>
                          </Link>

                          {/* WhatsApp */}
                          {customer.phone && (
                            <a
                              href={`https://wa.me/${customer.phone.replace(/\D/g, '').startsWith('88')
                                  ? customer.phone.replace(/\D/g, '')
                                  : '88' + customer.phone.replace(/\D/g, '')
                                }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-inline-flex align-items-center gap-2 text-success"
                            >
                              <FaWhatsapp size={16} />
                            </a>
                          )}
                        </td>


                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <HiUserGroup size={48} className="mb-3 opacity-50" />
                        <p className="mb-0 fw-semibold">No customers found</p>
                        <small>Try adjusting your filters</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards for Mobile & Tablet - Enhanced Design */}
        <div className="card-body d-block d-lg-none">
          {customers.length > 0 ? (
            <div className="row g-3">
              {customers.map((customer, index) => {
                const medalStyle = getMedalStyle(index);
                return (
                  <div key={customer.phone} className="col-12">
                    <div className="card border shadow-sm hover-shadow transition">
                      <div className="card-header bg-gradient-light d-flex justify-content-between align-items-center py-3">
                        <div className="d-flex align-items-center gap-2">
                          {medalStyle ? (
                            <span style={{ fontSize: '28px' }}>{medalStyle.icon}</span>
                          ) : (
                            <div
                              className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-muted"
                              style={{ width: '36px', height: '36px' }}
                            >
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0 fw-bold">{customer.name}</h6>
                            <small className="text-muted">{customer.phone}</small>
                            {customer.assigned_badge && (
                              <div className="mt-1">
                                <CustomerBadgeChip badge={customer.assigned_badge} />
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          className={`badge ${customer.badge === "new"
                            ? "bg-info-subtle text-info border border-info"
                            : "bg-warning-subtle text-warning border border-warning"
                            }`}
                          style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                        >
                          {customer.badge === "new" ? "🌟 New" : "🏆 Repeat"}
                        </span>
                      </div>
                      <div className="card-body">
                        {/* Contact Information */}
                        <div className="mb-3 p-3 bg-light rounded">
                          <h6 className="mb-2 fw-semibold d-flex align-items-center gap-2">
                            <FaPhone className="text-primary" size={14} />
                            Contact Details
                          </h6>
                          <div className="small">
                            {customer.email && (
                              <div className="mb-2 d-flex align-items-center gap-2">
                                <FaEnvelope className="text-info" size={12} />
                                <span className="text-truncate">{customer.email}</span>
                              </div>
                            )}
                            <div className="mb-2 d-flex align-items-center gap-2">
                              <FaMapMarkerAlt className="text-danger" size={12} />
                              <span>{customer.district || "N/A"}</span>
                            </div>
                            <div className="text-muted">
                              📍 {customer.address || "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* Order Statistics */}
                        <div className="mb-3 p-3 bg-success-subtle rounded">
                          <h6 className="mb-3 fw-semibold d-flex align-items-center gap-2">
                            <BiSortAlt2 className="text-success" size={16} />
                            Order Statistics
                          </h6>
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="text-center p-2 bg-white rounded">
                                <div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>
                                  {customer.total_orders}
                                </div>
                                <small className="text-muted">Total Orders</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-center p-2 bg-white rounded">
                                <div className="fw-bold text-success" style={{ fontSize: '1.5rem' }}>
                                  ৳{customer.total_spent.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <button
                              className="btn btn-sm btn-outline-secondary w-100"
                              onClick={() => handleViewProducts(customer)}
                              disabled={!customer.last_ordered_products?.length}
                            >
                              View Latest Ordered Products
                            </button>
                          </div>
                          <div className="mt-2 text-center">
                            <small className="text-muted">
                              📅 Last order: {formatDate(customer.last_order_date || "")}
                            </small>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Link href={`/dashboard/customers/${customer.phone}`}>
                          <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                            <FaEye size={16} />
                            View Full Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5">
              <HiUserGroup size={64} className="mb-3 text-muted opacity-50" />
              <p className="mb-0 fw-semibold text-muted">No customers found</p>
              <small className="text-muted">Try adjusting your filters</small>
            </div>
          )}
        </div>
      </div>

      {/* Products Modal */}
      {showProductsModal && selectedCustomer && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  {selectedCustomer.name}'s Latest Ordered Products
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="badge bg-primary">
                      {selectedCustomer.total_orders} Orders
                    </span>
                    <span className="ms-2 badge bg-success">
                      ৳{selectedCustomer.total_spent.toLocaleString()} Total
                    </span>
                  </div>
                  <small className="text-muted">
                    Last order: {formatDate(selectedCustomer.last_order_date || "")}
                  </small>
                </div>

                {selectedCustomer.last_ordered_products?.length > 0 ? (
                  <div className="row g-3">
                    {selectedCustomer.last_ordered_products.map((product, idx) => (
                      <div key={idx} className="col-12">
                        <div className="card border">
                          <div className="card-body">
                            <div className="d-flex align-items-start">
                              {product.colorImage && (
                                <div className="me-3">
                                  <Zoom>
                                    <img
                                      src={product.colorImage}
                                      alt={product.title}
                                      className="rounded border"
                                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                  </Zoom>
                                </div>
                              )}
                              <div className="flex-grow-1">
                                <h6 className="fw-semibold mb-2">{product.title}</h6>
                                <div className="row small">
                                  <div className="col-md-4">
                                    <div className="text-muted">Quantity</div>
                                    <div className="fw-semibold">{product.qty}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="text-muted">Unit Price</div>
                                    <div className="fw-semibold">৳{product.unitPrice}</div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="text-muted">Total Price</div>
                                    <div className="fw-semibold text-success">৳{product.totalPrice}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaShoppingBag size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">No products available</h6>
                    <p className="text-muted mb-0">This customer hasn't ordered any products yet.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <Link href={`/dashboard/customer_leaderboard/${selectedCustomer.phone}`}>
                  <button className="btn btn-primary">
                    View Customer Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        .transition {
          transition: all 0.3s ease;
        }
        .modal.show {
          backdrop-filter: blur(2px);
        }
        .modal-content {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}