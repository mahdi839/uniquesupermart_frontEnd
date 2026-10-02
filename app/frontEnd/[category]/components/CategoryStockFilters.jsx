"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SIZE_TONES = [
  ["#6d8bff", "#8ea6ff"],
  ["#e88998", "#f3b0ba"],
  ["#4ecbb6", "#86e0d0"],
  ["#b48cff", "#d0b6ff"],
  ["#f2a05e", "#f6c48d"],
  ["#5aa3f0", "#8ec4f7"],
];

export default function CategoryStockFilters({
  sizes = [],
  selectedSizes = [],
  onToggleSize,
  loading = false,
  resultCount,
}) {
  const sliderRef = useRef(null);
  const sizeList = (Array.isArray(sizes) ? sizes : Object.values(sizes || {})).filter(
    (size) => (size?.available ?? 0) > 0
  );

  if (sizeList.length === 0) return null;

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: sizeList.length > 1,
    speed: 380,
    slidesToShow: Math.min(6, sizeList.length),
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    waitForAnimate: false,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: Math.min(5, sizeList.length) } },
      { breakpoint: 992, settings: { slidesToShow: Math.min(3, sizeList.length) } },
      { breakpoint: 576, settings: { slidesToShow: Math.min(2, sizeList.length) } },
    ],
  };

  return (
    <section className="size-board">
      <h3 className="size-board-title">Stock available in size</h3>
      {typeof resultCount === "number" && (
        <p className="size-board-sub">
          {loading ? "Updating…" : `${resultCount} ${resultCount === 1 ? "product" : "products"}`}
        </p>
      )}

      <div className="size-slider">
        <button
          type="button"
          className="size-arrow prev"
          aria-label="Previous sizes"
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <FaChevronLeft />
        </button>

        <Slider ref={sliderRef} {...sliderSettings}>
          {sizeList.map((size, index) => {
            const active = selectedSizes.includes(size.id);
            const soldOut = size.available <= 0;
            const [from, to] = SIZE_TONES[index % SIZE_TONES.length];

            return (
              <div key={size.id} className="size-slide">
                <button
                  type="button"
                  className={`stock-card ${active ? "active" : ""} ${soldOut ? "sold-out" : ""}`}
                  onClick={() => onToggleSize(size.id)}
                  aria-pressed={active}
                >
                  <span
                    className="stock-orb"
                    style={{
                      background: `linear-gradient(165deg, ${from} 0%, ${to} 100%)`,
                    }}
                  >
                    <span className="stock-orb-value">{size.size}</span>
                    <span className="stock-orb-kicker">Size</span>
                  </span>
                  <span className="stock-meta">
                    {soldOut ? "Sold out" : `${size.available} available`}
                  </span>
                </button>
              </div>
            );
          })}
        </Slider>

        <button
          type="button"
          className="size-arrow next"
          aria-label="Next sizes"
          onClick={() => sliderRef.current?.slickNext()}
        >
          <FaChevronRight />
        </button>
      </div>

      <style jsx>{`
        .size-board {
          background: #fff;
          border-radius: 12px;
          padding: 22px 10px 16px;
          margin: 0 0 22px;
          box-shadow: 0 8px 28px rgba(16, 24, 40, 0.06);
        }
        .size-board-title {
          margin: 0;
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #111;
          line-height: 1.2;
        }
        .size-board-sub {
          margin: 4px 0 0;
          text-align: center;
          font-size: 12px;
          color: #98a2b3;
          font-weight: 500;
        }
        .size-slider {
          position: relative;
          margin-top: 6px;
          padding: 8px 42px 2px;
        }
        .size-slider :global(.slick-list) {
          overflow: hidden;
          margin: 0;
        }
        .size-slider :global(.slick-slide) {
          height: auto;
        }
        .size-slide {
          padding: 10px 4px 6px;
        }
        .stock-card {
          width: 100%;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
        }
        .stock-orb {
          width: 92px;
          height: 92px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow:
            0 0 0 4px #fff,
            0 10px 20px rgba(17, 17, 17, 0.14);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .stock-card:hover .stock-orb {
          transform: translateY(-3px);
        }
        .stock-card.active .stock-orb {
          box-shadow:
            0 0 0 4px #fff,
            0 0 0 7px #111,
            0 12px 22px rgba(17, 17, 17, 0.16);
        }
        .stock-card.sold-out .stock-orb {
          filter: grayscale(0.7);
          opacity: 0.5;
        }
        .stock-orb-value {
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          text-transform: uppercase;
        }
        .stock-orb-kicker {
          margin-top: 4px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.9;
        }
        .stock-meta {
          font-size: 11px;
          font-weight: 600;
          color: #98a2b3;
        }
        .stock-card.sold-out .stock-meta {
          color: #b42318;
        }
        .size-arrow {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto 0;
          z-index: 4;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 6px 18px rgba(17, 17, 17, 0.14);
          color: #111;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          line-height: 0;
        }
        .size-arrow :global(svg) {
          display: block;
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }
        .size-arrow.prev {
          left: 4px;
        }
        .size-arrow.next {
          right: 4px;
        }
        .size-arrow:hover {
          background: #111;
          color: #fff;
        }

        @media (max-width: 575.98px) {
          .size-board {
            padding: 16px 6px 12px;
            border-radius: 10px;
          }
          .size-board-title {
            font-size: 18px;
          }
          .size-slider {
            padding: 4px 32px 0;
          }
          .stock-orb {
            width: 86px;
            height: 86px;
          }
          .stock-orb-value {
            font-size: 22px;
          }
          .size-arrow {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </section>
  );
}
