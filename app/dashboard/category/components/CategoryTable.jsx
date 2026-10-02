"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function CategoryTable({ categories }) {

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    const url =
      process.env.NEXT_PUBLIC_BACKEND_URL + `api/categories/${id}`;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete subcategories too!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Deleted!", "", "success");

      toast.success("Category deleted. Refresh to see updated list.");
    } catch (err) {
      toast.error("Failed to delete category");
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Parent</th>
            <th>Size Guide Type</th>
            <th>Stock</th>
            <th>Home</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center text-danger">
                No Categories Found
              </td>
            </tr>
          )}

          {categories.map((cat, index) => (
            <tr key={cat.id}>
              <td>{index + 1}</td>
              <td>{cat.name}</td>
              <td><code>{cat.slug}</code></td>
              <td>
                {cat.parent ? (
                  <span className="badge bg-secondary">
                    {cat.parent.name}
                  </span>
                ) : (
                  <span className="text-muted">Root</span>
                )}
              </td>
              <td>{cat.size_guide_type ?? "N/A"}</td>
              <td>
                {cat.track_inventory ? (
                  <span className="badge bg-success">Tracked</span>
                ) : (
                  <span className="badge bg-light text-secondary border">Off</span>
                )}
              </td>
              <td>
                <span
                  className={`badge ${
                    cat.home_category ? "bg-info" : "bg-danger"
                  }`}
                >
                  {cat.home_category ? "On" : "Off"}
                </span>
              </td>
              <td>{cat.priority}</td>
              <td>
                <div className="d-flex gap-2">
                  <Link href={`/dashboard/category/edit/${cat.id}`}>
                    <button className="btn btn-sm btn-outline-primary">
                      <FaEdit /> Edit
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
