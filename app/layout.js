
import "bootstrap/dist/css/bootstrap.min.css";
import "../app/styles/globals.scss";
import "../app/styles/css/bootstrap.min.css";
import "../app/styles/css/style.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-medium-image-zoom/dist/styles.css";
import Bootstrap_js from "./components/bootstrapJs/Bootstrap_js";
import Providers from "./Providers";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import PixelTracker from "./components/PixelTracker";
import { siteConfig } from "@/config/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(siteConfig.site_url),
  title: `${siteConfig.company_name} - Your Gateway to Global Footwear Elegance`,
  description: `${siteConfig.company_name} offers premium women's shoes, bags, and fashion accessories. Call: ${siteConfig.phone}`,
  keywords: `shoes online Bangladesh, women's shoes, bags, fashion accessories, ${siteConfig.company_name}`,
  authors: [{ name: siteConfig.company_name }],
  icons: {
    icon: [
      {
        url: "/img/logo.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/img/logo.png",
  },
  openGraph: {
    title: `${siteConfig.company_name} - Your Gateway to Global Footwear Elegance`,
    description: `Shop premium women's shoes, bags, and fashion accessories at ${siteConfig.company_name}`,
    url: siteConfig.site_url,
    siteName: siteConfig.company_name,
    images: [
      {
        url: "/img/logo.png",

      },
    ],
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.company_name,
    description: "Your Gateway to Global Footwear Elegance",
    images: ["/img/logo.png"],
  },
  // verification: {
  //   google: "your-google-verification-code", // Add after Google Search Console setup
  // },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ✅ Meta Pixel Script */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '2078716722977213');
          fbq('track', 'PageView');
        `}
      </Script>

      <body className={inter.variable}>
        {/* ✅ Noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2078716722977213&ev=PageView&noscript=1"
          />
        </noscript>
        <Providers>
          <PixelTracker />
          <div className="gradient-bg">
            <Bootstrap_js />
            <ToastContainer />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}


