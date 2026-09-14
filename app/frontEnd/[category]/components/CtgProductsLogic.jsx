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


export default function CtgProductsLogic({ products, category, pagination }) {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState(products);
  const [categoryPagination, setCategoryPagination] = useState(pagination);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

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

  function handleColorSelect(colorImage) {
    setSelectedColor(colorImage);
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

      const selectedVariant = product.sizes.find(v => v.id == selectedSizes) || product.sizes[0];

      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          size: selectedSizes ? selectedVariant.id : "",
          price: selectedVariant?.pivot?.price ?? product.price,
          image: baseUrl + product.images?.[0]?.image || "",
          colorImage: selectedColor ? baseUrl + selectedColor : null,
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
    [cartItems, dispatch, selectedSizes, selectedColor, baseUrl]
  );

  const handleLoadMore = useCallback(async () => {
    if (!categoryPagination?.has_more || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = (categoryPagination.current_page || 1) + 1;
      const res = await fetch(
        `${baseUrl}api/products?slug=${category}&page=${nextPage}`
      );
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
  }, [baseUrl, category, categoryPagination, loadingMore]);

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

  if (!categoryProducts?.length) {
    return <div className="text-center my-5 text-danger">No products found</div>;
  }

  return (
    <div className="container">
      <div className="row position-relative">
        {categoryProducts?.map((product) => (
          <div className="col-6 col-lg-3 col-md-4" key={product.id}>
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
  );
}
