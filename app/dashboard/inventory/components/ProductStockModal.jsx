"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import inventoryApi, { apiErrorMessage } from "@/lib/inventoryApi";
import StockMatrixEditor, {
  cellsFromMatrix,
  cellsToPayload,
} from "./StockMatrixEditor";

/**
 * Full stock editor for one product: the colour x size grid plus the product's
 * own tracking and pre-order settings.
 */
export default function ProductStockModal({ productId, onClose, onSaved }) {
  const [matrix, setMatrix] = useState(null);
  const [cells, setCells] = useState({});
  const [settings, setSettings] = useState({
    track_inventory: false,
    preorder_mode: "off",
    preorder_eta_days: "",
    preorder_note: "",
    low_stock_threshold: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await inventoryApi.matrix(productId);
      const payload = data.data;

      setMatrix(payload);
      setCells(cellsFromMatrix(payload));
      setSettings({
        track_inventory: Boolean(payload.product.track_inventory),
        preorder_mode: payload.product.preorder_mode || "off",
        preorder_eta_days: payload.product.preorder_eta_days ?? "",
        preorder_note: payload.product.preorder_note ?? "",
        low_stock_threshold: payload.product.low_stock_threshold ?? "",
      });
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not load this product's stock"));
      onClose?.();
    } finally {
      setLoading(false);
    }
  }, [productId, onClose]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCellChange = (key, patch) => {
    setCells((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  async function handleSave() {
    setSaving(true);
    try {
      await inventoryApi.saveMatrix(productId, {
        track_inventory: settings.track_inventory,
        preorder_mode: settings.preorder_mode,
        preorder_eta_days:
          settings.preorder_eta_days === ""
            ? null
            : Number(settings.preorder_eta_days),
        preorder_note: settings.preorder_note || null,
        low_stock_threshold:
          settings.low_stock_threshold === ""
            ? null
            : Number(settings.low_stock_threshold),
        cells: cellsToPayload(cells),
      });

      toast.success("Stock saved");
      onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not save stock"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inv-modal-backdrop" onClick={onClose}>
      <div
        className="inv-modal inv-modal-wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inv-modal-head">
          <div>
            <h5 className="inv-modal-title">
              {matrix?.product?.title || "Product stock"}
            </h5>
            <p className="inv-modal-sub">
              {matrix?.product?.sku
                ? `SKU ${matrix.product.sku} · `
                : ""}
              Set the on-hand count for each colour and size.
            </p>
          </div>
          <button className="inv-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="inv-modal-body">
          {loading ? (
            <div className="inv-empty">
              <i className="fas fa-circle-notch fa-spin" />
              Loading stock…
            </div>
          ) : (
            <>
              {matrix?.product?.inherits_tracking && !settings.track_inventory && (
                <div className="inv-note mb-3">
                  <i className="fas fa-circle-info mt-1" />
                  <span>
                    This product already tracks stock because one of its
                    categories is a stock category. Switching the toggle on here
                    just makes it explicit.
                  </span>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-12 col-lg-4">
                  <label className="inv-label">Stock tracking</label>
                  <select
                    className="inv-select"
                    value={settings.track_inventory ? "1" : "0"}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        track_inventory: e.target.value === "1",
                      }))
                    }
                  >
                    <option value="0">Off — sell without a limit</option>
                    <option value="1">On — enforce stock</option>
                  </select>
                </div>

                <div className="col-12 col-lg-4">
                  <label className="inv-label">Pre-order</label>
                  <select
                    className="inv-select"
                    value={settings.preorder_mode}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, preorder_mode: e.target.value }))
                    }
                  >
                    <option value="off">Not available</option>
                    <option value="when_out_of_stock">
                      Only when out of stock
                    </option>
                    <option value="always">Always pre-order</option>
                  </select>
                </div>

                <div className="col-6 col-lg-2">
                  <label className="inv-label">Delivery days</label>
                  <input
                    type="number"
                    min="0"
                    className="inv-input"
                    placeholder="20"
                    value={settings.preorder_eta_days}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        preorder_eta_days: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-6 col-lg-2">
                  <label className="inv-label">Low stock at</label>
                  <input
                    type="number"
                    min="0"
                    className="inv-input"
                    placeholder="3"
                    value={settings.low_stock_threshold}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        low_stock_threshold: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <StockMatrixEditor
                colors={matrix?.colors ?? []}
                sizes={matrix?.sizes ?? []}
                cells={cells}
                onCellChange={handleCellChange}
                disabled={saving}
                lowStockThreshold={Number(settings.low_stock_threshold) || 3}
              />

              <div className="inv-note inv-note-warn mt-3">
                <i className="fas fa-triangle-exclamation mt-1" />
                <span>
                  These numbers replace the current on-hand count and are recorded
                  as an adjustment. To log a delivery instead, use{" "}
                  <strong>Receive Stock</strong> so the purchase stays in the
                  history.
                </span>
              </div>
            </>
          )}
        </div>

        <div className="inv-modal-foot">
          <button className="inv-btn inv-btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="inv-btn inv-btn-primary"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving…" : "Save stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
