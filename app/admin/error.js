"use client";

export default function AdminError({ reset }) {
  return (
    <div
      className="container py-5 d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center">
        <h1 className="h4 mb-3">Admin login failed to load</h1>
        <p className="text-muted mb-4">Please try again.</p>
        <button type="button" className="btn btn-grad" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
