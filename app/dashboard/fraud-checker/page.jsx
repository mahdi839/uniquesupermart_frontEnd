"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DEFAULT_SETTINGS = {
  api_key: "",
  is_active: false,
  cache_minutes: 60,
  has_api_key: false,
  api_key_hint: null,
  provider_url: "",
};

export default function FraudCheckerSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [testPhone, setTestPhone] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}api/fraud-checker/settings`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setSettings((prev) => ({ ...prev, ...(data.data || {}) }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load courier checker settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [baseUrl]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}api/fraud-checker/settings`,
        {
          api_key: settings.api_key,
          is_active: settings.is_active,
          cache_minutes: Number(settings.cache_minutes),
        },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setSettings((prev) => ({ ...prev, ...(data.data || {}), api_key: "" }));
      toast.success("Courier checker settings saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save courier checker settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!testPhone.trim()) {
      toast.error("Enter a phone number to test.");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const { data } = await axios.post(
        `${baseUrl}api/fraud-checker/settings/test`,
        { phone: testPhone },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      setTestResult(data.data);
      toast.success("Courier checker connection successful.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Courier checker test failed.");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center"><div className="spinner-border text-primary" role="status" /></div>;
  }

  const summary = testResult?.summary;

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-2">Courier History Checker</h3>
              <p className="text-muted mb-4">
                Configure the server-side courier history lookup used from the order list. The API key is encrypted in Laravel and is never returned to the browser.
              </p>

              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">BD Courier API key</label>
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    placeholder={settings.has_api_key ? `Configured (${settings.api_key_hint}) — leave blank to keep it` : "Paste the API key"}
                    value={settings.api_key}
                    onChange={(event) => setSettings((prev) => ({ ...prev, api_key: event.target.value }))}
                  />
                  <div className="form-text">Do not put this key in frontend environment variables or source code.</div>
                </div>

                <div className="row g-3 align-items-end">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Cache result (minutes)</label>
                    <input
                      type="number"
                      min="0"
                      max="1440"
                      className="form-control"
                      value={settings.cache_minutes}
                      onChange={(event) => setSettings((prev) => ({ ...prev, cache_minutes: event.target.value }))}
                    />
                    <div className="form-text">Use 0 to disable caching. Caching avoids repeated provider requests for the same phone.</div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check form-switch mb-2">
                      <input
                        id="fraud-checker-active"
                        className="form-check-input"
                        type="checkbox"
                        checked={settings.is_active}
                        onChange={(event) => setSettings((prev) => ({ ...prev, is_active: event.target.checked }))}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="fraud-checker-active">Enable courier checker</label>
                    </div>
                  </div>
                </div>

                <div className="alert alert-light border mt-4 mb-3">
                  <div className="small text-muted">Provider endpoint</div>
                  <code>{settings.provider_url || "https://api.bdcourier.com/courier-check"}</code>
                  <div className="small text-muted mt-2">The endpoint is intentionally fixed on the server to prevent arbitrary URL requests from the dashboard.</div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </form>

              <hr className="my-4" />

              <h5 className="fw-bold mb-2">Test connection</h5>
              <p className="small text-muted">Save the API key first, then test it with a known Bangladesh mobile number.</p>
              <div className="input-group">
                <input type="tel" className="form-control" placeholder="017XXXXXXXX" value={testPhone} onChange={(event) => setTestPhone(event.target.value)} />
                <button type="button" className="btn btn-outline-primary" onClick={handleTest} disabled={testing}>
                  {testing ? "Checking..." : "Test API"}
                </button>
              </div>

              {summary && (
                <div className="alert alert-success mt-3 mb-0">
                  <strong>Connection successful.</strong> Overall success rate: {Number(summary.success_ratio || 0).toFixed(2)}% ({summary.success_parcel || 0} delivered / {summary.total_parcel || 0} total).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
