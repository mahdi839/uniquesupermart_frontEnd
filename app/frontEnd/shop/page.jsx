// shop/page.jsx
import ShopServer from "./components/ShopServer";
import ShopSkeleton from "./ShopSkeleton";
import { Suspense } from "react";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: "Shop",
  description: `Browse the full ${SITE_NAME} collection of women's shoes, bags, and fashion accessories.`,
  alternates: { canonical: absoluteUrl("/frontEnd/shop") },
  openGraph: {
    title: `Shop | ${SITE_NAME}`,
    description: `Browse the full ${SITE_NAME} collection of women's shoes, bags, and fashion accessories.`,
    url: absoluteUrl("/frontEnd/shop"),
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopServer />
    </Suspense>
  );
}