"use client";
import Link from "next/link";
import { FaBoxes, FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function ProductActions({ productId, onDelete, onManageStock, variant = "desktop" }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      await axios.delete(`${baseUrl}api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      onDelete();
      
      Swal.fire({
        title: "Successfully Deleted",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "An Error Occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (variant === "mobile") {
    return (
      <div className="d-flex gap-1">
        {onManageStock && (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={onManageStock}
            title="Colour & size stock"
            disabled={isDeleting}
          >
            <FaBoxes />
          </button>
        )}
        <Link href={`/dashboard/products/edit/${productId}`}>
          <button className="btn btn-sm btn-outline-primary" disabled={isDeleting}>
            <FaEdit />
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <FaTrash />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex gap-1">
      {onManageStock && (
        <button
          className="btn btn-sm btn-outline-success"
          onClick={onManageStock}
          title="Colour & size stock"
          disabled={isDeleting}
        >
          <FaBoxes size={14} />
        </button>
      )}
      <Link href={`/dashboard/products/edit/${productId}`}>
        <button className="btn btn-sm btn-outline-primary" title="Edit" disabled={isDeleting}>
          <FaEdit size={14} />
        </button>
      </Link>
      <button
        className="btn btn-sm btn-outline-danger"
        onClick={handleDelete}
        title="Delete"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <span className="spinner-border spinner-border-sm" />
        ) : (
          <FaTrash size={14} />
        )}
      </button>
    </div>
  );
}