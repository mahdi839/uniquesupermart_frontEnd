"use client";

import PageLoader from "@/app/components/loader/pageLoader";
import Link from "next/link";
import React, { useState } from "react";
import { FaEnvelope, FaPen, FaPhone, FaSearch, FaFilter, FaRedo } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { CUSTOMER_BADGES } from "../badgeConfig";
import CustomerBadgeChip from "./CustomerBadgeChip";

export default function CustomerTable({
  loading,
  customers,
  filters,
  onApplyFilters,
  onResetFilters,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom py-4">
        <div className="d-flex align-items-center mb-3">
          <FaFilter className="text-primary me-2" size={18} />
          <h5 className="mb-0 fw-bold">Search & Filter Customers</h5>
        </div>
        <div className="row g-3">
          <div className="col-md-5">
            <label className="form-label small fw-semibold text-muted mb-2">
              <FaSearch className="me-1" /> Search by name or phone
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Name or phone..."
              name="search"
              value={draftFilters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold text-muted mb-2">
              Filter by badge
            </label>
            <select
              className="form-select"
              name="badge"
              value={draftFilters.badge}
              onChange={handleFilterChange}
            >
              <option value="">All badges</option>
              {CUSTOMER_BADGES.map((badge) => (
                <option key={badge.title} value={badge.title}>
                  {badge.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end gap-2">
            <button className="btn btn-primary flex-fill" onClick={() => onApplyFilters(draftFilters)}>
              Apply
            </button>
            <button className="btn btn-outline-secondary flex-fill" onClick={onResetFilters}>
              <FaRedo className="me-1" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="card-body d-none d-md-block p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 fw-semibold">{customer.name || "N/A"}</td>
                    <td className="px-4">
                      <span className="d-inline-flex align-items-center gap-2">
                        <FaPhone className="text-success" size={12} />
                        {customer.phone || "N/A"}
                      </span>
                    </td>
                    <td className="px-4">
                      {customer.email ? (
                        <span className="d-inline-flex align-items-center gap-2">
                          <FaEnvelope className="text-info" size={12} />
                          {customer.email}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4">
                      {customer.assigned_badge ? (
                        <CustomerBadgeChip badge={customer.assigned_badge} />
                      ) : (
                        <span className="text-muted">No badge</span>
                      )}
                    </td>
                    <td className="px-4 text-center">
                      <Link href={`/dashboard/customers/edit/${customer.id}`}>
                        <button className="btn btn-sm btn-warning">
                          <FaPen className="me-1" size={12} />
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <HiUserGroup size={40} className="mb-2 opacity-50" />
                    <p className="mb-0">No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-body d-block d-md-none">
        {customers.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {customers.map((customer) => (
              <div key={customer.id} className="card border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">{customer.name || "N/A"}</h6>
                    <CustomerBadgeChip badge={customer.assigned_badge} />
                  </div>
                  <div className="small text-muted mb-1">{customer.phone || "N/A"}</div>
                  <div className="small text-muted mb-3">{customer.email || "No email"}</div>
                  <Link href={`/dashboard/customers/edit/${customer.id}`}>
                    <button className="btn btn-sm btn-warning w-100">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted">No customers found</div>
        )}
      </div>
    </div>
  );
}
