// app/components/navbar/client/DesktopSearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaPhone } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchCategories } from "@/redux/slices/categorySlice";
import DesktopCategories from "../components/navCatComponents/DesktopCategories";
import { siteConfig } from "@/config/siteConfig";

const MIN_QUERY_LEN = 3;

export default function DesktopSearchBar({ footerData }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.list);
  const status = useSelector((state) => state.categories.status);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const containerRef = useRef(null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch categories if not already loaded
  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
  }, [dispatch, status]);

  // Debounced search
  useEffect(() => {
    if (query.length < MIN_QUERY_LEN) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${baseUrl}api/product-search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.data ?? []);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, baseUrl]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="row d-none d-xl-flex position-relative align-items-center" ref={containerRef}>
      {/* Category trigger — hover reveals dropdown absolutely, takes NO layout space */}
      <div className="col-lg-3 mb-lg-4" style={{ position: "relative" }}>
        <div
          className="hero__categories"
          onMouseEnter={() => setCatOpen(true)}
          onMouseLeave={() => setCatOpen(false)}
          style={{ position: "relative" }}
        >
          {/* Trigger bar — always visible */}
          <div
            className="hero__categories__all"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <FaBars className="fa fa-bars hero_category_icon" />
            <span>All Categories</span>
          </div>

          {/* Dropdown — floats above content, no layout impact */}
          {catOpen && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                minWidth: "220px",
                zIndex: 2000,
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.13)",
                borderRadius: "0 0 8px 8px",
                padding: "8px 0",
                margin: 0,
                listStyle: "none",
              }}
            >
              {status === "loading"
                ? <li className="p-2 text-muted">Loading…</li>
                : <DesktopCategories categories={categories} />
              }
            </ul>
          )}
        </div>
      </div>

      {/* Search input */}
      <div className="col-lg-9">
        <div className="hero__search">
          <div className="hero__search__form">
            <div className="d-flex">
              <input
                type="search"
                className="form-control"
                placeholder="What do you need?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                autoComplete="off"
                style={{ height:'3rem' }}
              />
              <button
                type="button"
                className="site-btn"
                onClick={() => query.length >= MIN_QUERY_LEN && setIsOpen(true)}
              >
                SEARCH
              </button>
            </div>
          </div>

          <div className="hero__search__phone">
            <div className="hero__search__phone__icon">
              <FaPhone />
            </div>
            <div className="hero__search__phone__text">
              <h5>{siteConfig.phone??""}</h5>
              <span>support 24/7 time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search results dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          className="list-group position-absolute shadow"
          style={{
            top: "100%",
            left: "25%",
            right: 0,
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
          }}
          role="listbox"
        >
          {results.map((product) => (
            <li key={product.id} className="list-group-item p-0">
              <Link
                href={`/frontEnd/product-page/${product.id}`}
                className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark"
                onClick={() => setIsOpen(false)}
              >
                <div className="position-relative me-3" style={{ width: 50, height: 50, flexShrink: 0 }}>
                  <Image
                    src={baseUrl + product.images?.[0]?.image}
                    alt={product.title}
                    fill
                    className="object-fit-cover rounded"
                    loading="lazy"
                  />
                </div>
                <div>
                  <strong>{product.title}</strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length >= MIN_QUERY_LEN && results.length === 0 && (
        <div
          className="position-absolute shadow card border-0"
          style={{ top: "100%", left: "25%", right: 0, zIndex: 1000 }}
        >
          <div className="card-body text-center py-4 text-muted">
            No products found for &ldquo;{query}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}