import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: "Privacy Policy",
  description: `Read how ${SITE_NAME} collects, uses, and protects your personal information.`,
  alternates: { canonical: absoluteUrl("/frontEnd/privacy_policy") },
};

export default function PrivacyLayout({ children }) {
  return children;
}
