// app/dashboard/orders/components/BulkInvoicePrint.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useFormatDate from "@/app/hooks/useFormatDate";

export default function BulkInvoicePrint({ orders, companyInfo, companyLogo }) {
  const { formatDate } = useFormatDate();
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = document.createElement("div");
    el.id = "bulk-invoice-portal";
    document.body.appendChild(el);
    containerRef.current = el;
    setMounted(true);
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
    };
  }, []);

  if (!mounted || !containerRef.current || !orders?.length) return null;

  // Group into pairs — each pair = one A4 page
  const pages = [];
  for (let i = 0; i < orders.length; i += 2) {
    pages.push(orders.slice(i, i + 2));
  }

  const SingleInvoice = ({ order }) => (
    <div style={{
      height: "100%",
      boxSizing: "border-box",
      padding: "10px 14px",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Header ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1.5px solid #dee2e6",
        paddingBottom: "6px",
        marginBottom: "6px",
      }}>
        <div>
          {companyLogo ? (
            <img
              src={companyLogo}
              alt="Logo"
              style={{ maxHeight: "40px", display: "block", marginBottom: "3px" }}
              onError={(e) => {
                e.currentTarget.src = "/img/eyara-fashion-logo.png";
              }}
            />
          ) : (
            <img
              src="/img/eyara-fashion-logo.png"
              alt="Logo"
              style={{ maxHeight: "40px", display: "block", marginBottom: "3px" }}
            />
          )}
          <h4 style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 700 }}>INVOICE</h4>
          {companyInfo.address && (
            <p style={{ margin: 0, fontSize: "9px", color: "#555" }}>{companyInfo.address}</p>
          )}
          {companyInfo.phone && (
            <p style={{ margin: 0, fontSize: "9px", color: "#555" }}>Phone: {companyInfo.phone}</p>
          )}
          {companyInfo.email && (
            <p style={{ margin: 0, fontSize: "9px", color: "#555" }}>Email: {companyInfo.email}</p>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <h5 style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 700 }}>Invoice Details</h5>
          <p style={{ margin: "0 0 2px", fontSize: "10px" }}>
            <strong>Invoice No:</strong> #{order.order_number}
          </p>
          <p style={{ margin: "0 0 2px", fontSize: "10px" }}>
            <strong>Date:</strong> {formatDate(order.created_at)}
          </p>
          <p style={{ margin: 0, fontSize: "10px" }}>
            <strong>Payment:</strong> {order.payment_method}
          </p>
        </div>
      </div>

      {/* ── Bill To ── */}
      <div style={{ marginBottom: "6px" }}>
        <h6 style={{
          margin: "0 0 2px",
          fontSize: "10px",
          fontWeight: 700,
          borderBottom: "1px solid #eee",
          paddingBottom: "2px",
        }}>
          Bill To:
        </h6>
        <p style={{ margin: "0 0 1px", fontSize: "10px", fontWeight: 600 }}>{order.name}</p>
        <p style={{ margin: "0 0 1px", fontSize: "9px", color: "#555" }}>
          {order.address}{order.district ? `, ${order.district}` : ""}
        </p>
        <p style={{ margin: 0, fontSize: "9px", color: "#555" }}>Phone: {order.phone}</p>
        {order.delivery_notes && (
          <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#555" }}>
            <strong>Notes:</strong> {order.delivery_notes}
          </p>
        )}
      </div>

      {/* ── Items Table ── */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "9px",
        marginBottom: "6px",
      }}>
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            {["#", "Product", "Variant", "Qty", "Unit Price", "Total"].map((h) => (
              <th key={h} style={{
                border: "1px solid #dee2e6",
                padding: "3px 4px",
                textAlign: h === "Qty" ? "center" : h === "Unit Price" || h === "Total" ? "right" : "left",
                fontWeight: 700,
                color: "#000",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {order.order_items?.map((item, i) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>{i + 1}</td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {item.colorImage && (
                    <img
                      src={item.colorImage}
                      alt=""
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "cover",
                        borderRadius: "3px",
                        border: "1px solid #dee2e6",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span>
                    {item.title?.split(" ").slice(0, 5).join(" ")}
                    {item.title?.split(" ").length > 5 ? "…" : ""}
                  </span>
                </div>
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px", color: "#444", fontSize: "8px" }}>
                {item.selected_variant
                  ? `${item.selected_variant.attribute}: ${item.selected_variant.value}`
                  : ""}
                {item.size
                  ? (item.selected_variant ? ` / Size: ${item.size.size}` : `Size: ${item.size.size}`)
                  : ""}
                {item.color_name ? ` / ${item.color_name}` : ""}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px", textAlign: "center" }}>
                {item.qty}
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px", textAlign: "right" }}>
                {item.unitPrice} TK
              </td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 4px", textAlign: "right", fontWeight: 600 }}>
                {item.totalPrice} TK
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Summary + Footer ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "auto" }}>
        <p style={{ margin: 0, fontSize: "8px", color: "#999", maxWidth: "55%" }}>
          Thank you for your business! Contact: {companyInfo?.phone ?? ""}
        </p>
        <table style={{ width: "210px", borderCollapse: "collapse", fontSize: "9px" }}>
          <tbody>
            {[
              ["Subtotal", `${order.subtotal ?? (order.total - order.shipping_cost)} TK`],
              ...(Number(order.discount_amount) > 0
                ? [[`Coupon${order.coupon_code ? ` (${order.coupon_code})` : ""}`, `-${order.discount_amount} TK`]]
                : []),
              ["Shipping Cost", `${order.shipping_cost} TK`],
              ["Advance Payment", `${order.advance_payment ?? 0} TK`],
            ].map(([label, val]) => (
              <tr key={label}>
                <td style={{ border: "1px solid #dee2e6", padding: "2px 5px", color: "#555" }}>{label}</td>
                <td style={{ border: "1px solid #dee2e6", padding: "2px 5px", textAlign: "right" }}>{val}</td>
              </tr>
            ))}
            <tr style={{ background: "#f1f1f1" }}>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 5px", fontWeight: 700 }}>Total Due</td>
              <td style={{ border: "1px solid #dee2e6", padding: "2px 5px", textAlign: "right", fontWeight: 700 }}>
                {order.total - (order.advance_payment ?? 0)} TK
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const content = (
    <>
      <style>{`
        #bulk-invoice-portal {
          display: none;
        }

        @media print {
          /* Hide the entire app */
          body > *:not(#bulk-invoice-portal) {
            display: none !important;
          }

          /* ✅ KEY FIX: absolute + auto height so ALL pages render, not just the viewport */
          #bulk-invoice-portal {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            z-index: 99999 !important;
          }

          @page {
            size: A4 portrait;
            margin: 0.4cm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            height: auto !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Each pair of invoices = exactly one A4 page */
          .invoice-a4-page {
            width: 100%;
            /* 
              Use 297mm minus margins (0.4cm top + 0.4cm bottom = 0.8cm = ~8mm)
              → 297 - 8 = 289mm for the printable height
            */
            height: 289mm;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            box-sizing: border-box !important;
            background: white !important;
            overflow: hidden !important;
          }

          .invoice-a4-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }

          /* Each invoice slot = exactly half the page */
          .invoice-slot {
            height: 50% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
          }

          img {
            max-width: 100% !important;
          }

          table, tr, td, th {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {pages.map((pair, pageIndex) => (
        <div key={pageIndex} className="invoice-a4-page">
          {pair.map((order, slotIndex) => (
            <div
              key={order.id}
              className="invoice-slot"
              style={{
                borderBottom: slotIndex === 0 ? "1.5px dashed #aaa" : "none",
              }}
            >
              <SingleInvoice order={order} />
            </div>
          ))}

          {/* Blank bottom slot if odd order is alone on last page */}
          {pair.length === 1 && (
            <div className="invoice-slot" style={{ borderTop: "1.5px dashed #aaa" }} />
          )}
        </div>
      ))}
    </>
  );

  return createPortal(content, containerRef.current);
}