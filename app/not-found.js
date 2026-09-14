import Link from "next/link";
import FrontEndLayout from "./components/layouts/FrontEndLayout";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <FrontEndLayout>
      <div className="container py-5 text-center" style={{ minHeight: "50vh" }}>
        <h1 className="fw-bold mb-3">Page not found</h1>
        <p className="text-muted mb-4">
          This page does not exist or the product is no longer available.
        </p>
        <Link href="/" className="btn btn-dark">
          Go to homepage
        </Link>
      </div>
    </FrontEndLayout>
  );
}
