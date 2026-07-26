"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCartPlus, FaChevronLeft, FaChevronRight, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { SiFoursquarecityguide } from "react-icons/si";
import { toast } from "react-toastify";
import Zoom from "react-medium-image-zoom";
import { addToCart } from "@/redux/slices/CartSlice";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import "react-medium-image-zoom/dist/styles.css";
import "./productPage.css";
import "./specification.css";
import useProductLogics from "@/app/hooks/useProductLogics";
import { useDispatch, useSelector } from "react-redux";
import SignProdSkeleton from "./SignProdSkeleton";
import VirtualizedRelatedProducts from "./VirtualizedRelatedProducts";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useDiscountedPrice from "@/app/hooks/useDiscountedPrice";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () => import("@/app/components/frontEnd/components/CartDrawer"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Products({ product, socialLinksData, initialRelatedProducts, productId }) {
  const [activeTab, setActiveTab] = useState("specs");
  const [openFaqId, setOpenFaqId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalSelectedSize, setModalSelectedSize] = useState(null);
  const [modalSelectedColor, setModalSelectedColor] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [localImgUrl, setLocalImgUrl] = useState(null);
  const [selectedColorName, setSelectedColorName] = useState(null)
  // smart image loader
  const [showImgLoader, setShowImgLoader] = useState(false);
  const loaderDelayRef = useRef(null);
  const loaderShownAtRef = useRef(0);
  const activeLoadIdRef = useRef(0);

  const { discount } = useDiscountedPrice(product);

  const {
    handleSelectedColor,
    selectedColor,
    handleSelectedSize,
    selectedSize,
    whatsappUrl,
    preQty,
    handleQuantityIncrease,
    handleQuantityDecrease,
    handleThumbClick,
    imgUrl,
  } = useProductLogics(product, socialLinksData.whatsapp_number);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const router = useRouter();

  const pageId = socialLinksData.facebook_id;
  const messengerUrl = `https://m.me/${pageId}`;

  const images = product?.images || [];
  const cartItem = cartItems.find((item) => product.id == item.id);
  const hasSpecifications = product?.specifications && product.specifications.length > 0;

  const displayImgUrl =
    localImgUrl ||
    imgUrl ||
    (images?.[0]?.image ? `${baseUrl}${images[0].image}` : "/placeholder.png");

  const handleCloseDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  useEffect(() => {
    if (product) setIsLoading(false);
    if (product?.error) toast.error(product.error);
  }, [product]);

  useEffect(() => {
    return () => {
      if (loaderDelayRef.current) clearTimeout(loaderDelayRef.current);
    };
  }, []);

  // preload helper
  function preloadImage(url) {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = resolve;
    });
  }

  // show loader only if load takes some milliseconds
  function startDelayedLoader() {
    if (loaderDelayRef.current) clearTimeout(loaderDelayRef.current);

    loaderDelayRef.current = setTimeout(() => {
      loaderShownAtRef.current = Date.now();
      setShowImgLoader(true);
    }, 120);
  }

  async function stopDelayedLoader() {
    if (loaderDelayRef.current) clearTimeout(loaderDelayRef.current);

    if (!showImgLoader) {
      setShowImgLoader(false);
      return;
    }

    const minVisible = 180;
    const elapsed = Date.now() - loaderShownAtRef.current;

    if (elapsed < minVisible) {
      await new Promise((resolve) => setTimeout(resolve, minVisible - elapsed));
    }

    setShowImgLoader(false);
  }

  async function switchMainImage(newUrl, afterChange) {
    const loadId = ++activeLoadIdRef.current;

    startDelayedLoader();
    await preloadImage(newUrl);

    if (loadId !== activeLoadIdRef.current) return;

    setLocalImgUrl(newUrl);
    if (afterChange) afterChange();
    await stopDelayedLoader();
  }

  async function handleColorClick(colorImage, colorName) {
    const newUrl = `${baseUrl}${colorImage}`;
    await switchMainImage(newUrl, () => {
      handleSelectedColor(colorImage);
    });
    setSelectedColorName(colorName)
  }

  async function handleThumbClickLocal(imgId) {
    const img = images.find((i) => i.id === imgId);
    if (!img) return;

    const newUrl = `${baseUrl}${img.image}`;
    await switchMainImage(newUrl, () => {
      handleThumbClick(imgId);
    });
  }

  function toggleFaq(id) {
    setOpenFaqId((prev) => (prev === id ? 0 : id));
  }

  function getYoutubeVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2]?.length === 11 ? match[2] : null;
  }

  function handleAddToCart(type) {
    if (!product) return;
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product.sizes.length > 1 && !selectedSize) {
      Swal.fire({
        title: `Please Select A Size`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product?.colors?.length > 1 && !selectedColor) {
      Swal.fire({
        title: `Please Select A Color`,
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    const selectedVariant = product.sizes.find((s) => s.id == selectedSize) || product.sizes[0];
    const imageUrl = product.images?.[0]?.image ? baseUrl + product.images[0].image : "";

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        size: selectedSize ? selectedVariant.id : "",
        price: selectedVariant?.pivot?.price ?? product.discount ?? 0,
        image: imageUrl,
        colorImage: selectedColor ? baseUrl + selectedColor : null,
        color_name: selectedColorName,
        preQty: preQty ?? 1,
      })
    );

    if (type === "buy") {
      setIsDirectBuy(true);
      setIsCartDrawerOpen(true);
    }
    if (type === "add") {
      setIsDirectBuy(false);
      setIsCartDrawerOpen(true);
    }
    toast.success("Added to cart!");
  }

  async function handleOpenModal(product) {
    setModalSelectedSize(null);
    setModalSelectedColor(null);
    setIsModalOpen(true);
    try {
      const response = await fetch(`${baseUrl}api/products/${product.id}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch product details");
      const data = await response.json();
      setSelectedProduct(data.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      setIsModalOpen(false);
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  function handleRelatedAddToCart(product, type, preQty) {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      if (type == "buy") {
        setIsCartDrawerOpen(true);
        setIsDirectBuy(true);
        handleCloseModal();
        return;
      }
      Swal.fire({
        title: "Already in the cart",
        text: "This product is already in your cart",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#DB3340",
      });
      return;
    }

    if (product?.sizes?.length > 1 && !modalSelectedSize) {
      Swal.fire({ title: "Please select a size", icon: "warning", confirmButtonColor: "#DB3340" });
      return;
    }

    if (product?.colors?.length > 1 && !modalSelectedColor) {
      Swal.fire({ title: "Please select a color", icon: "warning", confirmButtonColor: "#DB3340" });
      return;
    }

    const baseProduct = product || selectedProduct;
    const selectedVariant =
      baseProduct?.sizes?.find((s) => s.id == modalSelectedSize) || baseProduct?.sizes?.[0];
    const imageUrl = baseProduct?.image ? baseUrl + baseProduct?.image : "";

    dispatch(
      addToCart({
        id: baseProduct.id,
        title: baseProduct.title,
        size: modalSelectedSize ?? "",
        price: selectedVariant?.pivot?.price ?? baseProduct.discount ?? 0,
        image: imageUrl,
        colorImage: modalSelectedColor ? baseUrl + modalSelectedColor : null,
        preQty: preQty ?? 1,
      })
    );
    handleCloseModal();
    toast.success("Added to cart!");

    if (type === "buy") {
      setIsCartDrawerOpen(true);
      setIsDirectBuy(true);
    }
  }

  if (isLoading) return <SignProdSkeleton />;

  function fetchSizeGuideData() {
    setShowSizeGuide(true);
  }

  const sizeGuideImage = "/img/size_guide/size_guide.png";

  function NextArrow({ onClick }) {
    return (
      <button className="custom-slick-arrow custom-slick-next" onClick={onClick}>
        <FaChevronRight />
      </button>
    );
  }

  function PrevArrow({ onClick }) {
    return (
      <button className="custom-slick-arrow custom-slick-prev" onClick={onClick}>
        <FaChevronLeft />
      </button>
    );
  }

  const thumbSliderSettings = {
    dots: false,
    arrows: true,
    infinite: images.length > 4,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="container product-page-container">
      <div className="row my-2 my-md-5 g-2 g-lg-4">
        <div className="col-12 d-lg-none">
          <div className="product-mobile-header d-flex flex-column justify-content-center px-3">
            <h1 className="product-title">{product?.title}</h1>
            {product?.sku && (
              <div className="product-sku">
                SKU: <strong>{product.sku}</strong>
              </div>
            )}
            {product?.status === "prebook" && (
              <div className="preorder-badge">⚡ Pre Order, Delivery Time 20 to 25 Days</div>
            )}
             {product?.status === "in-stock" && (
              <div className="preorder-badge">⚡Delivery Time 2 to 4 Days</div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="product-gallery-wrapper d-flex flex-column flex-md-column gap-1">
            <div className="main-image-container">
              {showImgLoader && (
                <div className="main-image-loader">
                  <div className="img-spinner" />
                </div>
              )}

              <Zoom>
                <Image
                  src={displayImgUrl}
                  alt={product?.title}
                  width={900}
                  height={900}
                  priority
                  className="main-product-image"
                />
              </Zoom>
            </div>

            {images?.length > 1 && (
              <div className="thumbnails-container">
                <div className="d-none d-md-block w-100">
                  {images.length >= 4 ? (
                    <Slider {...thumbSliderSettings}>
                      {images.map((img) => (
                        <div key={img.id} className="px-1">
                          <button
                            type="button"
                            className={`sub-img ${displayImgUrl === `${baseUrl}${img.image}` ? "active" : ""
                              }`}
                            onClick={() => handleThumbClickLocal(img.id)}
                            style={{
                              padding: 0,
                              overflow: "hidden",
                              background: "#f8f9fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              src={baseUrl + img.image}
                              alt="product thumbnail"
                              width={600}
                              height={600}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </button>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="d-flex gap-2 flex-wrap">
                      {images.map((img) => (
                        <div key={img.id} style={{ flex: "0 0 auto", width: "80px" }}>
                          <button
                            className={`sub-img ${displayImgUrl === `${baseUrl}${img.image}` ? "active" : ""
                              }`}
                            onClick={() => handleThumbClickLocal(img.id)}
                            style={{
                              width: "100%",
                              height: "80px",
                              padding: 0,
                              background: "#f8f9fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              src={baseUrl + img.image}
                              alt="product thumbnail"
                              width={600}
                              height={600}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex d-md-none mobile-thumbs-vertical">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      className={`mobile-thumb-btn ${displayImgUrl === `${baseUrl}${img.image}` ? "active" : ""
                        }`}
                      onClick={() => handleThumbClickLocal(img.id)}
                    >
                      <Image
                        src={baseUrl + img.image}
                        alt="product thumbnail"
                        width={200}
                        height={200}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="product-info-card">
            <div className="product-header d-none d-lg-block">
              <h1 className="product-title">{product?.title}</h1>
              {product?.sku && (
                <div className="product-sku">
                  SKU: <strong>{product.sku}</strong>
                </div>
              )}
              {product?.status === "prebook" && (
                <div className="preorder-badge">⚡ Pre Order, Delivery Time 20 to 25 Days</div>
              )}
            </div>

            <div className="price-section">
              <div className="discount-price text-decoration-line-through">{product?.price ?? 0}৳</div>
              {product?.discount > 0 && (
                <div className="product-price">{(product?.discount ?? 0) * (preQty ?? 1)}৳</div>
              )}
            </div>

            {product.colors?.length > 0 && (
              <div className="variant-section">
                <div className="color-section-title">
                  <span className="required-asterisk">*</span>
                  Colors:
                </div>
                <div className="color-selector-grid">
                  {product?.colors?.map((color) => (
                    <div
                      key={color.id}
                      className={`color-option-card ${selectedColor === color.image ? "selected" : ""}`}
                      onClick={() => handleColorClick(color?.image, color?.name)}
                      data-tooltip-id="color-tooltip"
                      data-tooltip-content={color.name}
                    >
                      <Image
                        src={
                          color?.image
                            ? process.env.NEXT_PUBLIC_BACKEND_URL + color.image
                            : "/images/placeholder.jpg"
                        }
                        alt={color.name || "Color option"}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Tooltip id="color-tooltip" place="top" className="custom-color-tooltip" />

            {product.sizes?.length > 0 && (
              <div className="variant-section">
                <div className="variant-section-title">
                  <span className="required-asterisk">*</span>
                  Sizes:
                </div>
                <div className="size-selector-grid">
                  {product?.sizes?.map((size) => {
                    const sizePrice = size?.pivot?.price;
                    const isSelected = selectedSize == size.id;
                    return (
                      <button
                        key={size?.id}
                        className={`size-option-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectedSize(size.id)}
                      >
                        {size?.size}
                        {sizePrice && <span className="size-price">৳{sizePrice}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="size-qty-row my-2 my-lg-3 d-lg-flex gap-lg-3">
              <button className="size-guide-btn" onClick={fetchSizeGuideData}>
                <SiFoursquarecityguide />
                Size Guide
              </button>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityDecrease(product.id)}
                  disabled={preQty <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="quantity-display">{cartItem?.qty ?? preQty}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityIncrease(product?.id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons-container">
              <button className="single-prod-action-btn btn-grad" onClick={() => handleAddToCart("add")}>
                <FaCartPlus size={16} />
                Add to Cart
              </button>
              <button className="single-prod-action-btn btn-grad" onClick={() => handleAddToCart("buy")}>
                <FaCartPlus size={16} />
                Buy Now
              </button>
            </div>

            <div className="social-buttons-container">
              <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="social-btn messenger-btn">
                <FaFacebookMessenger size={16} />
                Messenger
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp-btn">
                <FaWhatsapp size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="desc_tab_container mt-4 mt-md-5">
        <div className="tabs-header d-flex flex-wrap justify-content-center gap-2 gap-md-3 mb-4">
          <button className={`tab-btn ${activeTab === "specs" ? "active" : ""}`} onClick={() => setActiveTab("specs")}>
            Description
          </button>
          <button className={`tab-btn ${activeTab === "faq" ? "active" : ""}`} onClick={() => setActiveTab("faq")}>
            FAQ
          </button>
          <button className={`tab-btn ${activeTab === "video" ? "active" : ""}`} onClick={() => setActiveTab("video")}>
            Product Video
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "specs" && hasSpecifications && (
            <div className="specifications-content animated-fade">
              <div className="content-card p-3 p-md-4">
                <div className="specifications-table-wrapper">
                  <table className="table table-bordered specifications-table mb-0">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={spec.id || index}>
                          <td className="spec-key">{spec.key}</td>
                          <td className="spec-value">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="faq-content animated-fade">
              <div className="content-card p-3 p-md-4">
                <div className="accordion-list">
                  {product?.faqs?.length > 0 ? (
                    product.faqs.map((faq) => (
                      <div className={`accordion-item ${openFaqId === faq.id ? "active" : ""}`} key={faq.id}>
                        <button
                          type="button"
                          className="accordion-header p-3 w-100 text-start border-0 bg-transparent"
                          onClick={() => toggleFaq(faq.id)}
                          aria-expanded={openFaqId === faq.id}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="question-text m-0">{faq.question}</h4>
                            <span className="accordion-icon">
                              {openFaqId === faq.id ? <IoIosArrowDown /> : <IoIosArrowUp />}
                            </span>
                          </div>
                        </button>
                        {openFaqId === faq.id && (
                          <div className="accordion-body p-3">
                            <p className="answer-text m-0">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted p-3">No FAQs found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "video" && (
            <div className="terms-content animated-fade">
              <div className="content-card p-3 p-md-4">
                {product?.video_url && getYoutubeVideoId(product.video_url) ? (
                  <div className="video-container ratio ratio-16x9">
                    <iframe
                      className="youtube-embed"
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(product.video_url)}`}
                      title="Product Video"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted">No video available.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSizeGuide && (
        <div className="size-guide-overlay">
          <div className="size-guide-content">
            <button className="size-guide-close" onClick={() => setShowSizeGuide(false)}>
              ✕
            </button>
            <Image src={sizeGuideImage} alt="Size Guide" width={600} height={800} className="img-fluid" />
          </div>
        </div>
      )}

      <VirtualizedRelatedProducts
        initialProducts={initialRelatedProducts}
        productId={productId}
        handleOpenModal={handleOpenModal}
        handleRelatedAddToCart={handleRelatedAddToCart}
      />

      <CartDrawer isOpen={isCartDrawerOpen} isDirectBuy={isDirectBuy} onClose={handleCloseDrawer} />

      <style jsx>{`
  .specifications-table-wrapper {
    overflow-x: auto;
  }
  .specifications-table {
    width: 100%;
    border-collapse: collapse;
  }
  .specifications-table td {
    padding: 12px 16px;
    vertical-align: middle;
    border: 1px solid #dee2e6;
  }
  .spec-key {
    font-weight: 600;
    background-color: #f8f9fa;
    width: 40%;
    color: #495057;
  }
  .spec-value {
    background-color: #ffffff;
    color: #212529;
  }

  .animated-fade {
    animation: fadeIn 0.3s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .main-image-container {
    width: 100%;
    height: 520px;
    padding: 0;
    box-sizing: border-box;
    background: #f8f9fa;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  /* Force react-medium-image-zoom wrapper to fill container */
  .main-image-container :global([data-rmiz-wrap="visible"]),
  .main-image-container :global([data-rmiz-wrap="hidden"]) {
    width: 100%;
    height: 100%;
    display: block;
  }

  .main-product-image {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 0;
    display: block;
  }

  .main-image-loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(1px);
    z-index: 3;
    border-radius: 12px;
  }

  .img-spinner {
    width: 34px;
    height: 34px;
    border: 4px solid #e8e8e8;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .mobile-thumbs-vertical {
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 360px;
    scrollbar-width: none;
  }
  .mobile-thumbs-vertical::-webkit-scrollbar { display: none; }

  .mobile-thumb-btn {
    width: 68px;
    height: 68px;
    min-height: 68px;
    flex-shrink: 0;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: #f8f9fa;
    padding: 0;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease;
  }
  .mobile-thumb-btn.active {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 15%, transparent);
  }
  .mobile-thumb-btn:hover { border-color: var(--primary-color); }

  @media (max-width: 768px) {
    .specifications-table td { padding: 10px 12px; font-size: 0.9rem; }
    .spec-key { width: 45%; }

    .product-gallery-wrapper {
      flex-direction: row !important;
      align-items: flex-start;
      gap: 8px;
    }

    .thumbnails-container {
      order: -1;
      width: 76px !important;
      min-width: 76px !important;
      flex-shrink: 0;
    }

    .main-image-container {
      flex: 1 1 auto !important;
      height: 340px !important;
      padding: 0 !important;
      background: Transparent;
      border:none
    }

    .main-image-container :global([data-rmiz-wrap="visible"]),
    .main-image-container :global([data-rmiz-wrap="hidden"]) {
      width: 100%;
      height: 100%;
      display: block;
    }

    .size-qty-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 18px;
      margin-top: 0.4rem;
      margin-bottom: 0.5rem;
    }
    .size-qty-row .quantity-controls {
      display: flex;
      align-items: center;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      width: 110px;
      flex-shrink: 0;
    }

    .action-buttons-container {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      gap: 8px !important;
      margin-bottom: 0.5rem !important;
    }
    .single-prod-action-btn {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      font-size: 0.78rem !important;
      padding: 9px 6px !important;
      white-space: nowrap;
      gap: 5px !important;
    }

    .social-buttons-container {
      display: flex !important;
      flex-direction: row !important;
      gap: 8px !important;
      margin-top: 7px !important;
    }
    .social-btn {
      flex: 1 !important;
      font-size: 0.78rem !important;
      padding: 9px 6px !important;
      white-space: nowrap;
    }

    .mobile-thumbs-vertical { max-height: 340px; }
  }

  @media (max-width: 480px) {
    .main-image-container {
      height: 260px !important;
      padding: 0 !important;
    }
    .main-image-container :global([data-rmiz-wrap="visible"]),
    .main-image-container :global([data-rmiz-wrap="hidden"]) {
      width: 100%;
      height: 100%;
      display: block;
    }
    .mobile-thumbs-vertical { max-height: 280px; }
    .single-prod-action-btn,
    .social-btn {
      font-size: 0.7rem !important;
      padding: 8px 4px !important;
    }
  }

  @media (max-width: 400px) {
    .single-prod-action-btn,
    .social-btn {
      font-size: 0.7rem !important;
      padding: 8px 4px !important;
    }
  }
`}</style>
    </div>
  );
}
