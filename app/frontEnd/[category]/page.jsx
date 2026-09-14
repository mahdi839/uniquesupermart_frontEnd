import CtgProductsLogic from "./components/CtgProductsLogic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  absoluteUrl,
  RESERVED_CATEGORY_SLUGS,
  SITE_NAME,
} from "@/lib/seo";

async function getCategory(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/seo/category/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const slug = params?.category;

  if (!slug || RESERVED_CATEGORY_SLUGS.includes(slug)) {
    notFound();
  }

  const category = await getCategory(slug);
  if (!category) {
    notFound();
  }

  const title = category.name;
  const description = `Shop ${category.name} at ${SITE_NAME}. Browse the latest collection online in Bangladesh.`;
  const canonical = absoluteUrl(`/frontEnd/${slug}`);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export default async function Page({ params }) {
  const category = params?.category;

  if (!category || RESERVED_CATEGORY_SLUGS.includes(category)) {
    notFound();
  }

  const categoryInfo = await getCategory(category);
  if (!categoryInfo) notFound();

  let products = [];
  let paginationData = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/products?slug=${category}&page=1`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    products = data.data?.data ?? [];

    paginationData = data.pagination ?? {
      current_page: data.data?.current_page || 1,
      last_page: data.data?.last_page || 1,
      per_page: data.data?.per_page || 20,
      total: data.data?.total || 0,
      has_more: Boolean(data.data?.next_page_url),
    };
  } catch (err) {
    console.error("Fetch error:", err);
    products = { error: err.message };
  }

  return (
    <>
      <div className="container">
        <p>
          <Link href="/">Home /</Link>{" "}
          <strong>
            {categoryInfo.name ||
              category?.charAt(0).toUpperCase() + category?.slice(1)}
          </strong>
        </p>
      </div>

      <CtgProductsLogic
        products={products}
        category={category}
        pagination={paginationData}
      />
    </>
  );
}
