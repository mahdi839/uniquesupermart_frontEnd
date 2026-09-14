
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
import "./components/theme/theme-overrides.css";

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
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var raw=localStorage.getItem('site-theme-vars');if(!raw)return;var vars=JSON.parse(raw);var root=document.documentElement;for(var key in vars){root.style.setProperty(key,vars[key]);}}catch(e){}})();`,
          }}
        />
        {/*
          DOM guard: browser extensions (translators like TransOver / Google
          Translate, Grammarly, etc.) rewrite text nodes React owns. When React
          later calls removeChild / insertBefore on a node that was moved, the
          browser throws NotFoundError and Next.js shows a blank
          "Application error" page. Skip those operations instead of crashing.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof Node!=='function'||!Node.prototype)return;var rc=Node.prototype.removeChild;Node.prototype.removeChild=function(child){if(child&&child.parentNode!==this){if(typeof console!=='undefined'&&console.warn)console.warn('Skipped removeChild: node was moved by a browser extension');return child;}return rc.apply(this,arguments);};var ib=Node.prototype.insertBefore;Node.prototype.insertBefore=function(newNode,ref){if(ref&&ref.parentNode!==this){if(typeof console!=='undefined'&&console.warn)console.warn('Skipped insertBefore: reference node was moved by a browser extension');return newNode;}return ib.apply(this,arguments);};})();`,
          }}
        />
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

          fbq('init', '981684203986467');
          fbq('track', 'PageView');
        `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=981684203986467&ev=PageView&noscript=1"
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


