import { createSlice } from "@reduxjs/toolkit";

/**
 * A cart line is identified by product + colour + size, not by product alone.
 * Keying on the product id meant Maroon/M and Navy/L collapsed into one line, so
 * a customer could not buy two variants of the same item.
 */
export function makeLineId({ id, size, color_name, colorImage, variant_id }) {
    if (variant_id) return `${id}::v${variant_id}`;

    const colorPart = color_name || colorImage || "";
    return `${id}::${size ?? ""}::${colorPart}`;
}

/** Old carts in localStorage have no lineId, so derive one on load. */
function withLineIds(items) {
    return items.map((item) => ({
        ...item,
        lineId: item.lineId || makeLineId(item),
    }));
}

const loadCartFromStorage = () => {
    if (typeof window !== "undefined") {
        try {
            const storedCart = localStorage.getItem("cart");
            return storedCart ? withLineIds(JSON.parse(storedCart)) : [];
        } catch {
            return [];
        }
    }
    return [];
};

function persist(items) {
    if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(items));
    }
}

/**
 * Accepts either a lineId or a bare product id, so screens that still pass
 * `{ id }` keep working — they act on that product's first line.
 */
function findLine(items, { lineId, id }) {
    if (lineId) return items.find((item) => item.lineId === lineId);
    return items.find((item) => item.id === id);
}

const initialItems = loadCartFromStorage();

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: initialItems,
        count: initialItems.length || 0,
    },
    reducers: {
        addToCart: (state, action) => {
            const {
                id,
                title,
                size,
                price,
                image,
                preQty,
                colorImage,
                color_name,
                variant_id,
                product_color_id,
                color_id,
                size_label,
                max_qty,
                is_preorder,
            } = action.payload;

            const lineId = makeLineId({ id, size, color_name, colorImage, variant_id });
            const existingItem = state.items.find((item) => item.lineId === lineId);
            const qty = preQty ?? 1;

            if (existingItem) {
                const nextQty = existingItem.qty + qty;
                existingItem.qty = max_qty ? Math.min(nextQty, max_qty) : nextQty;
                existingItem.totalPrice = existingItem.unitPrice * existingItem.qty;
            } else {
                state.items.push({
                    lineId,
                    id,
                    title,
                    size,
                    size_label: size_label ?? null,
                    unitPrice: price,
                    totalPrice: price * qty,
                    image,
                    colorImage,
                    color_name,
                    // Inventory hints the API uses to find the exact stock row.
                    variant_id: variant_id ?? null,
                    product_color_id: product_color_id ?? null,
                    color_id: color_id ?? null,
                    max_qty: max_qty ?? null,
                    is_preorder: Boolean(is_preorder),
                    qty,
                });
            }

            state.count = state.items.length;
            persist(state.items);
        },

        increament: (state, action) => {
            const item = findLine(state.items, action.payload);
            if (!item) return;

            // Never let the quantity stepper push past what is actually in stock.
            if (item.max_qty && item.qty >= item.max_qty) return;

            item.qty += 1;
            item.totalPrice = item.unitPrice * item.qty;
            persist(state.items);
        },

        decreament: (state, action) => {
            const item = findLine(state.items, action.payload);
            if (item && item.qty > 1) {
                item.qty -= 1;
                item.totalPrice = item.unitPrice * item.qty;
                persist(state.items);
            }
        },

        setQty: (state, action) => {
            const { qty } = action.payload;
            const item = findLine(state.items, action.payload);
            if (!item) return;

            const capped = item.max_qty ? Math.min(qty, item.max_qty) : qty;
            item.qty = Math.max(1, capped);
            item.totalPrice = item.unitPrice * item.qty;
            persist(state.items);
        },

        removeCart: (state, action) => {
            const { lineId, id } = action.payload;

            state.items = lineId
                ? state.items.filter((item) => item.lineId !== lineId)
                : state.items.filter((item) => item.id !== id);

            state.count = state.items.length;
            persist(state.items);
        },

        clearCart: (state) => {
            state.items = [];
            state.count = 0;
            if (typeof window !== "undefined") {
                localStorage.removeItem("cart");
            }
        },
    },
});

export const { addToCart, increament, decreament, setQty, removeCart, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
