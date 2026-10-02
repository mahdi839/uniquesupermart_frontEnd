"use client";

import { useMemo } from "react";

/**
 * Reads the `inventory` block the product API now returns and answers the three
 * questions the product page needs:
 *   - can this colour still be bought at all?
 *   - can this size still be bought (given the chosen colour)?
 *   - how many units are left for the exact colour + size the customer picked?
 *
 * Colours are matched on `color_id`, which mirrors the id inside the legacy
 * products.colors JSON the storefront already renders.
 */
export default function useProductInventory(product) {
  const inventory = product?.inventory;
  const tracks = Boolean(inventory?.track_inventory);
  const combinations = useMemo(
    () => inventory?.combinations ?? [],
    [inventory]
  );

  return useMemo(() => {
    const find = (colorId, sizeId) =>
      combinations.find((combo) => {
        const colorMatch =
          colorId == null
            ? combo.color_id == null
            : String(combo.color_id) === String(colorId);
        const sizeMatch =
          sizeId == null
            ? combo.size_id == null
            : String(combo.size_id) === String(sizeId);

        return colorMatch && sizeMatch;
      });

    /** Sum across the other axis, so a colour shows as sellable if any size is. */
    const sumFor = (predicate) =>
      combinations
        .filter(predicate)
        .reduce((total, combo) => total + (combo.available ?? 0), 0);

    const anyPreorder = (predicate) =>
      combinations.some((combo) => predicate(combo) && combo.allow_preorder);

    return {
      tracks,
      preorderMode: inventory?.preorder_mode ?? "off",
      preorderEtaDays: inventory?.preorder_eta_days ?? null,
      preorderNote: inventory?.preorder_note ?? null,
      totalAvailable: inventory?.total_available ?? null,
      combinations,

      /** Availability for one colour across all its sizes. */
      colorAvailability(colorId) {
        if (!tracks) return { available: null, sellable: true, preorder: false };

        const predicate = (combo) =>
          String(combo.color_id) === String(colorId) && combo.is_active;
        const available = sumFor(predicate);

        return {
          available,
          sellable: available > 0 || anyPreorder(predicate),
          preorder: available <= 0 && anyPreorder(predicate),
        };
      },

      /** Availability for one size, narrowed to the selected colour if there is one. */
      sizeAvailability(sizeId, colorId) {
        if (!tracks) return { available: null, sellable: true, preorder: false };

        const predicate = (combo) =>
          String(combo.size_id) === String(sizeId) &&
          combo.is_active &&
          (colorId == null || String(combo.color_id) === String(colorId));

        const available = sumFor(predicate);

        return {
          available,
          sellable: available > 0 || anyPreorder(predicate),
          preorder: available <= 0 && anyPreorder(predicate),
        };
      },

      /** The exact stock row for the current selection. */
      selection(colorId, sizeId) {
        const combo = find(colorId, sizeId);

        if (!tracks) {
          return {
            variantId: combo?.variant_id ?? null,
            productColorId: combo?.product_color_id ?? null,
            available: null,
            sellable: true,
            preorder: false,
            lowStock: false,
          };
        }

        const available = combo?.available ?? 0;
        const canPreorder = Boolean(combo?.allow_preorder);

        return {
          variantId: combo?.variant_id ?? null,
          productColorId: combo?.product_color_id ?? null,
          available,
          sellable: Boolean(combo?.is_active) && (available > 0 || canPreorder),
          preorder: available <= 0 && canPreorder,
          lowStock: Boolean(combo?.low_stock),
        };
      },
    };
  }, [combinations, inventory, tracks]);
}
