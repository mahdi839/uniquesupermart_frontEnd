"use client";

import Button from "@/app/components/dashboard/components/button/Button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { clearCategoryCache, fetchCategories } from "@/redux/slices/categorySlice";
import StockTrackingToggle from "../../components/StockTrackingToggle";
export default function Page({ params }) {
  const { id } = params;
  const router = useRouter();

  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyTrackingToProducts, setApplyTrackingToProducts] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${baseUrl}api/categories/${id}`;
  const categoriesUrl = `${baseUrl}api/frontend/categories`;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) return;

    async function fetchCategory() {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data.data ?? res.data);
      } catch (err) {
        toast.error("Failed to load category");
      }
    }

    async function fetchCategories() {
      try {
        const res = await fetch(categoriesUrl);
        const json = await res.json();
        setCategories(json || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategory();
    fetchCategories();
  }, [id]);

  /* ================= FLATTEN CATEGORIES ================= */
  const flattenCategories = (items, level = 0, result = []) => {
    items.forEach((cat) => {
      result.push({
        id: cat.id,
        name: cat.name,
        level,
        parent_id: cat.parent_id,
      });

      if (cat.all_children?.length) {
        flattenCategories(cat.all_children, level + 1, result);
      }
    });
    return result;
  };

  const flatCategories = useMemo(
    () => flattenCategories(categories),
    [categories]
  );

  /* ================= REACT SELECT OPTIONS ================= */
  const categoryOptions = flatCategories
    .filter((c) => c.id !== data?.id) // prevent self-parent
    .map((c) => ({
      value: c.id,
      label: `${"└─ ".repeat(c.level)}${c.name}`,
      level: c.level,
    }));

  const selectedCategory = data?.parent_id
    ? categoryOptions.find((o) => o.value === data.parent_id)
    : null;

  /* ================= HANDLE CHANGE ================= */
  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  /* ================= UPDATE CATEGORY ================= */
  async function editCategory(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await axios.put(
        url,
        {
          name: data.name,
          parent_id: data.parent_id || null,
          home_category: data.home_category,
          priority: parseInt(data.priority) || 0,
          size_guide_type: data.size_guide_type || null,
          track_inventory: Boolean(data.track_inventory),
          apply_tracking_to_products: applyTrackingToProducts,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: ["products"] }),
      });

      // Clear cached categories
      dispatch(clearCategoryCache())

      // Refetch fresh categories
      dispatch(fetchCategories())

      toast.success("Category updated successfully!");
      router.push("/dashboard/category");
      router.refresh();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        const firstKey = Object.keys(err.response.data.errors)[0];
        toast.error(err.response.data.errors[firstKey][0]);
      } else {
        toast.error("Failed to update category");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ================= SELECT STYLES (UNCHANGED LOOK) ================= */
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "38px",
    }),
    option: (base, state) => ({
      ...base,
      paddingLeft: `${state.data.level * 20 + 12}px`,
    }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  if (!data) return null;

  return (
    <div className="container-fluid px-4">
      <h1 className="h3 mb-4">Edit Category</h1>

      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={editCategory}>
            {/* NAME */}
            <div className="mb-3">
              <label className="form-label fw-bold">Category Name</label>
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={data.name || ""}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name[0]}
                </div>
              )}
            </div>

            {/* PARENT CATEGORY (UPDATED ONLY THIS PART) */}
            <div className="mb-3">
              <label className="form-label fw-bold">Parent Category</label>
              <Select
                options={categoryOptions}
                value={selectedCategory}
                isClearable
                isSearchable
                placeholder="Root Category"
                styles={selectStyles}
                onChange={(opt) =>
                  setData((prev) => ({
                    ...prev,
                    parent_id: opt ? opt.value : "",
                  }))
                }
              />
            </div>

            {/* SIZE GUIDE */}
            <div className="mb-3">
              <label className="form-label fw-bold">Size Guide Type</label>
              <select
                className={`form-select ${errors.size_guide_type ? "is-invalid" : ""
                  }`}
                name="size_guide_type"
                value={data.size_guide_type || ""}
                onChange={handleChange}
              >
                <option value="">-- No Size Guide --</option>
                <option value="shoe">Shoe Size Guide</option>
                <option value="dress">Dress Size Guide</option>
              </select>
              <small className="text-muted">
                Select size guide only if category needs sizing
              </small>
            </div>

            {/* PRIORITY */}
            <div className="mb-3">
              <label className="form-label fw-bold">Priority</label>
              <input
                type="number"
                className="form-control"
                name="priority"
                value={data.priority ?? 0}
                onChange={handleChange}
              />
            </div>

            {/* INVENTORY */}
            <div className="mb-4">
              <label className="form-label fw-bold d-block">Inventory</label>
              <StockTrackingToggle
                value={data.track_inventory}
                onChange={(next) =>
                  setData((prev) => ({ ...prev, track_inventory: next }))
                }
                disabled={isSubmitting}
                applyToProducts={applyTrackingToProducts}
                onApplyToProductsChange={setApplyTrackingToProducts}
              />
            </div>

            {/* HOME CATEGORY */}
            <div className="mb-4">
              <label className="form-label fw-bold d-block">
                Homepage Display
              </label>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-check card p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="home_category"
                      value="1"
                      checked={String(data.home_category) === "1"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-bold">
                      Show on Homepage
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check card p-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="home_category"
                      value="0"
                      checked={String(data.home_category) === "0"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-bold">
                      Hide from Homepage
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/dashboard/category")}
              >
                Cancel
              </button>

              <button className="btn btn-md" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
