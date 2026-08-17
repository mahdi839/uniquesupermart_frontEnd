"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/app/components/dashboard/components/button/Button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CUSTOMER_BADGES } from "../../badgeConfig";

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    badge_title: "",
  });
  const [hasUserAccount, setHasUserAccount] = useState(false);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const token = localStorage.getItem("token");
        const base = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await axios.get(`${base}api/customer-profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const customer = res.data.data;
        setForm({
          name: customer.name || "",
          phone: customer.phone || "",
          email: customer.email || "",
          password: "",
          badge_title: customer.assigned_badge?.title || "",
        });
        setHasUserAccount(!!customer.has_user_account);
      } catch {
        toast.error("Customer not found");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        badge_title: form.badge_title || null,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await axios.put(`${base}api/customer-profiles/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Customer updated successfully");
      router.push("/dashboard/customers");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "640px" }}>
        <div className="card-body p-4">
          <h4 className="mb-4">Edit Customer</h4>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="fw-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="fw-bold mb-2">Badge</label>
              <select
                name="badge_title"
                className="form-select"
                value={form.badge_title}
                onChange={handleChange}
              >
                <option value="">No badge</option>
                {CUSTOMER_BADGES.map((badge) => (
                  <option key={badge.title} value={badge.title}>
                    {badge.label}
                  </option>
                ))}
              </select>
            </div>

            <hr />
            <p className="text-muted small">
              Fill email and password to create a user login for this customer.
              {hasUserAccount ? " This customer already has a user account." : ""}
            </p>

            <div className="mb-3">
              <label className="fw-bold mb-2">Email {hasUserAccount ? "" : "(optional)"}</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                placeholder="customer@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold mb-2">
                Password {hasUserAccount ? "(leave blank to keep current)" : "(optional)"}
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="d-flex gap-2">
              <Button type="button" className="btn btn-outline-secondary" onClick={() => router.push("/dashboard/customers")}>
                Cancel
              </Button>
              <Button type="submit" className="btn btn-primary flex-fill">
                {saving ? "Saving..." : "Save Customer"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
