"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import { getPrimaryColor } from "@/lib/theme";
import DynamicLoader from "@/app/components/loader/dynamicLoader";
import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard";
import CartDrawer from "@/app/components/frontEnd/components/CartDrawer";
import CategoryStockFilters from "./CategoryStockFilters";
import ColorFilterSidebar from "./ColorFilterSidebar";


export default function CtgProductsLogic({ products, category, pagination, stockFilters }) {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState(products);
  const [categoryPagination, setCategoryPagination] = useState(pagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filtering, setFiltering] = useState(false);

  // Availability filters. Only shown for stock categories, so the rest of the
  // catalogue looks and behaves exactly as before.
  const [liveFilters, setLiveFilters] = useState(stockFilters);
  const showStockFilters = Boolean(liveFilters?.category?.track_inventory);
  const [filterSizes, setFilterSizes] = useState([]);
  const [filterColors, setFilterColors] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedColorName, setSelectedColorName] = useState("");
  const [selectedColorId, setSelectedColorId] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  useEffect(() => {
    setLiveFilters(stockFilters);
  }, [stockFilters]);

  // Re-read sizes/colours from inventory so this page never keeps a stale
  // catalogue-wide list from the first server render.
  useEffect(() => {
    if (!category || !baseUrl) return undefined;

    let cancelled = false;

    fetch(`${baseUrl}api/category-filters/${category}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.data) setLiveFilters(json.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [category, baseUrl]);

  // Open modal with product details
  function handleOpenModal(product) {
    setSelectedProduct(product);
    setSelectedSizes("");
    setIsModalOpen(true);
  }

  // Close modal
  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSizes("");
  }

  // Close drawer
  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleSizeSelect = useCallback((sizeId) => {
    setSelectedSizes(sizeId);
  }, []);

  function handleColorSelect(colorImage, colorName, colorId) {
    setSelectedColor(colorImage);
    setSelectedColorName(colorName ?? "");
    setSelectedColorId(colorId ?? "");
  }

  const handleAddToCart = useCallback(
    (product, type, preQty) => {
      let existingCart = cartItems.find(
        (existProduct) => existProduct.id === product.id
      );
      
      if (existingCart) {
        Swal.fire({
          title: "Already in the cart",
          text: "This product is already in your cart",
          icon: "info",
          confirmButtonText: "Ok",
          confirmButtonColor: getPrimaryColor(),
        });
        return;
      }

      if (product.sizes.length > 1 && !selectedSizes) {
        Swal.fire({
          title: "Please Select A Size",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: getPrimaryColor(),
        });
        return;
      }

      // Listing rows only carry a product-level total. Anything finer is checked
      // on the product page and, definitively, by the API at checkout.
      const summary = product.inventory_summary;
      if (summary?.track_inventory && !summary.in_stock && !summary.allow_preorder) {
        Swal.fire({
          title: "Out of stock",
          text: "This product is sold out right now.",
          icon: "warning",
          confirmButtonText: "Ok",
          confirmButtonColor: getPrimaryColor(),
        });
        return;
      }

      const selectedVariant = product.sizes.find(v => v.id == selectedSizes) || product.sizes[0];

      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          size: selectedSizes ? selectedVariant.id : "",
          size_label: selectedSizes ? selectedVariant.size : null,
          price: selectedVariant?.pivot?.price ?? product.price,
          image: baseUrl + product.images?.[0]?.image || "",
          colorImage: selectedColor ? baseUrl + selectedColor : null,
          color_name: selectedColorName || null,
          color_id: selectedColorId || null,
          preQty: preQty ?? 1,
        })
      );

      setSelectedSizes("");
      toast.success("Added to cart!");
      
      if (type === 'buy') {
        setIsCartDrawerOpen(true);
        setIsDirectBuy(true);
        handleCloseModal();
      }
    },
    [cartItems, dispatch, selectedSizes, selectedColor, selectedColorName, selectedColorId, baseUrl]
  );

  // Filters live in the query string so load-more keeps them.
  const buildQuery = useCallback(
    (page) => {
      const params = new URLSearchParams({ slug: category, page: String(page) });

      if (filterSizes.length) params.set("sizes", filterSizes.join(","));
      if (filterColors.length) params.set("colors", filterColors.join(","));
      if (inStockOnly) params.set("in_stock_only", "1");

      return params.toString();
    },
    [category, filterSizes, filterColors, inStockOnly]
  );

  const hasActiveFilters =
    filterSizes.length > 0 || filterColors.length > 0 || inStockOnly;

  // Refetch page 1 whenever a filter changes. Skipped entirely until the
  // customer actually touches a filter, so the server-rendered list is reused.
  useEffect(() => {
    if (!showStockFilters || !hasActiveFilters) return;

    let cancelled = false;
    setFiltering(true);

    fetch(`${baseUrl}api/products?${buildQuery(1)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setCategoryProducts(data.data?.data ?? []);
        setCategoryPagination(data.pagination ?? null);
      })
      .catch((err) => !cancelled && toast.error(err.message || "Filter failed"))
      .finally(() => !cancelled && setFiltering(false));

    return () => {
      cancelled = true;
    };
  }, [buildQuery, baseUrl, showStockFilters, hasActiveFilters]);

  const toggleSize = useCallback((sizeId) => {
    setFilterSizes((prev) =>
      prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]
    );
  }, []);

  const toggleColor = useCallback((name) => {
    setFilterColors((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilterSizes([]);
    setFilterColors([]);
    setInStockOnly(false);
    setCategoryProducts(products);
    setCategoryPagination(pagination);
  }, [products, pagination]);

  const handleLoadMore = useCallback(async () => {
    if (!categoryPagination?.has_more || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = (categoryPagination.current_page || 1) + 1;
      const res = await fetch(`${baseUrl}api/products?${buildQuery(nextPage)}`);
      const data = await res.json();

      if (!res.ok || data.message !== "success") {
        throw new Error(data.message || "Failed to load products");
      }

      setCategoryProducts((prev) => [...prev, ...(data.data?.data ?? [])]);
      setCategoryPagination(data.pagination ?? {
        current_page: data.data?.current_page || nextPage,
        last_page: data.data?.last_page || 1,
        per_page: data.data?.per_page || 20,
        total: data.data?.total || 0,
        has_more: Boolean(data.data?.next_page_url),
      });
    } catch (err) {
      toast.error(err.message || "Error loading products");
    } finally {
      setLoadingMore(false);
    }
  }, [baseUrl, buildQuery, categoryPagination, loadingMore]);

  useEffect(() => {
    setCategoryProducts(products);
    setCategoryPagination(pagination);

    if (products) {
      setIsLoading(false);
    }
    if (products?.error) {
      toast.error(products.error);
    }
  }, [products, pagination]);

  if (isLoading) {
    return <DynamicLoader />;
  }

  if (products?.error) {
    return <div className="text-center my-5">Error: {products.error}</div>;
  }

  const sizeList = (liveFilters?.sizes ?? []).filter((size) => (size?.available ?? 0) > 0);
  const colorList = (liveFilters?.colors ?? []).filter(
    (color) => (color?.available ?? 0) > 0 && String(color?.name || "").trim() !== ""
  );
  const hasColorSidebar = showStockFilters && colorList.length > 0;
  const productCols = hasColorSidebar ? "col-6 col-md-4 col-lg-4" : "col-6 col-lg-3 col-md-4";

  const sizeSlider = showStockFilters ? (
    <CategoryStockFilters
      sizes={sizeList}
      selectedSizes={filterSizes}
      onToggleSize={toggleSize}
      loading={filtering}
      resultCount={categoryPagination?.total}
    />
  ) : null;

  const colorSidebar = hasColorSidebar ? (
    <ColorFilterSidebar
      colors={colorList}
      selectedColors={filterColors}
      inStockOnly={inStockOnly}
      onToggleColor={toggleColor}
      onToggleInStock={() => setInStockOnly((prev) => !prev)}
      onClear={clearFilters}
    />
  ) : null;

  if (!categoryProducts?.length) {
    return (
      <div className="container">
        {sizeSlider}
        <div className="row g-4 align-items-start">
          {hasColorSidebar && <div className="col-12 col-lg-3">{colorSidebar}</div>}
          <div className={hasColorSidebar ? "col-12 col-lg-9" : "col-12"}>
            <div className="text-center my-5">
              <p className="text-muted mb-3">
                {hasActiveFilters
                  ? "No products match these filters."
                  : "No products found"}
              </p>
              {hasActiveFilters && (
                <button className="load-more-btn" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {sizeSlider}
      <div className="row g-4 align-items-start">
        {hasColorSidebar && <div className="col-12 col-lg-3">{colorSidebar}</div>}
        <div className={hasColorSidebar ? "col-12 col-lg-9" : "col-12"}>
          <div className="row position-relative">
            {categoryProducts?.map((product) => (
              <div className={productCols} key={product.id}>
                <ProductCard
                  slotProducts={product}
                  handleOpenModal={handleOpenModal}
                  handleAddToCart={handleAddToCart}
                />
              </div>
            ))}

            <CartDrawer
              isOpen={isCartDrawerOpen}
              isDirectBuy={isDirectBuy}
              onClose={handleCloseDrawer}
            />
          </div>

          {categoryPagination?.has_more && (
            <div className="d-flex justify-content-center my-4">
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: "12px 48px",
                  border: "1.5px solid var(--primary-color)",
                  borderRadius: "3px",
                  background: "transparent",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  cursor: loadingMore ? "not-allowed" : "pointer",
                  color: "#111",
                  opacity: loadingMore ? 0.45 : 1,
                }}
              >
                {loadingMore ? "Loading" : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
