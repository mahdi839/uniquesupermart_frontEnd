"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary for /frontEnd/shop.
 * Without this, any client-side exception (e.g. a browser extension rewriting
 * the DOM while React re-renders) unmounts the whole app and Next.js shows a
 * blank "Application error" page. Here the user gets a retry button instead.
 */
export default function ShopError({ error, reset }) {
  useEffect(() => {
    console.error("Shop page error:", error);
  }, [error]);

  return (
    <div className="container py-5">
      <div className="text-center" style={{ padding: "80px 20px" }}>
        <h5 className="fw-bold mb-2">Something went wrong</h5>
        <p className="text-muted mb-4" style={{ fontSize: 14 }}>
          We couldn&apos;t update the product list. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "10px 28px",
            background: "var(--primary-color, #111)",
            color: "#fff",
            border: "none",
            borderRadius: 3,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
