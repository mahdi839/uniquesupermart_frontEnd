"use client";

import React, { useMemo } from "react";

const LOW_STOCK_HINT = 3;

/**
 * Colour x size grid. Colours are the rows, sizes are the columns, and each cell
 * holds the on-hand count for that exact combination.
 *
 * Fully controlled: `cells` is a map keyed by `${colorId || 0}-${sizeId || 0}`,
 * which is the same variant_key the backend uses.
 */
export default function StockMatrixEditor({
  colors = [],
  sizes = [],
  cells = {},
  onCellChange,
  disabled = false,
  lowStockThreshold = LOW_STOCK_HINT,
}) {
  // A product may have colours only, sizes only, both, or neither. A single
  // null entry stands in for the missing axis so the grid always renders.
  const rows = useMemo(
    () => (colors.length ? colors : [{ id: null, name: "All colours" }]),
    [colors]
  );

  const columns = useMemo(
    () => (sizes.length ? sizes : [{ id: null, size: "One size" }]),
    [sizes]
  );

  const keyFor = (colorId, sizeId) => `${colorId || 0}-${sizeId || 0}`;

  const totals = useMemo(() => {
    let onHand = 0;
    let reserved = 0;

    rows.forEach((row) =>
      columns.forEach((col) => {
        const cell = cells[keyFor(row.id, col.id)];
        onHand += Number(cell?.stock) || 0;
        reserved += Number(cell?.reserved) || 0;
      })
    );

    return { onHand, reserved, available: onHand - reserved };
  }, [rows, columns, cells]);

  function cellClass(cell) {
    const stock = Number(cell?.stock);
    if (!Number.isFinite(stock) || stock <= 0) return "is-zero";
    const available = stock - (Number(cell?.reserved) || 0);
    if (available <= lowStockThreshold) return "is-low";
    return "";
  }

  return (
    <div>
      <div className="matrix-wrap">
        <table className="matrix-table">
          <thead>
            <tr>
              <th className="matrix-row-head">Colour</th>
              {columns.map((col) => (
                <th key={col.id ?? "none"}>{col.size}</th>
              ))}
              <th>Row total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowTotal = columns.reduce(
                (sum, col) =>
                  sum + (Number(cells[keyFor(row.id, col.id)]?.stock) || 0),
                0
              );

              return (
                <tr key={row.id ?? "none"}>
                  <td className="matrix-row-head">
                    <span className="inv-variant-cell">
                      {row.code && (
                        <span
                          className="inv-swatch"
                          style={{ background: row.code }}
                        />
                      )}
                      <span style={{ fontWeight: 700 }}>
                        {row.name || "Unnamed"}
                      </span>
                    </span>
                  </td>

                  {columns.map((col) => {
                    const key = keyFor(row.id, col.id);
                    const cell = cells[key] || {};

                    return (
                      <td key={key}>
                        <input
                          type="number"
                          min="0"
                          className={`matrix-cell-input ${cellClass(cell)}`}
                          value={cell.stock ?? 0}
                          disabled={disabled}
                          onChange={(e) =>
                            onCellChange(key, {
                              product_color_id: row.id,
                              size_id: col.id,
                              stock:
                                e.target.value === ""
                                  ? ""
                                  : Math.max(0, Number(e.target.value)),
                            })
                          }
                        />
                        {Number(cell.reserved) > 0 && (
                          <span className="matrix-cell-meta">
                            {cell.reserved} held
                          </span>
                        )}
                      </td>
                    );
                  })}

                  <td className="inv-num">{rowTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="matrix-legend">
        <span>
          <i style={{ background: "#fda29b" }} /> Out of stock
        </span>
        <span>
          <i style={{ background: "#fec84b" }} /> Low (≤ {lowStockThreshold})
        </span>
        <span>
          <strong>{totals.onHand}</strong> on hand
        </span>
        <span>
          <strong>{totals.reserved}</strong> held by open orders
        </span>
        <span>
          <strong>{totals.available}</strong> available to sell
        </span>
      </div>
    </div>
  );
}

/** Build the controlled `cells` map from a matrix API response. */
export function cellsFromMatrix(matrix) {
  const map = {};

  (matrix?.variants ?? []).forEach((variant) => {
    const key = `${variant.product_color_id || 0}-${variant.size_id || 0}`;
    map[key] = {
      product_color_id: variant.product_color_id,
      size_id: variant.size_id,
      stock: variant.stock ?? 0,
      reserved: variant.reserved ?? 0,
      price: variant.price ?? "",
      purchase_price: variant.purchase_price ?? "",
      sku: variant.sku ?? "",
      allow_preorder: Boolean(variant.allow_preorder),
      preorder_limit: variant.preorder_limit ?? "",
      low_stock_threshold: variant.low_stock_threshold ?? "",
      is_active: variant.is_active !== false,
    };
  });

  // Make sure every combination exists, even ones never saved before.
  const colors = matrix?.colors?.length ? matrix.colors : [{ id: null }];
  const sizes = matrix?.sizes?.length ? matrix.sizes : [{ id: null }];

  colors.forEach((color) =>
    sizes.forEach((size) => {
      const key = `${color.id || 0}-${size.id || 0}`;
      if (!map[key]) {
        map[key] = {
          product_color_id: color.id ?? null,
          size_id: size.id ?? null,
          stock: 0,
          reserved: 0,
          price: "",
          purchase_price: "",
          sku: "",
          allow_preorder: false,
          preorder_limit: "",
          low_stock_threshold: "",
          is_active: true,
        };
      }
    })
  );

  return map;
}

/** Turn the controlled map back into the `cells` array the API expects. */
export function cellsToPayload(cells) {
  return Object.values(cells).map((cell) => ({
    product_color_id: cell.product_color_id ?? null,
    size_id: cell.size_id ?? null,
    stock: cell.stock === "" ? 0 : Number(cell.stock),
    price: cell.price === "" || cell.price === null ? null : Number(cell.price),
    purchase_price:
      cell.purchase_price === "" || cell.purchase_price === null
        ? null
        : Number(cell.purchase_price),
    sku: cell.sku || null,
    low_stock_threshold:
      cell.low_stock_threshold === "" || cell.low_stock_threshold === null
        ? null
        : Number(cell.low_stock_threshold),
    allow_preorder: Boolean(cell.allow_preorder),
    preorder_limit:
      cell.preorder_limit === "" || cell.preorder_limit === null
        ? null
        : Number(cell.preorder_limit),
    is_active: cell.is_active !== false,
  }));
}
