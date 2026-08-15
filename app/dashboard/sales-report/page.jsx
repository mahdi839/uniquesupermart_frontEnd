"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiDownload, FiRefreshCw, FiSearch, FiShoppingBag, FiUsers } from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { PiPackage } from "react-icons/pi";
import styles from "./salesReport.module.css";
import { siteConfig } from "@/config/siteConfig";

const money = (value) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 2 }).format(Number(value || 0));

const STATUS_LABELS = {
  completed: "Delivery Completed",
  shipped_to_you: "Shipped to Courier",
  paid_returned: "Paid Returned",
};
const readableStatus = (value) =>
  STATUS_LABELS[value] || String(value || "unknown").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function pdfSafe(value) {
  return String(value ?? "").normalize("NFKD").replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function downloadReportPdf(data) {
  const rows = data.products || [];
  const pages = [];
  const perPage = 27;
  for (let start = 0; start < Math.max(rows.length, 1); start += perPage) {
    const pageRows = rows.slice(start, start + perPage);
    pages.push([
      `${siteConfig.company_name.toUpperCase()} - SALES REPORT`,
      `Period: ${data.range.from} to ${data.range.to}`,
      `Sales: BDT ${money(data.summary.gross_sales)}   Orders: ${data.summary.orders}   Units: ${data.summary.units_sold}   Customers: ${data.summary.customers}`,
      "",
      "Product                                      Orders   Units        Sales (BDT)",
      "----------------------------------------------------------------------------",
      ...pageRows.map((row) => {
        const title = `${row.title}${row.sku ? ` [${row.sku}]` : ""}`.slice(0, 43).padEnd(43);
        return `${title} ${String(row.order_count).padStart(7)} ${String(row.quantity_sold).padStart(7)} ${money(row.gross_sales).padStart(18)}`;
      }),
    ]);
  }
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  const pageIds = [];
  pages.forEach((lines, index) => {
    const text = ["BT", "/F1 10 Tf", "45 795 Td",
      ...lines.flatMap((line, i) => [i ? "0 -25 Td" : "", `(${pdfSafe(line)}) Tj`]).filter(Boolean),
      "0 -20 Td", "/F1 8 Tf", `(Page ${index + 1} of ${pages.length}) Tj`, "ET"].join("\n");
    const contentId = objects.length + 1;
    objects.push(`<< /Length ${text.length} >>\nstream\n${text}\nendstream`);
    const pageId = objects.length + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = output.length;
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { output += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([output], { type: "application/pdf" }));
  link.download = `sales-report-${data.range.from}-to-${data.range.to}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function ProductBars({ products }) {
  const top = products.filter((item) => item.quantity_sold > 0).slice(0, 7);
  const max = Math.max(...top.map((item) => item.quantity_sold), 1);
  return <div className={styles.bars}>
    {top.length === 0 && <div className={styles.empty}>No product sales in this period.</div>}
    {top.map((item) => <div className={styles.barRow} key={`${item.product_id}-${item.title}`}>
      <div className={styles.barLabel}><span>{item.title}</span><strong>{item.quantity_sold}</strong></div>
      <div className={styles.barTrack}><span style={{ width: `${(item.quantity_sold / max) * 100}%` }} /></div>
    </div>)}
  </div>;
}

export default function SalesReportPage() {
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = `${today.slice(0, 8)}01`;
  const [filters, setFilters] = useState({ start_date: monthStart, end_date: today, status: "", search: "" });
  const [applied, setApplied] = useState(filters);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(applied).forEach(([key, value]) => value && params.set(key, value));
    params.set("sort", "revenue");
    return params.toString();
  }, [applied]);
  const load = async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/sales-report?${query}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Could not load the sales report.");
      setData(await response.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [query]);
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const summary = data?.summary || {};

  return <div className={styles.page}>
    <div className={styles.hero}>
      <div><span className={styles.eyebrow}>Commerce intelligence</span><h1>Sales report</h1>
        <p>See exactly what customers order, how often they order it, and where sales are coming from.</p></div>
      <button className={styles.pdfButton} disabled={!data || loading} onClick={() => downloadReportPdf(data)}><FiDownload /> Download PDF</button>
    </div>
    <form className={styles.filters} onSubmit={(event) => { event.preventDefault(); setApplied(filters); }}>
      <label><span>From</span><div><FiCalendar /><input type="date" value={filters.start_date} onChange={(e) => setFilter("start_date", e.target.value)} /></div></label>
      <label><span>To</span><div><FiCalendar /><input type="date" value={filters.end_date} onChange={(e) => setFilter("end_date", e.target.value)} /></div></label>
      <label><span>Order status</span><select value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
        <option value="">All statuses</option>
        {["pending", "placed", "processing", "completed", "cancelled", "returned", "paid_returned", "order_confirmed"].map((status) => <option key={status} value={status}>{readableStatus(status)}</option>)}
      </select></label>
      <label className={styles.search}><span>Find product</span><div><FiSearch /><input value={filters.search} placeholder="Name or SKU" onChange={(e) => setFilter("search", e.target.value)} /></div></label>
      <button className={styles.apply} type="submit">Apply report</button>
      <button className={styles.refresh} type="button" onClick={load} aria-label="Refresh"><FiRefreshCw /></button>
    </form>
    {error && <div className={styles.error}>{error}</div>}
    <div className={`${styles.content} ${loading ? styles.loading : ""}`}>
      <div className={styles.metrics}>
        {[
          ["Gross sales", `৳${money(summary.gross_sales)}`, <HiOutlineBanknotes key="sales" />],
          ["Orders", summary.orders || 0, <FiShoppingBag key="orders" />],
          ["Units sold", summary.units_sold || 0, <PiPackage key="units" />],
          ["Customers", summary.customers || 0, <FiUsers key="customers" />],
        ].map(([label, value, icon]) => <div className={styles.metric} key={label}><span className={styles.metricIcon}>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>)}
      </div>
      <div className={styles.insights}>
        <section className={styles.panel}><div className={styles.panelHead}><div><span>Product performance</span><h2>Best-selling products</h2></div><small>Units sold</small></div><ProductBars products={data?.products || []} /></section>
        <section className={styles.panel}><div className={styles.panelHead}><div><span>Order health</span><h2>Status mix</h2></div></div>
          <div className={styles.statusList}>{(data?.status_breakdown || []).map((item) => <div key={item.status}><span className={styles.statusDot} /><p>{readableStatus(item.status)}<small>৳{money(item.sales)}</small></p><strong>{item.orders}</strong></div>)}
            {!data?.status_breakdown?.length && <div className={styles.empty}>No orders in this period.</div>}</div></section>
      </div>
      <section className={styles.tablePanel}>
        <div className={styles.tableHeading}><div><span>Complete catalog</span><h2>Product sales details</h2></div>
          <div className={styles.miniStats}><span>Avg. order <strong>৳{money(summary.average_order_value)}</strong></span><span>Shipping <strong>৳{money(summary.shipping_collected)}</strong></span></div></div>
        <div className={styles.tableWrap}><table><thead><tr><th>Product</th><th>Status</th><th>Times ordered</th><th>Units sold</th><th>Customers</th><th>Avg. unit price</th><th>Gross sales</th><th>Last ordered</th></tr></thead>
          <tbody>{(data?.products || []).map((product) => <tr key={`${product.product_id}-${product.title}`}>
            <td><strong>{product.title}</strong><small>{product.sku || "Historical product"}</small></td>
            <td><span className={`${styles.badge} ${product.product_status === "archived" ? styles.archived : ""}`}>{readableStatus(product.product_status)}</span></td>
            <td>{product.order_count}</td><td>{product.quantity_sold}</td><td>{product.customer_count}</td><td>৳{money(product.average_unit_price)}</td>
            <td><strong>৳{money(product.gross_sales)}</strong></td><td>{product.last_ordered_at ? new Date(product.last_ordered_at).toLocaleDateString("en-BD") : "Never"}</td>
          </tr>)}</tbody></table></div>
      </section>
    </div>
  </div>;
}
