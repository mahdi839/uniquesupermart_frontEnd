"use client";
import useShowData from "@/app/hooks/useShowData";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";
import "./style.css";
import useUpdateData from "@/app/hooks/useUpdateData";
export default function page() {
  const { id } = useParams();
  const { showData, loading, data } = useShowData();
  const [slot, setSlot] = useState(null);
  const [formData, setFormData] = useState({
    link: "",
    type: "",
    products_slots_id: "",
    category_id: "",
    existingImages: [],
    newImages: [],
    delete_images: [],
  });
  const slotUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `api/product-slots`;
  async function getSlotData() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(slotUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSlot(response.data.data);
    } catch (err) {
      Swal.fire({
        title: "Oops! Please Check",
        text: err.response?.data?.message || err.message,
        icon: "error",
      });
    }
  }
  const url = process.env.NEXT_PUBLIC_BACKEND_URL + `api/banners/${id}`;
  useEffect(() => {
    showData(url);
    getSlotData();
  }, [url]);

  useEffect(() => {
    if (data) {
      setFormData({
        link: data.link || "",
        type: data.type || "hero",
        products_slots_id: data.products_slots_id || "",
        category_id: data.category_id || "",
        existingImages: data.banner_images || [],
        newImages: [],
        delete_images: [],
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteImage = (imgId) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img.id !== imgId),
      delete_images: [...prev.delete_images, imgId],
    }));
  };

  const handleChangeFileChange = (e) => {
    setFormData({ ...formData, newImages: e.target.files });
  };

  const { updateData } = useUpdateData();

  const handleSubmit = async (e) => {
    let updateurl = process.env.NEXT_PUBLIC_BACKEND_URL + `api/banners/${id}`;
    e.preventDefault();
    let payload = new FormData();
    payload.append("link", formData.link);
    payload.append("type", formData.type);

    if (formData.type === "slot") {
      payload.append("products_slots_id", formData.products_slots_id);
    }

    if (formData.type === "category") {
      payload.append("category_id", formData.category_id);
    }

    for (let i = 0; i < formData.newImages.length; i++) {
      payload.append(`images[${i}]`, formData.newImages[i]);
    }

    for (let i = 0; i < formData.delete_images.length; i++) {
      payload.append(`delete_images[${i}]`, formData.delete_images[i]);
    }



    await updateData(
      updateurl,
      payload,
      "Successfully Updated",
      "/dashboard/banners"
    );
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card shadow-lg rounded-3 border-0 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div
          className="card-header  text-white py-3 rounded-top-3"
          style={{ background: "var(--primary-color)" }}
        >
          <h5 className="mb-0 text-center">Add Banner Images</h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Slot Name */}
              <div
                className={`${formData.type === "category" || formData.type === "slot"
                    ? "col-md-6"
                    : "col-md-12"
                  }`}
              >
                <div className="">
                  <select
                    name="type"
                    className="form-select border-secondary"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="hero">Hero Section Slider</option>
                    <option value="slot">Slot</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>

              {formData.type === "category" && (
                <div className="col-md-6">
                  <div className="">
                    <select
                      className="form-select border-secondary"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {data?.data?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {formData.type === "slot" && (
                <div className="col-md-6">
                  <div className="">
                    <select
                      className="form-select border-secondary"
                      name="products_slots_id"
                      value={formData.products_slots_id}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Slot
                      </option>
                      {slot?.map((singleSlot) => (
                        <option key={singleSlot.id} value={singleSlot.id}>
                          {singleSlot.slot_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* images */}
              <div className="col-md-6">
                <div className="form">
                  <input
                    type="file"
                    className="form-control border-secondary"
                    id="images"
                    placeholder="Select Image"
                    name="images"
                    multiple={formData.type == "hero"}
                    required={formData.existingImages.length < 1}
                    onChange={handleChangeFileChange}
                  />
                  <div className="d-flex gap-3 mt-2">
                    {formData.existingImages?.map((img) => (
                      <div className="bannger_img_div" key={img.id}>
                        <Image
                          className="ml-2 rounded "
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${img.path}`}
                          width={50}
                          height={50}
                        />
                        <MdCancel
                          className="banner_img_cancel_icon"
                          onClick={() => handleDeleteImage(img.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* links */}
              <div className="col-md-6">
                <div className="form">
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="link"
                    placeholder="Give link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-5 pt-3 border-top col-12">
              <div className="d-flex gap-2 justify-content-center">
                <button type="submit" className="dashboard-btn">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
