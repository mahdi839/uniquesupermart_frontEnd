"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PageLoader from "@/app/components/loader/pageLoader";
import useFormatDate from "@/app/hooks/useFormatDate";
import { FaPrint, FaArrowLeft } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { siteConfig } from "@/config/siteConfig";
export default function InvoicePage() {
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [companyLogo, setCompanyLogo] = useState("");
    const [companyInfo, setCompanyInfo] = useState({});
    const { formatDate } = useFormatDate();

    useEffect(() => {
        fetchOrderDetails();
        fetchCompanyInfo();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrder(data.order);
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyInfo = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/footer-settings/1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCompanyInfo({
                description: data.company_description,
                address: data.company_address,
                email: data.company_email,
                phone: data.company_phone,
            });

            if (data.logo_path) {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL.endsWith("/")
                    ? process.env.NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
                    : process.env.NEXT_PUBLIC_BACKEND_URL;
                setCompanyLogo(backendUrl + data.logo_path);
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!order) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Order not found</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Action Buttons - Hidden in Print */}
            <div className="d-flex justify-content-between align-items-center mb-4 no-print">
                <button className="btn btn-outline-primary" onClick={handleBack}>
                    <FaArrowLeft className="me-2" />
                    Back to Orders
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                    <FaPrint className="me-2" />
                    Print Invoice
                </button>
            </div>

            {/* Invoice Card */}
            <div className="card shadow-lg invoice-card">
                <div className="card-body p-4 p-print-2">
                    {/* Header Section */}
                    <div className="row mb-4 border-bottom pb-4">
                        <div className="col-6">
                            {companyLogo && (
                                <img
                                    src={companyLogo}
                                    alt="Company Logo"
                                    className="mb-3 company-logo"
                                    style={{ maxHeight: "70px" }}
                                />
                            )}
                            <div className="company-info">
                                <h4 className="text-dark mb-1 fw-bold">INVOICE</h4>
                                {companyInfo.address && (
                                    <p className="mb-1 text-muted small">{companyInfo.address}</p>
                                )}
                                {companyInfo.phone && (
                                    <p className="mb-1 text-muted small">Phone: {companyInfo.phone}</p>
                                )}
                                {companyInfo.email && (
                                    <p className="mb-0 text-muted small">Email: {companyInfo.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="col-6 text-end">
                            <div className="invoice-meta">
                                <h5 className="text-dark mb-3 fw-bold">Invoice Details</h5>
                                <p className="mb-1">
                                    <strong>Invoice No:</strong> #{order.order_number}
                                </p>
                                <p className="mb-1">
                                    <strong>Date:</strong> {formatDate(order.created_at)}
                                </p>
                                <p className="mb-0">
                                    <strong>Payment Method:</strong> {order.payment_method}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Billing & Shipping Information */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="billing-info">
                                <h6 className="fw-bold border-bottom pb-2 mb-3">Bill To:</h6>
                                <p className="mb-1 fw-semibold">{order.name}</p>
                                <p className="mb-1 text-muted">{order.address}</p>
                                <p className="mb-1 text-muted">{order.district}</p>
                                <p className="mb-0 text-muted">Phone: {order.phone}</p>
                                {order.delivery_notes && (
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            <strong>Notes:</strong> {order.delivery_notes}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="table-container">
                                <table className="table table-bordered invoice-table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th width="5%">#</th>
                                            <th width="42%">Product Description</th>
                                            <th width="20%">Variant</th>
                                            <th width="10%" className="text-center">Qty</th>
                                            <th width="15%" className="text-end">Unit Price</th>
                                            <th width="15%" className="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.order_items?.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {/* ── CHANGED: square image + gap-3 + 10-word title truncation ── */}
                                                    <div className="d-flex align-items-center gap-3">
                                                        {item.colorImage && (
                                                            <Zoom>
                                                                <img
                                                                    src={item.colorImage}
                                                                    alt="Color"
                                                                    style={{
                                                                        width: "80px",
                                                                        height: "80px",
                                                                        objectFit: "cover",
                                                                        flexShrink: 0,
                                                                        borderRadius: "6px",
                                                                        border: "1px solid #dee2e6",
                                                                        display: "block",
                                                                    }}
                                                                />
                                                            </Zoom>
                                                        )}
                                                        <span className="fw-medium" style={{ wordBreak: "break-word" }}>
                                                            {item.title?.split(" ").slice(0, 5).join(" ")}
                                                            {item.title?.split(" ").length > 5 ? "…" : ""}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.selected_variant && (
                                                        <div className="small">
                                                            {item.selected_variant.attribute}: {item.selected_variant.value}
                                                        </div>
                                                    )}
                                                    {item.size && (
                                                        <div className="small">
                                                            Size: {item.size.size}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center">{item.qty}</td>
                                                <td className="text-end">{item.unitPrice} TK</td>
                                                <td className="text-end fw-semibold">{item.totalPrice} TK</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="row">
                        <div className="col-md-6 offset-md-6">
                            <div className="order-summary">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="fw-semibold">Subtotal:</td>
                                            <td className="text-end">{order.subtotal || order.total - order.shipping_cost} TK</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-semibold">Shipping Cost:</td>
                                            <td className="text-end">{order.shipping_cost} TK</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-semibold">Advance Payment:</td>
                                            <td className="text-end">{order?.advance_payment??0} TK</td>
                                        </tr>
                                        <tr className="table-active">
                                            <td className="fw-bold">Total Due:</td>
                                            <td className="text-end fw-bold">{order.total - order?.advance_payment??0} TK</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="row mt-5 pt-3 border-top">
                        <div className="col-12 text-center">
                            <p className="text-muted mb-2 small">
                                Thank you for your business! For any questions, please contact us at {siteConfig.phone}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Print Styles */}
            <style jsx global>{`
                @media print {
    /* Hide buttons */
    .no-print {
        display: none !important;
    }

    /* Page setup */
    @page {
        size: A4;
        margin: 0.5cm;
    }

    html, body {
        background: white !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 10pt;
    }

    .container {
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
    }

    /* 🔥 KEY PART: HALF PAGE INVOICE */
    .invoice-card {
        height: 50vh;                 /* Half of page */
        page-break-inside: avoid;
        border: none !important;
        box-shadow: none !important;
        margin-bottom: 0 !important;

        transform: scale(0.85);       /* Reduce size */
        transform-origin: top center;
    }

    .card-body {
        padding: 10px !important;
    }

    /* Tables */
    .invoice-table {
        font-size: 9pt;
    }

    .invoice-table th,
    .invoice-table td {
        padding: 4px !important;
    }

    .table-dark {
        background: #f1f1f1 !important;
        color: #000 !important;
    }

    /* Text adjustments */
    h4, h5, h6 {
        margin-bottom: 4px !important;
    }

    p {
        margin-bottom: 2px !important;
    }

    /* Logo smaller */
    .company-logo {
        max-height: 45px !important;
    }

    /* Avoid breaking tables */
    table,
    tr,
    td,
    th {
        page-break-inside: avoid !important;
    }
}

            `}</style>
        </div>
        
    );
}