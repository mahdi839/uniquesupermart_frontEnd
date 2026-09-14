"use client";
import React, { useEffect, useState } from "react";
import useStoreData from "@/app/hooks/useStoreData";
import useUpdateData from "@/app/hooks/useUpdateData";
import useShowData from "@/app/hooks/useShowData";
import Loading from "@/app/loading";

export default function FooterSettingsForm() {
  const { storeData, loading: storeLoading } = useStoreData();
  const { updateData, loading: updateLoading } = useUpdateData();
  const { showData, loading: fetchLoading, data } = useShowData();

  const [formData, setFormData] = useState({
    company_description: "",
    company_address: "",
    company_email: "",
    company_phone: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    showData(process.env.NEXT_PUBLIC_BACKEND_URL + "api/footer-settings/1");
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        company_description: data.company_description || "",
        company_address: data.company_address || "",
        company_email: data.company_email || "",
        company_phone: data.company_phone || "",
      });
      setRecordId(data.id);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.endsWith("/")
        ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
        : process.env.NEXT_PUBLIC_BACKEND_URL;

      if (data.logo_path) {
        setPreviewUrl(backendUrl + data.logo_path);
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("company_description", formData.company_description);
    payload.append("company_address", formData.company_address);
    payload.append("company_email", formData.company_email);
    payload.append("company_phone", formData.company_phone);
    if (logoFile) {
      payload.append("logo_path", logoFile);
    }

    if (recordId) {
      await updateData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings/${recordId}`,
        payload,
        "Footer settings updated!",
        ""
      );
    } else {
      await storeData(
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/footer-settings",
        payload,
        "Footer settings saved!"
      );
    }

    showData(process.env.NEXT_PUBLIC_BACKEND_URL + "api/footer-settings/1");
  };

  if (fetchLoading) {
    return (
      <div className="text-center mt-5">
        <Loading animation="border" /> Loading...
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card shadow-lg rounded-3 border-0 w-100"
        style={{ maxWidth: "700px" }}
      >
        <div
          className="card-header text-white py-3 rounded-top-3"
          style={{ background: "var(--primary-color)" }}
        >
          <h5 className="mb-0 text-center">Web Settings</h5>
        </div>

        <div className="card-body p-4">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            autoComplete="off"
          >
            {/* Logo Upload */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Company Logo</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  className="mt-2 rounded"
                  style={{ maxWidth: "200px", height: "auto" }}
                />
              )}
            </div>

            {/* Company Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Company Description</label>
              <textarea
                name="company_description"
                className="form-control"
                value={formData.company_description}
                onChange={handleInputChange}
                rows={4}
              ></textarea>
            </div>

            {/* Company Address */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Company Address</label>
              <input
                type="text"
                name="company_address"
                className="form-control"
                value={formData.company_address}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Company Email</label>
              <input
                type="email"
                name="company_email"
                className="form-control"
                value={formData.company_email}
                onChange={handleInputChange}
              />
            </div>

            {/* Company Phone */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Company Phone</label>
              <input
                type="text"
                name="company_phone"
                className="form-control"
                value={formData.company_phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4 pt-2 border-top">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={storeLoading || updateLoading}
              >
                {storeLoading || updateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
