"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PREVIEW_COUNT = 14;

function ColorMini({ color, active, onToggle, baseUrl }) {
  const soldOut = color.available <= 0;
  const imageSrc = color.image
    ? color.image.startsWith("http")
      ? color.image
      : `${baseUrl}${color.image}`
    : null;

  return (
    <button
      type="button"
      className={`color-mini ${active ? "active" : ""} ${soldOut ? "sold-out" : ""}`}
      onClick={() => onToggle(color.name)}
      aria-pressed={active}
    >
      <span
        className="color-mini-swatch"
        style={imageSrc ? undefined : { background: color.code || "#d0d5dd" }}
      >
        {imageSrc && <img src={imageSrc} alt="" />}
      </span>
      <span className="color-mini-copy">
        <span className="color-mini-name">{color.name}</span>
        <span className="color-mini-meta">
          {soldOut ? "Sold out" : `${color.available} available`}
        </span>
      </span>
    </button>
  );
}

export default function ColorFilterSidebar({
  colors = [],
  selectedColors = [],
  inStockOnly = false,
  onToggleColor,
  onToggleInStock,
  onClear,
}) {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const colorList = (Array.isArray(colors) ? colors : Object.values(colors || {})).filter(
    (color) => (color?.available ?? 0) > 0 && String(color?.name || "").trim() !== ""
  );
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const activeCount = selectedColors.length + (inStockOnly ? 1 : 0);
  const preview = colorList.slice(0, PREVIEW_COUNT);
  const hiddenCount = Math.max(0, colorList.length - PREVIEW_COUNT);
  const overlayOpen = exploreOpen || menuOpen;

  useEffect(() => {
    if (!overlayOpen) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setExploreOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  if (colorList.length === 0) return null;

  const list = (items) =>
    items.map((color) => (
      <ColorMini
        key={color.name}
        color={color}
        active={selectedColors.includes(color.name)}
        onToggle={onToggleColor}
        baseUrl={baseUrl}
      />
    ));

  return (
    <>
      <button
        type="button"
        className={`color-mobile-btn ${activeCount > 0 ? "has-filters" : ""}`}
        onClick={() => setMenuOpen(true)}
        aria-expanded={menuOpen}
      >
        <span className="color-burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Colour
        {activeCount > 0 && (
          <span className="color-mobile-count">{activeCount}</span>
        )}
      </button>

      <aside className="color-side color-mini-scope">
        <div className="color-side-head">
          <span className="color-side-title">Colour</span>
          {activeCount > 0 && (
            <button type="button" className="color-side-clear" onClick={onClear}>
              Clear
            </button>
          )}
        </div>

        <button
          type="button"
          className={`color-side-stock ${inStockOnly ? "active" : ""}`}
          onClick={onToggleInStock}
        >
          In stock only
        </button>

        <div className="color-side-list">{list(preview)}</div>

        {hiddenCount > 0 && (
          <button
            type="button"
            className="color-explore"
            onClick={() => setExploreOpen(true)}
          >
            Explore more
            <span className="color-explore-count">+{hiddenCount}</span>
          </button>
        )}
      </aside>

      {exploreOpen &&
        createPortal(
          <div
            className="color-explore-layer color-mini-scope"
            onClick={() => setExploreOpen(false)}
            role="presentation"
          >
            <div
              className="color-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="color-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="color-modal-head">
                <div>
                  <h3 id="color-modal-title">All colours</h3>
                  <p className="color-modal-sub">
                    {colorList.length} colours
                    {selectedColors.length > 0
                      ? ` · ${selectedColors.length} selected`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="color-modal-close"
                  aria-label="Close"
                  onClick={() => setExploreOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="color-modal-grid">{list(colorList)}</div>
            </div>
          </div>,
          document.body
        )}

      {menuOpen &&
        createPortal(
          <div
            className="color-drawer-layer color-mini-scope"
            onClick={() => setMenuOpen(false)}
            role="presentation"
          >
            <div
              className="color-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="color-drawer-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="color-drawer-head">
                <div>
                  <h3 id="color-drawer-title">Colour</h3>
                  <p className="color-modal-sub">
                    {colorList.length} colours
                    {selectedColors.length > 0
                      ? ` · ${selectedColors.length} selected`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="color-modal-close"
                  aria-label="Close"
                  onClick={() => setMenuOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="color-drawer-scroll">
                <button
                  type="button"
                  className={`color-side-stock ${inStockOnly ? "active" : ""}`}
                  onClick={onToggleInStock}
                >
                  In stock only
                </button>
                <div className="color-drawer-grid">{list(colorList)}</div>
              </div>

              <div className="color-drawer-foot">
                {activeCount > 0 && (
                  <button
                    type="button"
                    className="color-side-clear"
                    onClick={onClear}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  className="color-drawer-done"
                  onClick={() => setMenuOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style jsx>{`
        .color-mobile-btn {
          display: none;
        }
        .color-side {
          background: #fff;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 16px 14px;
          position: sticky;
          top: 80px;
        }
        .color-side-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .color-side-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #111;
        }
        .color-side-clear {
          border: none;
          background: none;
          padding: 0;
          font-size: 11px;
          font-weight: 700;
          color: #b42318;
          cursor: pointer;
        }
        .color-side-stock {
          width: 100%;
          margin-bottom: 12px;
          padding: 7px 10px;
          border: 1.5px solid #e8e8e8;
          border-radius: 4px;
          background: #fafafa;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          cursor: pointer;
          text-align: left;
        }
        .color-side-stock.active {
          background: #111;
          border-color: #111;
          color: #fff;
        }
        .color-side-list,
        .color-modal-grid,
        .color-drawer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .color-mini-scope :global(.color-mini) {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          min-width: 0;
          padding: 8px;
          border: 1.5px solid #f0f0f0;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .color-mini-scope :global(.color-mini:hover) {
          border-color: #ccc;
        }
        .color-mini-scope :global(.color-mini.active) {
          border-color: #111;
          box-shadow: inset 0 0 0 1px #111;
        }
        .color-mini-scope :global(.color-mini.sold-out) {
          opacity: 0.48;
        }
        .color-mini-scope :global(.color-mini-swatch) {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(16, 24, 40, 0.08);
        }
        .color-mini-scope :global(.color-mini-swatch img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .color-mini-scope :global(.color-mini-copy) {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .color-mini-scope :global(.color-mini-name) {
          font-size: 13px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .color-mini-scope :global(.color-mini-meta) {
          font-size: 11px;
          font-weight: 600;
          color: #98a2b3;
        }
        .color-mini-scope :global(.color-mini.sold-out .color-mini-meta) {
          color: #b42318;
        }
        .color-explore {
          width: 100%;
          margin-top: 10px;
          padding: 9px 12px;
          border: 1.5px solid #111;
          border-radius: 6px;
          background: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #111;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .color-explore:hover {
          background: #111;
          color: #fff;
        }
        .color-explore-count {
          font-size: 10px;
          letter-spacing: 0;
          font-weight: 700;
          opacity: 0.7;
        }

        .color-explore-layer {
          position: fixed;
          inset: 0;
          z-index: 10050;
          background: rgba(16, 24, 40, 0.45);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .color-modal {
          width: min(720px, 100%);
          max-height: min(82vh, 760px);
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(16, 24, 40, 0.22);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .color-modal-head,
        .color-drawer-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 20px 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        .color-modal-head h3,
        .color-drawer-head h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #111;
        }
        .color-modal-sub {
          margin: 3px 0 0;
          font-size: 12px;
          color: #98a2b3;
          font-weight: 600;
        }
        .color-modal-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: #f2f4f7;
          color: #111;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
        }
        .color-modal-grid {
          padding: 14px 16px 18px;
          overflow-y: auto;
          grid-template-columns: 1fr 1fr 1fr;
        }

        .color-drawer-layer {
          position: fixed;
          inset: 0;
          z-index: 10050;
          background: rgba(16, 24, 40, 0.45);
          display: flex;
          justify-content: flex-start;
        }
        .color-drawer {
          width: min(320px, 88vw);
          height: 100%;
          background: #fff;
          display: flex;
          flex-direction: column;
          animation: colorDrawerIn 0.22s ease;
        }
        .color-drawer-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 14px 14px 10px;
        }
        .color-drawer-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 16px 20px;
          border-top: 1px solid #eee;
        }
        .color-drawer-done {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          background: #111;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }
        @keyframes colorDrawerIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 991.98px) {
          .color-side {
            display: none;
          }
          .color-mobile-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
            padding: 8px 14px;
            border: 1.5px solid #111;
            border-radius: 3px;
            background: #fff;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: #111;
            cursor: pointer;
          }
          .color-mobile-btn.has-filters {
            background: #111;
            color: #fff;
          }
          .color-burger {
            display: flex;
            flex-direction: column;
            gap: 3px;
            width: 14px;
          }
          .color-burger span {
            display: block;
            height: 1.5px;
            background: currentColor;
            border-radius: 2px;
          }
          .color-mobile-count {
            min-width: 16px;
            height: 16px;
            padding: 0 4px;
            border-radius: 999px;
            background: var(--primary-color, #7d0ba7);
            color: #fff;
            font-size: 9px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .color-modal-grid,
          .color-drawer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </>
  );
}
