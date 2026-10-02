import { cache } from "react";
import { notFound } from "next/navigation";
import Products from "../components/Products";
import {
  absoluteUrl,
  productImageUrl,
  SITE_NAME,
  stripHtml,
  truncate,
} from "@/lib/seo";

// Size stock is live. Never serve an hour-old product payload here.
const getProduct = cache(async (id) => {
  try {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${backend}api/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const description = truncate(
    product.short_description || stripHtml(product.description) || product.title,
    160
  );
  const canonical = absoluteUrl(`/frontEnd/product-page/${params.id}`);
  const image = productImageUrl(product.images?.[0]?.image);

  return {
    title: product.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: image, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }) {
  const { id } = params;
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  const product = await getProduct(id);
  if (!product) notFound();

  const [socialRes, relatedRes] = await Promise.allSettled([
    fetch(`${backend}api/social-links-first`, {
      next: { tags: ["social-links"] },
    }),
    fetch(`${backend}api/category_products/${id}?page=1`, {
      next: { tags: ["category-products"] },
    }),
  ]);

  let socialLinksData = {};
  let relatedProductsData = {};

  if (socialRes.status === "fulfilled" && socialRes.value.ok) {
    socialLinksData = await socialRes.value.json();
  }

  if (relatedRes.status === "fulfilled" && relatedRes.value.ok) {
    relatedProductsData = await relatedRes.value.json();
  } else {
    relatedProductsData = { data: [], pagination: {} };
  }

  const description = truncate(
    product.short_description || stripHtml(product.description) || product.title,
    160
  );
  const image = productImageUrl(product.images?.[0]?.image);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    sku: product.sku || undefined,
    image,
    url: absoluteUrl(`/frontEnd/product-page/${id}`),
    brand: { "@type": "Brand", name: SITE_NAME },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Products
        product={product}
        socialLinksData={socialLinksData}
        initialRelatedProducts={relatedProductsData?.data || []}
        relatedPagination={relatedProductsData?.pagination || {}}
        productId={id}
      />
    </>
  );
}
