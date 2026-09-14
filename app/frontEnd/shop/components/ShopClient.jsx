"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard";
import FilterPanel from "./FilterPanel";

function ShopClient({ filterOptions: initialFilterOptions, initialProducts, initialPagination }) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [filterOptions] = useState(initialFilterOptions);

  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    min_price: initialFilterOptions.price_range.min,
    max_price: initialFilterOptions.price_range.max,
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [priceInput, setPriceInput] = useState({
    min: initialFilterOptions.price_range.min,
    max: initialFilterOptions.price_range.max,
  });

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isFirstRender = useRef(true);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  /* ── Debounce: search ── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput.length >= 3 || searchInput.length === 0) {
        setFilters((prev) => ({ ...prev, search: searchInput }));
      }
    }, 800);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* ── Price: debounce to filters ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        min_price: priceInput.min,
        max_price: priceInput.max,
      }));
    }, 100);
    return () => clearTimeout(t);
  }, [priceInput]);

  /* ── Fetch products (filter changes / load more only) ── */
  const fetchProducts = useCallback(
    async (page = 1, append = false) => {
      page === 1 ? setLoading(true) : setLoadingMore(true);
      try {
        const p = new URLSearchParams({ page });
        filters.categories.forEach((c) => p.append("categories[]", c));
        filters.sizes.forEach((s) => p.append("sizes[]", s));
        if (filters.min_price) p.append("min_price", filters.min_price);
        if (filters.max_price) p.append("max_price", filters.max_price);
        if (filters.search) p.append("search", filters.search);

        const res = await fetch(`${baseUrl}api/shop/products?${p}`);
        const data = await res.json();
        if (data.message === "success") {
          // Page 2+ of Laravel paginate() can JSON-encode as an object
          // ({"12": product}) instead of an array. Spreading that object
          // throws and Next.js production shows a blank "Application error".
          const incoming = Array.isArray(data.data)
            ? data.data
            : data.data && typeof data.data === "object"
              ? Object.values(data.data)
              : [];
          setProducts((prev) => (append ? [...(prev || []), ...incoming] : incoming));
          if (data.pagination) setPagination(data.pagination);
        }
      } catch (e) {
        toast.error("Error loading products");
      } finally {
        page === 1 ? setLoading(false) : setLoadingMore(false);
      }
    },
    [filters, baseUrl]
  );

  /* ── Skip fetch on mount — SSR data already loaded ── */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchProducts(1, false);
  }, [filters]); // eslint-disable-line

  /* ── Filter helpers ── */
  const toggleCategory = (id) =>
    setFilters((p) => ({
      ...p,
      categories: p.categories.includes(id)
        ? p.categories.filter((x) => x !== id)
        : [...p.categories, id],
    }));

  const toggleSize = (id) =>
    setFilters((p) => ({
      ...p,
      sizes: p.sizes.includes(id)
        ? p.sizes.filter((x) => x !== id)
        : [...p.sizes, id],
    }));

  const clearFilters = () => {
    const { min, max } = filterOptions.price_range;
    setSearchInput("");
    setPriceInput({ min, max });
    setFilters({
      categories: [],
      sizes: [],
      min_price: min,
      max_price: max,
      search: "",
    });
  };

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    (filters.search ? 1 : 0) +
    (String(priceInput.min) !== String(filterOptions.price_range.min) ||
    String(priceInput.max) !== String(filterOptions.price_range.max)
      ? 1
      : 0);

  /* ── Cart / modal ── */
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setSelectedSizes("");
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSizes("");
  };
  const handleCloseDrawer = () => setIsCartDrawerOpen(false);

  const handleAddToCart = (product, type, preQty) => {
    const target = selectedProduct || product;
    if (cartItems.find((i) => i.id === target.id)) {
      Swal.fire({
        title: "Already in cart",
        icon: "info",
        confirmButtonColor: "#111",
      });
      return;
    }
    if (target.sizes.length > 1 && !selectedSizes) {
      Swal.fire({
        title: "Please select a size",
        icon: "warning",
        confirmButtonColor: "#111",
      });
      return;
    }
    const variant =
      target.sizes.find((v) => v.id == selectedSizes) || target.sizes[0];
    dispatch(
      addToCart({
        id: target.id,
        title: target.title,
        size: selectedSizes ? variant.id : "",
        price: variant?.pivot.price ?? target.price,
        image: baseUrl + (target.images?.[0]?.image || ""),
        colorImage: baseUrl + (selectedColor || ""),
        preQty: preQty ?? 1,
      })
    );
    setSelectedSizes("");
    if (type === "buy") {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true);
    }
    handleCloseModal();
    toast.success("Added to cart!");
  };

  const filterPanelProps = {
    activeCount,
    clearFilters,
    searchInput,
    setSearchInput,
    filters,
    filterOptions,
    toggleCategory,
    toggleSize,
    priceInput,
    setPriceInput,
  };

  return (
    <>
      <style>{`
        .spf-sidebar-card {
          background:#fff;
          border:1px solid #e8e8e8;
          border-radius:8px;
          position:sticky;
          top:80px;
          max-height:calc(100vh - 100px);
          overflow-y:auto;
          scrollbar-width:thin;
          scrollbar-color:#e0e0e0 transparent;
        }
        .spf-sidebar-card::-webkit-scrollbar { width:3px; }
        .spf-sidebar-card::-webkit-scrollbar-thumb { background:#e0e0e0; border-radius:4px; }

        .mobile-topbar {
          display:none;
          align-items:center;
          justify-content:space-between;
          margin-bottom:16px;
        }
        .mobile-filter-btn {
          display:flex; align-items:center; gap:7px;
          padding:8px 16px; border:1.5px solid #111; border-radius:3px;
          background:#fff; font-size:11px; font-weight:800;
          letter-spacing:.09em; text-transform:uppercase; cursor:pointer;
          transition:all .15s; color:#111;
        }
        .mobile-filter-btn.has-filters,
        .mobile-filter-btn:hover { background:#111; color:#fff; }

        .spf-overlay {
          display:none; position:fixed; inset:0;
          background:rgba(0,0,0,.45); z-index:1200; backdrop-filter:blur(2px);
        }
        .spf-overlay.open { display:flex; }
        .spf-drawer {
          width:300px; max-width:88vw; background:#fff;
          height:100%; display:flex; flex-direction:column;
          animation:drawerIn .22s ease; overflow:hidden;
        }
        .spf-drawer-scroll { flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#e0e0e0 transparent; }
        .spf-drawer-footer {
          padding:14px 20px 24px; border-top:1px solid #e8e8e8;
          background:#fff; flex-shrink:0;
        }
        .spf-apply-btn {
          width:100%; padding:13px; background:#111; color:#fff;
          border:none; border-radius:3px; font-size:11px; font-weight:800;
          letter-spacing:.1em; text-transform:uppercase; cursor:pointer;
          transition:background .15s;
        }
        .spf-apply-btn:hover { background:#333; }
        @keyframes drawerIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }

        .spf-panel { padding:20px 18px 0; }
        .spf-panel-header {
          display:flex; align-items:center; justify-content:space-between;
          padding-bottom:14px; border-bottom:1px solid #e8e8e8;
        }
        .spf-panel-title { font-size:10px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#111; }
        .spf-clear-all {
          font-size:11px; color:#999; background:none; border:none;
          cursor:pointer; font-weight:600; padding:0;
          text-decoration:underline; text-underline-offset:2px; transition:color .12s;
        }
        .spf-clear-all:hover { color:#111; }

        .spf-accordion { border-bottom:1px solid #e8e8e8; }
        .spf-accordion-trigger {
          width:100%; display:flex; justify-content:space-between; align-items:center;
          background:none; border:none; padding:13px 0; cursor:pointer;
        }
        .spf-accordion-title {
          font-size:10px; font-weight:800; letter-spacing:.12em;
          text-transform:uppercase; color:#111;
          display:flex; align-items:center; gap:8px;
        }
        .spf-acc-badge {
          background:#111; color:#fff; border-radius:10px;
          padding:1px 7px; font-size:9px; font-weight:800; letter-spacing:.04em;
        }
        .spf-chevron { transition:transform .2s ease; color:#bbb; flex-shrink:0; }
        .spf-chevron.open { transform:rotate(180deg); }
        .spf-accordion-body { max-height:0; overflow:hidden; transition:max-height .28s ease; }
        .spf-accordion-body.open { max-height:520px; }
        .spf-accordion-inner { padding-bottom:16px; }

        .spf-search-wrap {
          position:relative; display:flex; align-items:center;
          border:1.5px solid #e0e0e0; border-radius:4px; background:#fafafa;
          transition:border-color .15s;
        }
        .spf-search-wrap:focus-within { border-color:#111; background:#fff; }
        .spf-search-icon { position:absolute; left:11px; color:#c0c0c0; pointer-events:none; }
        .spf-search-input {
          flex:1; padding:9px 32px 9px 34px; border:none; background:transparent;
          font-size:13px; outline:none; color:#111; width:100%;
        }
        .spf-search-input::placeholder { color:#bbb; }
        .spf-search-clear {
          position:absolute; right:10px; background:none; border:none;
          cursor:pointer; color:#bbb; display:flex; padding:2px; transition:color .12s;
        }
        .spf-search-clear:hover { color:#111; }
        .spf-hint { font-size:11px; color:#bbb; margin:6px 0 0; }

        .spf-category-list { display:flex; flex-direction:column; }
        .spf-cat-item {
          display:flex; align-items:center; gap:10px; padding:8px 0;
          background:none; border:none; cursor:pointer; text-align:left;
          font-size:14px; font-weight:600; color:#555; width:100%;
          transition:color .12s; border-bottom:1px solid #f5f5f5;
        }
        .spf-cat-item:last-child { border-bottom:none; }
        .spf-cat-item:hover { color:#111; }
        .spf-cat-item.active { color:#111; font-weight:800; }
        .spf-cat-dot {
          width:7px; height:7px; border-radius:50%; border:1.5px solid #d0d0d0;
          flex-shrink:0; transition:all .12s;
        }
        .spf-cat-item.active .spf-cat-dot { background:#111; border-color:#111; }
        .spf-cat-name { flex:1; line-height:1.3; }
        .spf-show-more {
          padding:10px 0 2px; background:none; border:none; cursor:pointer;
          font-size:11px; color:#999; font-weight:700; text-align:left;
          text-decoration:underline; text-underline-offset:2px; transition:color .12s;
        }
        .spf-show-more:hover { color:#111; }

        .spf-size-grid { display:flex; flex-wrap:wrap; gap:6px; }
        .spf-size-chip {
          min-width:42px; padding:7px 10px;
          border:1.5px solid #e0e0e0; border-radius:3px;
          background:#fff; font-size:12px; font-weight:500; color:#555;
          cursor:pointer; transition:all .12s; text-align:center;
        }
        .spf-size-chip:hover { border-color:#888; color:#111; }
        .spf-size-chip.active { border-color:#111; background:#111; color:#fff; font-weight:700; }

        .spf-price-row { display:flex; align-items:flex-end; gap:10px; }
        .spf-price-field { flex:1; }
        .spf-price-label {
          font-size:9px; font-weight:800; letter-spacing:.1em;
          color:#bbb; text-transform:uppercase; display:block; margin-bottom:6px;
        }
        .spf-price-input-wrap {
          display:flex; align-items:center; gap:4px;
          border:1.5px solid #e0e0e0; border-radius:4px; padding:0 10px;
          background:#fafafa; transition:border-color .15s;
        }
        .spf-price-input-wrap:focus-within { border-color:#111; background:#fff; }
        .spf-currency { font-size:12px; color:#bbb; font-weight:700; flex-shrink:0; }
        .spf-price-input {
          width:100%; padding:8px 0; border:none; background:transparent;
          font-size:13px; outline:none; color:#111; -moz-appearance:textfield;
        }
        .spf-price-input::-webkit-outer-spin-button,
        .spf-price-input::-webkit-inner-spin-button { -webkit-appearance:none; }
        .spf-price-divider { font-size:16px; color:#ccc; margin-bottom:9px; flex-shrink:0; }

        .shop-active-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
        .spf-active-tag {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; background:#f2f2f2; border-radius:2px;
          font-size:11px; font-weight:600; color:#555;
          border:none; cursor:pointer; transition:all .12s;
        }
        .spf-active-tag:hover { background:#e5e5e5; color:#111; }

        .load-more-wrap { display:flex; justify-content:center; padding-top:40px; }
        .load-more-btn {
          padding:12px 48px; border:1.5px solid var(--primary-color); border-radius:3px;
          background:transparent; font-size:11px; font-weight:800;
          letter-spacing:.12em; text-transform:uppercase; cursor:pointer;
          color:#111; transition:all .15s;
          display:flex; align-items:center; gap:10px;
        }
        .load-more-btn:hover:not(:disabled) { background:var(--primary-color); color:#fff; }
        .load-more-btn:disabled { opacity:.45; cursor:not-allowed; }
        .spf-spinner {
          width:12px; height:12px; border:2px solid #ccc; border-top-color:#111;
          border-radius:50%; animation:spin .7s linear infinite;
        }
        .load-more-btn:hover .spf-spinner { border-color:rgba(255,255,255,.3); border-top-color:#fff; }

        /* Loading overlay for filter changes */
        .products-loading-overlay {
          opacity: 0.45;
          pointer-events: none;
          transition: opacity 0.2s;
        }

        .shop-empty { text-align:center; padding:80px 20px; }
        .shop-empty h5 { font-size:18px; font-weight:700; color:#333; margin:16px 0 8px; }
        .shop-empty p { color:#aaa; margin:0 0 24px; font-size:14px; }
        .shop-empty-btn {
          padding:10px 28px; background:#111; color:#fff; border:none;
          border-radius:3px; font-size:11px; font-weight:800; letter-spacing:.1em;
          text-transform:uppercase; cursor:pointer;
        }

        @media (max-width:991px) {
          .spf-desktop-sidebar { display:none !important; }
          .mobile-topbar { display:flex !important; }
        }
        @media (min-width:992px) {
          .mobile-topbar { display:none !important; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="container py-4">
        <div className="row g-4 align-items-start">

          {/* ── Desktop sidebar ── */}
          <div className="col-lg-3 spf-desktop-sidebar">
            <div className="spf-sidebar-card">
              <FilterPanel {...filterPanelProps} />
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="col-12 col-lg-9">

            {/* Mobile top bar */}
            <div className="mobile-topbar">
              <div>
                <h5 className="mb-0 fw-bold">Shop</h5>
                <small className="text-muted">{pagination.total} products</small>
              </div>
              <button
                className={`mobile-filter-btn${activeCount > 0 ? " has-filters" : ""}`}
                onClick={() => setMobileFilterOpen(true)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
              </button>
            </div>

            {/* Desktop header */}
            <div className="mb-4">
              <div className="d-none d-lg-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold mb-0" style={{ letterSpacing: "-.02em" }}>
                    All Products
                  </h4>
                  <small className="text-muted">
                    Showing {products.length} of {pagination.total}
                  </small>
                </div>
              </div>

              {/* Active filter pills */}
              {(filters.categories.length > 0 || filters.sizes.length > 0 || filters.search) && (
                <div className="shop-active-tags">
                  {filters.search && (
                    <button className="spf-active-tag" onClick={() => setSearchInput("")}>
                      &quot;{filters.search}&quot;
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                  {filters.categories.map((id) => {
                    const cat = filterOptions.categories.find((c) => c.id === id);
                    return cat ? (
                      <button key={id} className="spf-active-tag" onClick={() => toggleCategory(id)}>
                        {cat.name}
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    ) : null;
                  })}
                  {filters.sizes.map((id) => {
                    const sz = filterOptions.sizes.find((s) => s.id === id);
                    return sz ? (
                      <button key={id} className="spf-active-tag" onClick={() => toggleSize(id)}>
                        Size: {sz.size}
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Products grid */}
            {products.length === 0 && !loading ? (
              <div className="shop-empty">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h5>No products found</h5>
                <p>Try adjusting or clearing your filters</p>
                <button className="shop-empty-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`row g-3${loading ? " products-loading-overlay" : ""}`}>
                  {products.map((product) => (
                    <div key={product.id} className="col-6 col-md-4">
                      <ProductCard
                        slotProducts={product}
                        handleOpenModal={handleOpenModal}
                        handleAddToCart={handleAddToCart}
                      />
                    </div>
                  ))}
                </div>

                {pagination.has_more && (
                  <div className="load-more-wrap">
                    <button
                      className="load-more-btn"
                      onClick={() => fetchProducts(pagination.current_page + 1, true)}
                      disabled={loadingMore}
                      translate="no"
                    >
                      {/* Keep text inside elements so React swaps elements, not raw
                          text nodes, which translator extensions like to rewrite. */}
                      {loadingMore ? (
                        <>
                          <span className="spf-spinner" />
                          <span>Loading</span>
                        </>
                      ) : (
                        <span>Load More</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div
        className={`spf-overlay${mobileFilterOpen ? " open" : ""}`}
        onClick={() => setMobileFilterOpen(false)}
      >
        <div className="spf-drawer" onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px 14px",
              borderBottom: "1px solid #e8e8e8",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "11px",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              Filters
            </span>
            <button
              onClick={() => setMobileFilterOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "#555",
                display: "flex",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="spf-drawer-scroll">
            <FilterPanel {...filterPanelProps} />
          </div>
          <div className="spf-drawer-footer">
            <button
              className="spf-apply-btn"
              onClick={() => setMobileFilterOpen(false)}
            >
              View {pagination.total} Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShopClient;
