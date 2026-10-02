"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import inventoryApi, { apiErrorMessage } from "@/lib/inventoryApi";

/**
 * Correct one variant's on-hand figure, e.g. after a physical recount or damage.
 * A reason is mandatory because this is the one operation that can make stock
 * disagree with history.
 */
export default function AdjustStockModal({ variant, onClose, onSaved }) {
  const [stock, setStock] = useState(variant?.stock ?? 0);
  const [type, setType] = useState("adjustment");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const delta = Number(stock) - Number(variant?.stock ?? 0);

  async function handleSave() {
    if (!note.trim()) {
      toast.warn("Add a short reason so the history makes sense later");
      return;
    }

    setSaving(true);
    try {
      await inventoryApi.adjust({
        product_variant_id: variant.id,
        stock: Number(stock),
        type,
        note: note.trim(),
      });

      toast.success("Stock updated");
      onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not update stock"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inv-modal-backdrop" onClick={onClose}>
      <div
        className="inv-modal"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inv-modal-head">
          <div>
            <h5 className="inv-modal-title">Adjust stock</h5>
            <p className="inv-modal-sub">
              {variant?.product?.title} · {variant?.label || "Default"}
            </p>
          </div>
          <button className="inv-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="inv-modal-body">
          <div className="row g-2 mb-3">
            <div className="col-4">
              <div className="inv-stat" style={{ "--inv-accent": "#98a2b3" }}>
                <div className="inv-stat-label">On hand</div>
                <div className="inv-stat-value" style={{ fontSize: 20 }}>
                  {variant?.stock ?? 0}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="inv-stat" style={{ "--inv-accent": "#f79009" }}>
                <div className="inv-stat-label">Held</div>
                <div className="inv-stat-value" style={{ fontSize: 20 }}>
                  {variant?.reserved ?? 0}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="inv-stat" style={{ "--inv-accent": "#17a97f" }}>
                <div className="inv-stat-label">Available</div>
                <div className="inv-stat-value" style={{ fontSize: 20 }}>
                  {variant?.available ?? 0}
                </div>
              </div>
            </div>
          </div>

          <div className="inv-field">
            <label className="inv-label">New on-hand count</label>
            <input
              type="number"
              min="0"
              className="inv-input"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {delta !== 0 && (
              <p className="inv-help">
                {delta > 0 ? "Adds" : "Removes"}{" "}
                <strong>{Math.abs(delta)}</strong> unit
                {Math.abs(delta) === 1 ? "" : "s"}.
              </p>
            )}
          </div>

          <div className="inv-field">
            <label className="inv-label">Reason type</label>
            <select
              className="inv-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="adjustment">Recount / correction</option>
              <option value="damage">Damaged or lost</option>
              <option value="purchase">Purchase not logged earlier</option>
            </select>
          </div>

          <div className="inv-field">
            <label className="inv-label">Note</label>
            <input
              className="inv-input"
              placeholder="e.g. Counted shelf on 12 Sep"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="inv-modal-foot">
          <button className="inv-btn inv-btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="inv-btn inv-btn-primary"
            onClick={handleSave}
            disabled={saving || delta === 0}
          >
            {saving ? "Saving…" : "Save adjustment"}
          </button>
        </div>
      </div>
    </div>
  );
}
