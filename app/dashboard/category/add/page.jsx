"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { clearCategoryCache, fetchCategories } from "@/redux/slices/categorySlice";
import StockTrackingToggle from "../components/StockTrackingToggle";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    parent_id: "",
    home_category: "0",
    priority: 0,
    size_guide_type: "",
    track_inventory: false,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/frontend/categories";
        const res = await fetch(url);
        const data = await res.json();
        setCategories(data || []);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Flatten nested categories recursively for the select dropdown
  const flattenCategories = (categories, level = 0, result = []) => {
    categories.forEach((cat) => {
      result.push({
        id: cat.id,
        name: cat.name,
        level: level,
        parent_id: cat.parent_id,
      });

      if (cat.all_children && cat.all_children.length > 0) {
        flattenCategories(cat.all_children, level + 1, result);
      }
    });
    return result;
  };

  const flatCategories = flattenCategories(categories);

  // Count total categories recursively
  const countCategories = (categories) => {
    let count = categories.length;
    categories.forEach((cat) => {
      if (cat.all_children && cat.all_children.length > 0) {
        count += countCategories(cat.all_children);
      }
    });
    return count;
  };

  const totalCategories = countCategories(categories);

  // Prepare options for React Select
  const categoryOptions = flatCategories.map((cat) => ({
    value: cat.id,
    label: `${"└─ ".repeat(cat.level)}${cat.name}`,
    level: cat.level,
  }));

  // Get selected category option
  const selectedCategory = form.parent_id
    ? categoryOptions.find((opt) => opt.value === form.parent_id)
    : null;

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (form.name.length > 100) {
      newErrors.name = "Category name must be less than 100 characters";
    }

    if (form.priority < 0 || form.priority > 999) {
      newErrors.priority = "Priority must be between 0 and 999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "api/categories";

    try {
      await axios.post(
        url,
        {
          name: form.name.trim(),
          parent_id: form.parent_id || null,
          home_category: form.home_category,
          priority: Number(form.priority),
          size_guide_type: form.size_guide_type || null,
          track_inventory: form.track_inventory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // 🔥 invalidate cache
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags: ["products"],
        }),
      });
      // Clear cached categories
      dispatch(clearCategoryCache())

      // Refetch fresh categories
      dispatch(fetchCategories())

      toast.success("Category created successfully!");
      router.push("/dashboard/category");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Custom styles for React Select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none",
      "&:hover": {
        borderColor: "#86b7fe",
      },
      minHeight: "38px",
      fontFamily: "monospace",
    }),
    option: (base, state) => ({
      ...base,
      paddingLeft: `${state.data.level * 20 + 12}px`,
      backgroundColor: state.isSelected
        ? "#0d6efd"
        : state.isFocused
          ? "#e7f1ff"
          : "white",
      color: state.isSelected ? "white" : "#212529",
      fontFamily: "monospace",
      "&:active": {
        backgroundColor: "#0d6efd",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header Section */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <button
          onClick={() => router.push("/dashboard/category")}
          className="btn btn-outline-secondary"
        >
          <i className="fas fa-arrow-left me-2"></i>
          Back to Categories
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Categories
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {totalCategories}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-folder fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">
                    Root Categories
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">
                    {categories.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-sitemap fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          {/* Main Form Card */}
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">
                <i className="fas fa-plus-circle me-2"></i>
                Category Information
              </h6>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {/* Category Name */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="categoryName" className="form-label fw-bold">
                      <i className="fas fa-tag me-2"></i>
                      Category Name
                      <span className="text-danger"> *</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-font"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="categoryName"
                        placeholder="Enter a descriptive category name"
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                      {errors.name && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Size Guide Type */}

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="fas fa-ruler-combined me-2"></i>
                      Size Guide Type
                    </label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-list"></i>
                      </span>
                      <select
                        className={`form-select ${errors.size_guide_type ? "is-invalid" : ""
                          }`}
                        value={form.size_guide_type}
                        onChange={(e) =>
                          handleInputChange("size_guide_type", e.target.value)
                        }
                        disabled={isSubmitting}
                      >
                        <option value="">-- No Size Guide --</option>
                        <option value="shoe">Shoe Size Guide</option>
                        <option value="dress">Dress Size Guide</option>
                      </select>

                      {errors.size_guide_type && (
                        <div className="invalid-feedback">
                          {errors.size_guide_type}
                        </div>
                      )}
                    </div>

                    <small className="text-muted">
                      Select size guide only if category needs sizing
                    </small>
                  </div>
                </div>

                {/* Parent Category & Priority */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="parentCategory" className="form-label fw-bold">
                      <i className="fas fa-sitemap me-2"></i>
                      Parent Category
                    </label>
                    <Select
                      id="parentCategory"
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={(option) =>
                        handleInputChange("parent_id", option ? option.value : "")
                      }
                      isClearable
                      isSearchable
                      placeholder="-- Root Category (No Parent) --"
                      isDisabled={isSubmitting || loading}
                      styles={customSelectStyles}
                      noOptionsMessage={() => "No categories found"}
                    />
                    <small className="form-text text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      You can nest categories at any level. Type to search.
                    </small>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label fw-bold">
                      <i className="fas fa-sort-numeric-down me-2"></i>
                      Display Priority
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-sort-amount-up"></i>
                      </span>
                      <input
                        type="number"
                        className={`form-control ${errors.priority ? "is-invalid" : ""
                          }`}
                        id="priority"
                        min="0"
                        max="999"
                        value={form.priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        disabled={isSubmitting}
                      />
                      {errors.priority && (
                        <div className="invalid-feedback">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.priority}
                        </div>
                      )}
                    </div>
                    <small className="form-text text-muted">
                      Higher number = higher display priority (0-999)
                    </small>
                  </div>
                </div>

                {/* Inventory */}
                <div className="row mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-bold d-block">
                      <i className="fas fa-warehouse me-2"></i>
                      Inventory
                    </label>
                    <StockTrackingToggle
                      value={form.track_inventory}
                      onChange={(next) => handleInputChange("track_inventory", next)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Homepage Display */}
                <div className="row mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-bold d-block">
                      <i className="fas fa-home me-2"></i>
                      Homepage Display Settings
                    </label>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3 mb-md-0">
                            <div className="form-check card border p-3 h-100">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="home_category"
                                id="showOnHomepage"
                                value="1"
                                checked={form.home_category === "1"}
                                onChange={(e) =>
                                  handleInputChange("home_category", e.target.value)
                                }
                                disabled={isSubmitting}
                              />
                              <label
                                className="form-check-label fw-bold"
                                htmlFor="showOnHomepage"
                              >
                                <i className="fas fa-eye text-success me-2"></i>
                                Show on Homepage
                              </label>
                              <small className="text-muted d-block mt-1">
                                Category will be featured prominently on the homepage
                              </small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check card border p-3 h-100">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="home_category"
                                id="hideFromHomepage"
                                value="0"
                                checked={form.home_category === "0"}
                                onChange={(e) =>
                                  handleInputChange("home_category", e.target.value)
                                }
                                disabled={isSubmitting}
                              />
                              <label
                                className="form-check-label fw-bold"
                                htmlFor="hideFromHomepage"
                              >
                                <i className="fas fa-eye-slash text-secondary me-2"></i>
                                Hide from Homepage
                              </label>
                              <small className="text-muted d-block mt-1">
                                Category will only appear in category listings
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row mt-5">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between border-top pt-4">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => router.push("/dashboard/category")}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </button>
                      <div className="d-flex gap-3">
                        <button
                          type="submit"
                          className="btn btn-primary px-5"
                          disabled={isSubmitting || !form.name.trim()}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Creating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Create Category
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-25"
          style={{ zIndex: 9999 }}
        >
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-primary fw-bold">Loading categories...</p>
          </div>
        </div>
      )}
    </div>
  );
}