export const SITE_URL = "https://uniquesupermart.com";
export const SITE_NAME = "Unique Super Mart";
export const SITE_TITLE =
  "Unique Super Mart - Your Gateway to Global Footwear Elegance";
export const SITE_DESCRIPTION =
  "Unique Super Mart offers premium shoes, bags, and fashion accessories. Shop women's shoes, men's footwear, and stylish bags. Call: +8801614477721";

export const RESERVED_CATEGORY_SLUGS = [
  "product-page",
  "shop",
  "about_us",
  "cart",
  "checkout",
  "log_in",
  "register",
  "my-orders",
  "privacy_policy",
  "return_policy",
  "admin",
];

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text, max = 160) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export function productImageUrl(imagePath) {
  if (!imagePath) return `${SITE_URL}/img/logo.png`;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  return `${backend}${imagePath.replace(/^\//, "")}`;
}

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
