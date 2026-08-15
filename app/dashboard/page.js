"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowDownRight, FiArrowRight, FiArrowUpRight, FiRefreshCw, FiShoppingBag, FiUsers } from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { PiPackage } from "react-icons/pi";
import styles from "./dashboard.module.css";
import { siteConfig } from "@/config/siteConfig";

const money = (value) =>
  new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(value || 0));
const STATUS_LABELS = {
  completed: "Delivery Completed",
  shipped_to_you: "Shipped to Courier",
  paid_returned: "Paid Returned",
};
const statusLabel = (value) =>
  STATUS_LABELS[value] || String(value || "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function Change({ value }) {
  if (value === null || value === undefined) return <span className={styles.newActivity}>New activity</span>;
  const up = value >= 0;
  return <span className={up ? styles.positive : styles.negative}>
    {up ? <FiArrowUpRight /> : <FiArrowDownRight />}{Math.abs(value)}% <small>vs previous period</small>
  </span>;
}

function SalesChart({ data }) {
  if (!data?.length) return <div className={styles.emptyChart}>Sales activity will appear here.</div>;
  const width = 820, height = 250, left = 20, top = 18, bottom = 36;
  const max = Math.max(...data.map((row) => Number(row.sales)), 1);
  const points = data.map((row, index) => {
    const x = left + (index / Math.max(data.length - 1, 1)) * (width - left * 2);
    const y = top + (1 - Number(row.sales) / max) * (height - top - bottom);
    return { ...row, x, y };
  });
  const line = points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${points.at(-1).x} ${height - bottom} L ${points[0].x} ${height - bottom} Z`;
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));
  return <div className={styles.chartWrap}>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sales trend">
      <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9b2b9c" stopOpacity=".28" /><stop offset="1" stopColor="#9b2b9c" stopOpacity="0" /></linearGradient></defs>
      {[0, 1, 2, 3].map((lineIndex) => <line key={lineIndex} x1={left} x2={width - left} y1={top + lineIndex * 56} y2={top + lineIndex * 56} stroke="#eee8ef" strokeWidth="1" />)}
      <path d={area} fill="url(#salesFill)" /><path d={line} fill="none" stroke="#78167e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => <g key={point.date}>
        <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#78167e" strokeWidth="3"><title>{point.date}: ৳{money(point.sales)}</title></circle>
        {(index % labelEvery === 0 || index === points.length - 1) && <text x={point.x} y={height - 10} textAnchor="middle" fontSize="11" fill="#8a7d8d">{new Date(`${point.date}T00:00:00`).toLocaleDateString("en-BD", { month: "short", day: "numeric" })}</text>}
      </g>)}
    </svg>
  </div>;
}

function StatusDonut({ rows }) {
  const total = rows.reduce((sum, row) => sum + row.orders, 0);
  const colors = ["#741478", "#b743a6", "#e399c9", "#53245b", "#d7bfd9", "#8c6c91"];
  let cursor = 0;
  const stops = rows.map((row, index) => {
    const start = cursor;
    cursor += total ? (row.orders / total) * 100 : 0;
    return `${colors[index % colors.length]} ${start}% ${cursor}%`;
  }).join(",");
  return <div className={styles.donutLayout}>
    <div className={styles.donut} style={{ background: total ? `conic-gradient(${stops})` : "#eee9ef" }}><div><strong>{total}</strong><span>orders</span></div></div>
    <div className={styles.legend}>{rows.slice(0, 6).map((row, index) => <div key={row.status}><i style={{ background: colors[index % colors.length] }} /><span>{statusLabel(row.status)}</span><strong>{row.percentage}%</strong></div>)}</div>
  </div>;
}

export default function DashboardHome() {
  const [range, setRange] = useState("month");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useMemo(() => {
    const params = new URLSearchParams({ range, hot_limit: "7" });
    if (status) params.set("status", status);
    if (range === "custom" && startDate && endDate) {
      params.set("start_date", startDate); params.set("end_date", endDate);
    }
    return params.toString();
  }, [range, status, startDate, endDate]);
  const load = async () => {
    if (range === "custom" && (!startDate || !endDate)) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/dashboard/summary?${query}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("The dashboard data could not be loaded.");
      setData(await response.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [query]);
  const totals = data?.totals || {};
  const changes = data?.changes || {};
  const cards = [
    { title: "Gross sales", value: `৳${money(totals.gross_sales)}`, change: changes.gross_sales, icon: <HiOutlineBanknotes /> },
    { title: "Orders", value: money(totals.orders), change: changes.orders, icon: <FiShoppingBag /> },
    { title: "Units sold", value: money(totals.units_sold), change: changes.units_sold, icon: <PiPackage /> },
    { title: "Customers", value: money(totals.customers), change: changes.customers, icon: <FiUsers /> },
  ];

  return <div className={styles.page}>
    <header className={styles.header}>
      <div><span>Business overview</span><h1>Good to see you.</h1><p>Here is what is happening across {siteConfig.company_name}.</p></div>
      <div className={styles.headerActions}><Link href="/dashboard/sales-report">Open sales report <FiArrowRight /></Link><button onClick={load} aria-label="Refresh dashboard"><FiRefreshCw className={loading ? styles.spin : ""} /></button></div>
    </header>
    <section className={styles.filterBar}>
      <div className={styles.rangeTabs}>{["today", "week", "month", "year", "custom"].map((item) => <button className={range === item ? styles.active : ""} key={item} onClick={() => setRange(item)}>{item === "week" ? "This week" : item === "month" ? "This month" : item === "year" ? "This year" : statusLabel(item)}</button>)}</div>
      {range === "custom" && <div className={styles.dates}><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /><span>to</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>}
      <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All order statuses</option>{["pending", "placed", "processing", "completed", "cancelled", "returned", "paid_returned", "order_confirmed"].map((item) => <option value={item} key={item}>{statusLabel(item)}</option>)}</select>
    </section>
    {error && <div className={styles.error}>{error}</div>}
    <main className={loading ? styles.loading : ""}>
      <section className={styles.cards}>{cards.map((card) => <article key={card.title} className={styles.card}>
        <div className={styles.cardTop}><span>{card.title}</span><i>{card.icon}</i></div><strong>{card.value}</strong><Change value={card.change} />
      </article>)}</section>
      <section className={styles.grid}>
        <article className={`${styles.panel} ${styles.salesPanel}`}>
          <div className={styles.panelHead}><div><span>Revenue movement</span><h2>Sales trend</h2></div><div className={styles.aov}>Average order <strong>৳{money(totals.average_order_value)}</strong></div></div>
          <SalesChart data={data?.sales_trend || []} />
        </article>
        <article className={styles.panel}><div className={styles.panelHead}><div><span>Order pipeline</span><h2>Status distribution</h2></div></div><StatusDonut rows={data?.status_breakdown || []} /></article>
        <article className={`${styles.panel} ${styles.productsPanel}`}>
          <div className={styles.panelHead}><div><span>Product momentum</span><h2>Top-selling products</h2></div><Link href="/dashboard/sales-report">View full report <FiArrowRight /></Link></div>
          <div className={styles.productList}>{(data?.top_products || []).map((product, index) => <div key={`${product.product_id}-${product.title}`}>
            <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span><p><strong>{product.title}</strong><small>{product.quantity_sold} units sold</small></p><b>৳{money(product.sales)}</b>
          </div>)}{!data?.top_products?.length && <div className={styles.empty}>No product sales in this period.</div>}</div>
        </article>
        <article className={`${styles.panel} ${styles.snapshot}`}>
          <div className={styles.panelHead}><div><span>At a glance</span><h2>Sales snapshot</h2></div></div>
          <div><span>Shipping collected</span><strong>৳{money(totals.shipping_collected)}</strong></div>
          <div><span>Average units per order</span><strong>{totals.orders ? (totals.units_sold / totals.orders).toFixed(1) : "0.0"}</strong></div>
          <div><span>Orders per customer</span><strong>{totals.customers ? (totals.orders / totals.customers).toFixed(1) : "0.0"}</strong></div>
          <Link href="/dashboard/orders">Manage orders <FiArrowRight /></Link>
        </article>
      </section>
    </main>
  </div>;
}
