"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ColorSwatchIsland({
  productId,
  productTitle,
  firstImage,
  colors,
  baseUrl,
}) {
  const [selected, setSelected] = useState({ url: null, index: null });

  const displaySrc = selected.url ? `${baseUrl}${selected.url}` : firstImage;
  const swatches = Array.isArray(colors) ? colors : [];

  function handleClick(index, colorImage) {
    setSelected((prev) =>
      prev.index === index ? { url: null, index: null } : { url: colorImage, index }
    );
  }

  return (
    <>
      {/* order:0 — hero image, visually first */}
      <Link
        href={`/frontEnd/product-page/${productId}`}
        style={{ textDecoration: "none", order: 0 }}
      >
        <div className="position-relative overflow-hidden product-image-container">
          {displaySrc ? (
            <Image
              width={500}
              height={400}
              src={displaySrc}
              className="product-image p-0 p-md-3"
              alt={productTitle || "Product"}
              priority={false}
            />
          ) : (
            <div className="product-image p-0 p-md-3 bg-light" />
          )}
        </div>
      </Link>

      {/* order:3 — swatch row, visually AFTER the price block (order:2) */}
      {swatches.length > 0 && (
        <div
          className="d-flex align-items-center gap-2 px-2 px-md-3 mt-1 mt-lg-2 pb-2"
          style={{ order: 3 }}
        >
          <div className="product-color-wrapper d-flex gap-2">
            {swatches.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className={
                  selected.index === index
                    ? "SelectedImageStyle"
                    : "product_color_image_div"
                }
                onClick={() => handleClick(index, color?.image)}
              >
                <Image
                  width={30}
                  height={30}
                  src={`${baseUrl}${color?.image}`}
                  alt={productTitle || "Color variant"}
                  className="h-100 w-100"
                />
              </div>
            ))}
          </div>

          {swatches.length > 3 && (
            <small className="text-muted">+{swatches.length - 3}</small>
          )}
        </div>
      )}
    </>
  );
}