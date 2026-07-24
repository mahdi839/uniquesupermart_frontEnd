
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

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Eyara Fashion - Your Gateway to Global Footwear Elegance",
  description: "Eyara Fashion offers premium shoes, bags, and fashion accessories. Shop women's shoes, men's footwear, and stylish bags. Call: +8801614477721",
  keywords: "shoes online Bangladesh, women's shoes, men's shoes, bags, fashion accessories, Eyara Fashion",
  authors: [{ name: "Eyara Fashion" }],
  icons: {
    icon: "/img/logo.png",
  },
  openGraph: {
    title: "Eyara Fashion - Your Gateway to Global Footwear Elegance",
    description: "Shop premium shoes and fashion accessories at Eyara Fashion",
    url: "https://uniquesupermart.com",
    siteName: "Eyara Fashion",
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
    title: "Eyara Fashion",
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


