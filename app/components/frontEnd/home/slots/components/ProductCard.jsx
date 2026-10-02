
import Link from "next/link";
import ColorSwatchIsland from "./ColorSwatchIsland";
import "./productCard.css";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

function cardStatusBadge(product) {
  if (product?.status === "prebook") return "prebook";

  const summary = product?.inventory_summary;
  const inventory = product?.inventory;
  const tracks = Boolean(summary?.track_inventory ?? inventory?.track_inventory);
  const inStock = summary
    ? Boolean(summary.in_stock)
    : tracks && (inventory?.total_available ?? 0) > 0;

  if ((tracks && inStock) || product?.status === "in-stock") return "in-stock";
  return null;
}

export default function ProductCard({ slotProducts, slotLength, className }) {
  const firstImage = slotProducts?.images?.[0]?.image
    ? `${baseUrl}${slotProducts.images[0].image}`
    : slotProducts?.image
    ? `${baseUrl}${slotProducts.image}`
    : "";
  const statusBadge = cardStatusBadge(slotProducts);

  return (
    <div
      className={`${slotLength >= 4 ? "px-1" : ""} ${className ?? ""} my-2 my-md-5 position-relative`}
    >
      {/*
       * `d-flex flex-column` on the card makes `order` work across
       * SSR children and CSR island children uniformly.
       */}
      <div className="card product-div p-1 p-md-2 bg-white h-100 product-card position-relative d-flex flex-column">

        {/* Renders: hero image (order:0) + swatch row (order:3) */}
        <ColorSwatchIsland
          productId={slotProducts?.id}
          productTitle={slotProducts?.title}
          firstImage={firstImage}
          colors={slotProducts?.colors ?? []}
          baseUrl={baseUrl}
        />

        {/* order:1 — title */}
        <Link
          href={`/frontEnd/product-page/${slotProducts?.id}`}
          style={{ textDecoration: "none", order: 1 }}
        >
          <div className="px-2 px-md-3 pt-2 pt-md-3 pb-0">
            <p className="mb-1">
              <small
                className="text-decoration-none fw-bold product-card-title text-truncate d-block"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {slotProducts?.title}
              </small>
            </p>
          </div>
        </Link>

        {/* order:2 — price (swatch row order:3 sits after this) */}
        <div className="px-2 px-md-3 pb-1" style={{ order: 2 }}>
          <div className="d-flex gap-3 align-items-center mt-1 mt-md-2">
            <span className="discount-price text-decoration-line-through">
              {slotProducts?.price ?? 0}৳
            </span>
            {slotProducts?.discount && (
              <span className="fw-bold product-price">
                {slotProducts.discount}৳
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Status badge — absolute, unaffected by flex order */}
      {statusBadge === "prebook" && (
        <div className="position-absolute m-2 px-2 px-md-3 py-1 shadow-sm product_status_badge">
          PRE-BOOK
        </div>
      )}
      {statusBadge === "in-stock" && (
        <div className="position-absolute m-2 px-2 px-md-3 py-1 shadow-sm product_status_badge in-stock-badge">
          IN-STOCK
        </div>
      )}
    </div>
  );
}