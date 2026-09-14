import FeatureServer from "./components/frontEnd/home/slots/FeatureServer";
import FrontEndLayout from "./components/layouts/FrontEndLayout";
import { Suspense } from "react";
import FeatureSkeleton from "./components/frontEnd/home/slots/components/FeatureSkeleton";
import Hero from "./components/frontEnd/home/hero/hero";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";

export const metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/img/logo.png`,
    },
  ],
};

export default function Home() {
  return (
    <FrontEndLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <div style={{ minHeight: "60vh" }}>
        <Hero />
        <Suspense fallback={<FeatureSkeleton />}>
          <FeatureServer />
        </Suspense>
      </div>
    </FrontEndLayout>
  );
}
