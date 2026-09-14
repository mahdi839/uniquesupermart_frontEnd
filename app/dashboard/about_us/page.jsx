"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useStoreData from "@/app/hooks/useStoreData";
import useUpdateData from "@/app/hooks/useUpdateData";
import useShowData from "@/app/hooks/useShowData";
import Loading from "@/app/loading";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

// Dynamically import ReactQuill (important for Next.js SSR)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AboutUsForm() {
  const { storeData, loading: storeLoading } = useStoreData();
  const { updateData, loading: updateLoading } = useUpdateData();
  const { showData, loading: fetchLoading, data } = useShowData();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordId, setRecordId] = useState(null);

  // Fetch existing AboutUs data
  useEffect(() => {
    showData(process.env.NEXT_PUBLIC_BACKEND_URL + "api/about-us");
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        content: data.content || "",
      });
      setRecordId(data.id || null);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.endsWith("/")
        ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
        : process.env.NEXT_PUBLIC_BACKEND_URL;

      if (data.image) {
        setPreviewUrl(backendUrl + "/storage/" + data.image);
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

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("content", formData.content);
    if (imageFile) {
      payload.append("image", imageFile);
    }

    if (recordId) {
      await updateData(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/about-us/${recordId}`,
        payload,
        "About Us updated!",
        ""
      );
    } else {
      await storeData(
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/about-us",
        payload,
        "About Us saved!"
      );
    }

    showData(process.env.NEXT_PUBLIC_BACKEND_URL + "api/about-us");
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
      <div className="card shadow-lg rounded-3 border-0 w-100" style={{ maxWidth: "700px" }}>
        <div className="card-header text-white py-3 rounded-top-3" style={{ background: "var(--primary-color)" }}>
          <h5 className="mb-0 text-center">About Us</h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Content (Rich Text Editor) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Content</label>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Image</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Image Preview"
                  width={200}
                  height={200}
                  className="mt-2 rounded"
                  style={{ height: "auto" }}
                />
              )}
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
