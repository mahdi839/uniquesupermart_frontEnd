"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import SiteLogo from "@/app/components/frontEnd/SiteLogo";

export default function RegisterFormBootstrap({ onSuccessRedirect = "/" }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const ENDPOINT = "api/signUp";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ✅ Helper function to set cookie
  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function clientValidate() {
    const list = [];
    if (!form.name.trim()) list.push("Name is required.");
    if (!form.email.trim()) list.push("Email is required.");
    else if (!emailRegex.test(form.email)) list.push("Email is not valid.");
    if (!form.password) list.push("Password is required.");
    else if (form.password.length < 6) list.push("Password must be at least 6 characters.");
    if (form.confirmPassword !== form.password) list.push("Passwords do not match.");
    setErrors(list);
    return list.length === 0;
  }

  function extractServerErrors(data) {
    const list = [];
    if (Array.isArray(data?.error)) return data.error;
    if (typeof data?.errors === "object") {
      Object.values(data.errors).forEach((arr) => {
        if (Array.isArray(arr)) list.push(...arr);
      });
    }
    if (data?.message && list.length === 0) list.push(data.message);
    return list.length ? list : ["Registration failed."];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clientValidate()) return;

    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch(`${API_BASE}${API_BASE.endsWith("/") ? "" : "/"}${ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status === false) {
        const msgs = extractServerErrors(data);
        setErrors(msgs);
        toast.error("Registration failed");
        return;
      }

      // ✅ Auto-login: store token, roles & user data
      if (typeof window !== "undefined") {
        // LocalStorage
        localStorage.setItem("token", data?.token || "");
        localStorage.setItem("user_id", data?.user?.id || "");
        localStorage.setItem("user_name", data?.user?.name || "");
        localStorage.setItem("roles", JSON.stringify(data?.user?.roles || ["user"]));
        localStorage.setItem("permissions", JSON.stringify(data?.user?.permissions || []));

        // ✅ Cookies (for middleware)
        setCookie("token", data?.token || "");
        setCookie("roles", JSON.stringify(data?.user?.roles || ["user"]));
        setCookie("user_id", data?.user?.id || "");
      }

      toast.success("Account created successfully!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      if (onSuccessRedirect) window.location.assign(onSuccessRedirect);
    } catch (err) {
      console.error(err);
      setErrors(["Network error. Please try again."]);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  const nameInvalid = touched.name && !form.name.trim();
  const emailInvalid = touched.email && (!form.email.trim() || !emailRegex.test(form.email));
  const pwInvalid = touched.password && (!form.password || form.password.length < 6);
  const cpwInvalid = touched.confirmPassword && form.confirmPassword !== form.password;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-10">
          <div className="card shadow-sm">
            <div className="card-body">
            <div className="text-center mb-4">
              <SiteLogo
                sizes="180px"
                className="auth-brand-logo mx-auto mb-3"
              />
              <h1 className="h4 mb-1">Create your account</h1>
              <p className="text-muted mb-0">Fill in your details to get started.</p>
            </div>

              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0 ps-3">{errors.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${nameInvalid ? "is-invalid" : touched.name ? "is-valid" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    required
                  />
                  {nameInvalid && <div className="invalid-feedback">Please enter your name.</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${emailInvalid ? "is-invalid" : touched.email ? "is-valid" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    required
                  />
                  {emailInvalid && <div className="invalid-feedback">Please enter a valid email.</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${pwInvalid ? "is-invalid" : touched.password ? "is-valid" : ""}`}
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                  />
                  {pwInvalid && <div className="invalid-feedback">Password must be at least 6 characters.</div>}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label">Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${cpwInvalid ? "is-invalid" : touched.confirmPassword ? "is-valid" : ""}`}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    required
                  />
                  {cpwInvalid && <div className="invalid-feedback">Passwords do not match.</div>}
                </div>

                <button className="btn btn-grad w-100" type="submit" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2" role="status"></span>}
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="mt-3 text-center text-muted">
                Already have an account?{" "}
                <a href="/frontEnd/log_in" className="fw-semibold">Log in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}