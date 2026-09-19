"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { toast } from "react-toastify";
import "../coupons.css";

const emptyForm = {
  code: "",
  name: "",
  description: "",
  discount_type: "fixed",
  discount_value: "",
  max_discount: "",
  min_subtotal: "",
  starts_at: "",
  expires_at: "",
  is_active: true,
  usage_limit: "",
  per_phone_limit: "1",
  applies_to: "all",
  product_ids: [],
};

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function emptyToNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  return value;
}

export default function CouponForm({ mode = "create", couponId }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(mode === "edit");
  const [productOptions, setProductOptions] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await axios.get(`${baseUrl}api/coupons/product-options`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductOptions(
          (res.data.data || []).map((product) => ({
            value: product.id,
            label: product.sku ? `${product.title} (${product.sku})` : product.title,
          }))
        );
      } catch (error) {
        toast.error("Failed to load products");
      }
    }

    if (token) loadProducts();
  }, [baseUrl, token]);

  useEffect(() => {
    if (mode !== "edit" || !couponId || !token) return;

    async function loadCoupon() {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}api/coupons/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const coupon = res.data;
        setForm({
          code: coupon.code || "",
          name: coupon.name || "",
          description: coupon.description || "",
          discount_type: coupon.discount_type || "fixed",
          discount_value: coupon.discount_value ?? "",
          max_discount: coupon.max_discount ?? "",
          min_subtotal: coupon.min_subtotal ?? "",
          starts_at: toDateTimeLocal(coupon.starts_at),
          expires_at: toDateTimeLocal(coupon.expires_at),
          is_active: Boolean(coupon.is_active),
          usage_limit: coupon.usage_limit ?? "",
          per_phone_limit: coupon.per_phone_limit ?? "",
          applies_to: coupon.applies_to || "all",
          product_ids: (coupon.products || []).map((product) => product.id),
        });
      } catch (error) {
        toast.error("Failed to load coupon");
        router.push("/dashboard/coupons");
      } finally {
        setLoading(false);
      }
    }

    loadCoupon();
  }, [mode, couponId, token, baseUrl, router]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectedProducts = productOptions.filter((option) =>
    form.product_ids.includes(option.value)
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: emptyToNull(form.description),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      max_discount: form.discount_type === "percent" ? emptyToNull(form.max_discount) : null,
      min_subtotal: emptyToNull(form.min_subtotal),
      starts_at: emptyToNull(form.starts_at),
      expires_at: emptyToNull(form.expires_at),
      is_active: Boolean(form.is_active),
      usage_limit: emptyToNull(form.usage_limit),
      per_phone_limit: emptyToNull(form.per_phone_limit),
      applies_to: form.applies_to,
      product_ids: form.applies_to === "products" ? form.product_ids : [],
    };

    try {
      const url =
        mode === "edit"
          ? `${baseUrl}api/coupons/${couponId}`
          : `${baseUrl}api/coupons`;
      const method = mode === "edit" ? "put" : "post";
      await axios({
        method,
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(mode === "edit" ? "Coupon updated" : "Coupon created");
      router.push("/dashboard/coupons");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        const firstError = Object.values(err.response.data.errors || {})[0]?.[0];
        toast.error(firstError || "Please check the form");
      } else {
        toast.error(err.response?.data?.message || "Failed to save coupon");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 text-muted">Loading coupon...</p>
      </div>
    );
  }

  return (
    <div className="card coupon-panel mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 fw-bold">
          {mode === "edit" ? "Edit Coupon" : "New Coupon"}
        </h6>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="coupon-form-section">
            <h6>
              <span className="bg-dark text-white">1</span>
              Identity
            </h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Coupon Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.code ? "is-invalid" : ""}`}
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                  placeholder="SAVE80"
                  required
                />
                {errors.code && <div className="invalid-feedback">{errors.code[0]}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Eid ৳100 off"
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name[0]}</div>}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Shown internally to help your team remember this campaign"
              />
            </div>
          </div>

          <div className="coupon-form-section">
            <h6>
              <span className="bg-success text-white">2</span>
              Discount
            </h6>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Discount Type</label>
                <select
                  className="form-select"
                  value={form.discount_type}
                  onChange={(e) => handleChange("discount_type", e.target.value)}
                >
                  <option value="fixed">Fixed amount (৳)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  Discount Value <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={`form-control ${errors.discount_value ? "is-invalid" : ""}`}
                  value={form.discount_value}
                  onChange={(e) => handleChange("discount_value", e.target.value)}
                  required
                />
                {errors.discount_value && (
                  <div className="invalid-feedback">{errors.discount_value[0]}</div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Max Discount (percent only)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={form.max_discount}
                  onChange={(e) => handleChange("max_discount", e.target.value)}
                  disabled={form.discount_type !== "percent"}
                  placeholder="e.g. 300"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Minimum Order Amount</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={form.min_subtotal}
                onChange={(e) => handleChange("min_subtotal", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="coupon-form-section">
            <h6>
              <span className="bg-warning text-dark">3</span>
              Schedule & Limits
            </h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Starts At</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={form.starts_at}
                  onChange={(e) => handleChange("starts_at", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Expires At</label>
                <input
                  type="datetime-local"
                  className={`form-control ${errors.expires_at ? "is-invalid" : ""}`}
                  value={form.expires_at}
                  onChange={(e) => handleChange("expires_at", e.target.value)}
                />
                {errors.expires_at && (
                  <div className="invalid-feedback">{errors.expires_at[0]}</div>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Global Usage Limit</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.usage_limit}
                  onChange={(e) => handleChange("usage_limit", e.target.value)}
                  placeholder="e.g. 80, blank = unlimited"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Per Customer (phone) Limit</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.per_phone_limit}
                  onChange={(e) => handleChange("per_phone_limit", e.target.value)}
                  placeholder="e.g. 1, blank = unlimited"
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="couponActive"
                    checked={form.is_active}
                    onChange={(e) => handleChange("is_active", e.target.checked)}
                  />
                  <label className="form-check-label fw-bold" htmlFor="couponActive">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="coupon-form-section">
            <h6>
              <span className="bg-info text-dark">4</span>
              Product Scope
            </h6>
            <div className="mb-3">
              <label className="form-label fw-bold">Applies To</label>
              <div className="d-flex gap-4 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="applies_to"
                    id="appliesAll"
                    checked={form.applies_to === "all"}
                    onChange={() => handleChange("applies_to", "all")}
                  />
                  <label className="form-check-label" htmlFor="appliesAll">
                    All products
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="applies_to"
                    id="appliesProducts"
                    checked={form.applies_to === "products"}
                    onChange={() => handleChange("applies_to", "products")}
                  />
                  <label className="form-check-label" htmlFor="appliesProducts">
                    Specific products
                  </label>
                </div>
              </div>
              {form.applies_to === "products" && (
                <>
                  <Select
                    isMulti
                    options={productOptions}
                    value={selectedProducts}
                    onChange={(options) =>
                      handleChange(
                        "product_ids",
                        (options || []).map((option) => option.value)
                      )
                    }
                    placeholder="Select products..."
                    classNamePrefix="react-select"
                  />
                  {errors.product_ids && (
                    <div className="text-danger small mt-1">{errors.product_ids[0]}</div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between border-top pt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => router.push("/dashboard/coupons")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "edit" ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
