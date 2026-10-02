"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import inventoryApi, { apiErrorMessage } from "@/lib/inventoryApi";

/**
 * Receive a delivery. Adds to the current count and records a `purchase` in the
 * ledger, which is what keeps cost history intact — unlike the matrix editor,
 * which overwrites the number.
 */
export default function StockInModal({ onClose, onSaved }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [variants, setVariants] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [costs, setCosts] = useState({});
  const [note, setNote] = useState("");
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const { data } = await inventoryApi.products({ search });
        if (!cancelled) setProducts(data.data ?? []);
      } catch {
        /* the picker just stays empty */
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    if (!productId) {
      setVariants([]);
      return;
    }

    let cancelled = false;
    setLoadingVariants(true);

    inventoryApi
      .variants({ product_id: productId, per_page: 200 })
      .then(({ data }) => {
        if (!cancelled) setVariants(data.data?.data ?? []);
      })
      .catch((error) =>
        toast.error(apiErrorMessage(error, "Could not load variants"))
      )
      .finally(() => !cancelled && setLoadingVariants(false));

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const lines = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, qty]) => Number(qty) > 0)
        .map(([variantId, qty]) => ({
          product_variant_id: Number(variantId),
          qty: Number(qty),
          unit_cost:
            costs[variantId] === "" || costs[variantId] === undefined
              ? null
              : Number(costs[variantId]),
        })),
    [quantities, costs]
  );

  const totalUnits = lines.reduce((sum, line) => sum + line.qty, 0);

  async function handleSave() {
    if (lines.length === 0) {
      toast.warn("Enter a quantity for at least one variant");
      return;
    }

    setSaving(true);
    try {
      await inventoryApi.stockIn({ note: note || null, lines });
      toast.success(`Received ${totalUnits} unit${totalUnits > 1 ? "s" : ""}`);
      onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not receive stock"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inv-modal-backdrop" onClick={onClose}>
      <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="inv-modal-head">
          <div>
            <h5 className="inv-modal-title">Receive Stock</h5>
            <p className="inv-modal-sub">
              Add newly arrived units. Existing counts go up, nothing is
              overwritten.
            </p>
          </div>
          <button className="inv-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="inv-modal-body">
          <div className="inv-field">
            <label className="inv-label">Product</label>
            <input
              className="inv-input mb-2"
              placeholder="Search by name or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="inv-select"
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                setQuantities({});
                setCosts({});
              }}
            >
              <option value="">— Select a product —</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                  {product.sku ? ` (${product.sku})` : ""}
                </option>
              ))}
            </select>
          </div>

          {loadingVariants && (
            <div className="inv-empty">
              <i className="fas fa-circle-notch fa-spin" />
              Loading variants…
            </div>
          )}

          {!loadingVariants && productId && variants.length === 0 && (
            <div className="inv-note inv-note-warn">
              <i className="fas fa-triangle-exclamation mt-1" />
              <span>
                This product has no colour or size rows yet. Open it in Products
                and save it once to build the stock grid.
              </span>
            </div>
          )}

          {variants.length > 0 && (
            <div className="inv-table-scroll">
              <table className="inv-table" style={{ minWidth: 480 }}>
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th style={{ textAlign: "right" }}>On hand</th>
                    <th style={{ textAlign: "center" }}>Receive</th>
                    <th style={{ textAlign: "center" }}>Unit cost</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td>
                        <span className="inv-variant-cell">
                          {variant.color?.code && (
                            <span
                              className="inv-swatch"
                              style={{ background: variant.color.code }}
                            />
                          )}
                          <span style={{ fontWeight: 600 }}>
                            {variant.label || "Default"}
                          </span>
                        </span>
                      </td>
                      <td className="inv-num">{variant.stock}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          className="matrix-cell-input"
                          value={quantities[variant.id] ?? ""}
                          onChange={(e) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [variant.id]: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="matrix-cell-input"
                          placeholder={variant.purchase_price ?? "—"}
                          value={costs[variant.id] ?? ""}
                          onChange={(e) =>
                            setCosts((prev) => ({
                              ...prev,
                              [variant.id]: e.target.value,
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="inv-field mt-3">
            <label className="inv-label">Reference / note</label>
            <input
              className="inv-input"
              placeholder="e.g. Supplier invoice #2291"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="inv-help">Shows up in the stock history.</p>
          </div>
        </div>

        <div className="inv-modal-foot">
          <button className="inv-btn inv-btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="inv-btn inv-btn-primary"
            onClick={handleSave}
            disabled={saving || totalUnits === 0}
          >
            {saving
              ? "Receiving…"
              : `Receive ${totalUnits || ""} unit${totalUnits === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
