import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: "About Us",
  description: `${SITE_NAME} brings international women's shoes, bags, and fashion through a pre-order model in Bangladesh.`,
  alternates: { canonical: absoluteUrl("/frontEnd/about_us") },
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    url: absoluteUrl("/frontEnd/about_us"),
    type: "website",
  },
};

export default function AboutLayout({ children }) {
  return children;
}
