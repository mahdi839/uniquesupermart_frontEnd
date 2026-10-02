"use client"
import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function useStoreData() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const storeData = async (url, data, successMsg) => {
    let token = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    setLoading(true)
    setErrors({}); // Reset errors before new request
    try {
      await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Swal.fire({
        title: successMsg,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      })

      return true;
    } catch (err) {
      // Stock ran out between adding to cart and submitting. Name the exact
      // variants rather than showing a generic validation message.
      const shortfalls = err.response?.data?.shortfalls;

      if (Array.isArray(shortfalls) && shortfalls.length > 0) {
        const lines = shortfalls
          .map((item) => {
            const label = item.variant_label && item.variant_label !== 'Default'
              ? ` (${item.variant_label})`
              : '';
            return item.available > 0
              ? `${item.title}${label} — only ${item.available} left`
              : `${item.title}${label} — out of stock`;
          })
          .join('<br>');

        Swal.fire({
          title: 'Stock just changed',
          html: `${lines}<br><br>Please update your cart and try again.`,
          icon: 'warning',
        })

        return false;
      }

      if (err.response?.status === 422) {
        // Laravel validation errors
        setErrors(err.response.data.errors);

        // Show general error in toast
        const firstError = Object.values(err.response.data.errors)[0][0];
        Swal.fire({
          'title': 'Oops! Please Check',
          'text': firstError,
          'icon': 'error'
        })

      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message;
        Swal.fire({
          'title': 'Oops! Please Check',
          'text': errorMessage,
          'icon': 'error'
        })
      }

      return false;
    }
    finally {
      setLoading(false);
    }
  }

  return { storeData, loading }
}
