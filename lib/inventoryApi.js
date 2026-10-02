import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

function authHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function url(path) {
  return `${baseUrl}api/${path.replace(/^\//, "")}`;
}

/** Pulls the human-readable message out of a Laravel error response. */
export function apiErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;

  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }

  return data?.message || error?.message || fallback;
}

export const inventoryApi = {
  summary: () =>
    axios.get(url("inventory/summary"), { headers: authHeaders() }),

  variants: (params) =>
    axios.get(url("inventory/variants"), { headers: authHeaders(), params }),

  movements: (params) =>
    axios.get(url("inventory/movements"), { headers: authHeaders(), params }),

  products: (params) =>
    axios.get(url("inventory/products"), { headers: authHeaders(), params }),

  sizes: () => axios.get(url("inventory/sizes"), { headers: authHeaders() }),

  matrix: (productId) =>
    axios.get(url(`inventory/products/${productId}/matrix`), {
      headers: authHeaders(),
    }),

  saveMatrix: (productId, payload) =>
    axios.put(url(`inventory/products/${productId}/matrix`), payload, {
      headers: authHeaders(),
    }),

  stockIn: (payload) =>
    axios.post(url("inventory/stock-in"), payload, { headers: authHeaders() }),

  adjust: (payload) =>
    axios.post(url("inventory/adjust"), payload, { headers: authHeaders() }),
};

export default inventoryApi;
