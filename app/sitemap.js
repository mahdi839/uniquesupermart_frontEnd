import { SITE_URL } from "@/lib/seo";

const STATIC_PAGES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/frontEnd/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/frontEnd/about_us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/frontEnd/privacy_policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/frontEnd/return_policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap() {
  const now = new Date();
  const entries = STATIC_PAGES.map((page) => ({
    url: page.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/seo/sitemap`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return entries;

    const data = await res.json();

    const categoryEntries = (data.categories || [])
      .filter((category) => category?.slug)
      .map((category) => ({
        url: `${SITE_URL}/frontEnd/${category.slug}`,
        lastModified: category.updated_at
          ? new Date(category.updated_at)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const productEntries = (data.products || []).map((product) => ({
      url: `${SITE_URL}/frontEnd/product-page/${product.id}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...entries, ...categoryEntries, ...productEntries];
  } catch (error) {
    console.error("Sitemap fetch failed:", error);
    return entries;
  }
}
