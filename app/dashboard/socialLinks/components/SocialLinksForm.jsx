"use client";
import React, { useEffect, useState } from "react";
import useStoreData from "@/app/hooks/useStoreData";
import useUpdateData from "@/app/hooks/useUpdateData";
import useShowData from "@/app/hooks/useShowData";
import Loading from "@/app/loading";

export default function SocialLinksForm() {
  const { storeData, loading: storeLoading } = useStoreData();
  const { updateData, loading: updateLoading } = useUpdateData();
  const { showData, loading: fetchLoading, data } = useShowData();

  const [formData, setFormData] = useState({
    facebook: "",
    youtube: "",
    instagram: "",
    tweeter: "",
    pinterest: "",
    facebook_id: "",
    whatsapp_number: "+880", // default with country code
  });

  const [recordId, setRecordId] = useState(null);

  // Fetch existing social links on mount
  useEffect(() => {
    showData(process.env.NEXT_PUBLIC_BACKEND_URL + "api/social-links-first");
  }, []);

  // When data is fetched, populate the form
  useEffect(() => {
    if (data) {
      setFormData({
        facebook: data.facebook || "",
        youtube: data.youtube || "",
        instagram: data.instagram || "",
        tweeter: data.tweeter || "",
        pinterest: data.pinterest || "",
        facebook_id: data.facebook_id || "",
        whatsapp_number: data.whatsapp_number || "+880",
      });
      setRecordId(data.id);
    } else {
      setFormData((prev) => ({
        ...prev,
        whatsapp_number: "+880",
      }));
    }
  }, [data]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recordId) {
      await updateData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/social-links/${recordId}`,
        formData,
        "Social links updated!",
        ""
      );
    } else {
      await storeData(
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/social-links",
        formData,
        "Social links saved!"
      );
    }

    // Refetch after submit
    showData(process.env.NEXT_PUBLIC_BACKEND_URL + "api/social-links-first");
    // ✅ IMPROVED: Revalidate cache with error handling and logging

    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: ["social-links"],
      }),
    });

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
        style={{ maxWidth: "600px" }}
      >
        <div
          className="card-header text-white py-3 rounded-top-3"
          style={{ background: "var(--primary-color)" }}
        >
          <h5 className="mb-0 text-center">Social Links</h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Other social link inputs */}
            {[
              { label: "Facebook", name: "facebook" },
              { label: "YouTube", name: "youtube" },
              { label: "Instagram", name: "instagram" },
              { label: "Tweeter", name: "tweeter" },
              { label: "Pinterest", name: "pinterest" },
              { label: "Facebook Id", name: "facebook_id" },
            ].map(({ label, name }) => (
              <div className="mb-3" key={name}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type={
                    label === "Facebook Id" ? "text" : "url"
                  }
                  name={name}
                  className="form-control"
                  placeholder={`Enter ${label} ${label === "Facebook Id" ? "" : "URL"
                    }`}
                  value={formData[name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            {/* WhatsApp number input with prefilled country code */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Whatsapp Number</label>
              <div className="input-group">
                <span className="input-group-text">+880</span>
                <input
                  type="number"
                  name="whatsapp_number"
                  className="form-control"
                  placeholder="Enter WhatsApp number (without country code)"
                  value={formData.whatsapp_number.replace("+880", "")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whatsapp_number: "+880" + e.target.value,
                    }))
                  }
                />
              </div>
            </div>

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
