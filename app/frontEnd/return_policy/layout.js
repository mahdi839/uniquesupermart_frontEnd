import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: "Return & Refund Policy",
  description: `Return and refund policy for ${SITE_NAME} pre-order products.`,
  alternates: { canonical: absoluteUrl("/frontEnd/return_policy") },
};

export default function ReturnPolicyLayout({ children }) {
  return children;
}
