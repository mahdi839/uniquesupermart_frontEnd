"use client"
import Button from '@/app/components/dashboard/components/button/Button'
import React, { useEffect, useRef, useState } from 'react'
import OrderTable from './components/OrderTable'
import Pagination from './components/Pagination'
import axios from 'axios'
import { toast } from 'react-toastify'
import BulkInvoicePrint from './components/BulkInvoicePrint'

export default function Page() {
  const [page, setPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [printOrders, setPrintOrders] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false); // ← triggers print after render
  const [companyInfo, setCompanyInfo] = useState({});
  const [companyLogo, setCompanyLogo] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    min: '',
    max: '',
    start_date: '',
    end_date: '',
    district: '',
    product_id: '',
    product_title: '',
    status: ''
  });

  // Get token on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      setToken(savedToken);
    }
  }, []);

  // Fetch company info once for invoice printing
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings/1`,
          { headers: { Authorization: `Bearer ${t}` } }
        );
        setCompanyInfo({
          description: data.company_description,
          address: data.company_address,
          email: data.company_email,
          phone: data.company_phone,
        });
        if (data.logo_path) {
          const base = process.env.NEXT_PUBLIC_BACKEND_URL.endsWith('/')
            ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
            : process.env.NEXT_PUBLIC_BACKEND_URL;
          setCompanyLogo(base + data.logo_path);
        }
      } catch (e) {
        console.error('Failed to fetch company info:', e);
      }
    };
    fetchCompanyInfo();
  }, []);

  // ── KEY FIX ─────────────────────────────────────────────────────────────
  // Watch printOrders + shouldPrint. This effect runs AFTER React has
  // committed the new invoice DOM nodes, so window.print() finds real content.
  // Double requestAnimationFrame ensures the browser has painted before print.
  // Replace the existing shouldPrint useEffect in page.jsx
  useEffect(() => {
    if (!shouldPrint || printOrders.length === 0) return;

    const handleAfterPrint = () => {
      setPrintOrders([]);
      setSelectedOrderIds([]);
      setShouldPrint(false);
      setIsPrinting(false);
      window.removeEventListener("afterprint", handleAfterPrint);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    // Wait for images inside the portal to load before printing
    const portalEl = document.getElementById("bulk-invoice-portal");
    const images = portalEl ? Array.from(portalEl.querySelectorAll("img")) : [];

    const printWhenReady = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    };

    if (images.length === 0) {
      printWhenReady();
    } else {
      let loaded = 0;
      const onLoad = () => {
        loaded++;
        if (loaded >= images.length) printWhenReady();
      };
      images.forEach((img) => {
        if (img.complete) {
          onLoad();
        } else {
          img.addEventListener("load", onLoad);
          img.addEventListener("error", onLoad); // don't block on broken images
        }
      });
    }

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [shouldPrint, printOrders]);
  // ────────────────────────────────────────────────────────────────────────

  // Build URL with filters
  const buildIndexUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + `api/orders?page=${page}`;
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return `${baseUrl}&${params.toString()}`;
  };

  // Build CSV download URL with same filters
  const buildCsvUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'api/orders-download-csv';
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  // Fetch orders data
  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(buildIndexUrl(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page
      });
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.response?.data?.message || err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when page, filters, or token changes
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [page, filters, token]);

  const handleApplyFilters = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters({
      search: '',
      min: '',
      max: '',
      start_date: '',
      end_date: '',
      district: '',
      product_id: '',
      product_title: '',
      status: ''
    });
  };

  const handleDownloadCSV = async () => {
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }
    try {
      setIsDownloading(true);
      const csvUrl = buildCsvUrl();
      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers.get('content-disposition');
      let filename = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Bulk print selected invoices
  const handleBulkPrint = async () => {
    if (!selectedOrderIds.length) return;
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }
    setIsPrinting(true);
    try {
      const results = await Promise.all(
        selectedOrderIds.map(id =>
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).then(r => r.data.order)
        )
      );
      // Step 1: populate the hidden print container
      setPrintOrders(results);
      // Step 2: signal the useEffect to print once React re-renders
      setShouldPrint(true);
      // Note: setIsPrinting(false) is handled in the useEffect after print
    } catch (err) {
      console.error('Bulk print error:', err);
      toast.error('Failed to load order details for printing. Please try again.');
      setIsPrinting(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className='d-flex justify-content-between align-items-center'>
        <button
          className="mb-3 btn btn-success btn-sm px-3 py-2"
          onClick={handleDownloadCSV}
          disabled={isDownloading || !token}
        >
          {isDownloading ? 'Downloading...' : 'Download CSV'}
        </button>

        {selectedOrderIds.length > 0 && (
          <Button
            className="mb-3 btn btn-success btn-md"
            onClick={handleBulkPrint}
            disabled={isPrinting}
            style={{ background: '#198754', borderColor: '#198754', color: '#fff' }}
          >
            {isPrinting
              ? 'Preparing...'
              : `🖨 Print ${selectedOrderIds.length} Invoice${selectedOrderIds.length > 1 ? 's' : ''}`
            }
          </Button>
        )}
      </div>

      <OrderTable
        loading={loading}
        orders={orders}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        selectedOrderIds={selectedOrderIds}
        onSelectionChange={setSelectedOrderIds}
        onBadgeUpdated={(phone, assignedBadge) => {
          setOrders((prev) =>
            prev.map((order) =>
              order.phone === phone ? { ...order, assigned_badge: assignedBadge } : order
            )
          );
        }}
      />

      {pagination.last_page > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          pagination={pagination}
        />
      )}

      {/* Hidden bulk print container — only visible during window.print() */}
      <BulkInvoicePrint
        orders={printOrders}
        companyInfo={companyInfo}
        companyLogo={companyLogo}
      />
    </div>
  )
}
