import { SITE_URL } from "@/lib/seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/frontEnd/cart",
          "/frontEnd/checkout",
          "/frontEnd/log_in",
          "/frontEnd/register",
          "/frontEnd/my-orders",
          "/frontEnd/admin",
          "/admin",
          "/admin/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
