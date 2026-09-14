import BackEndLayout from "../components/layouts/BackEndLayout"
import { siteConfig } from "@/config/siteConfig";

export const metadata = {
  title: { absolute: `Dashboard | ${siteConfig.company_name}` },
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }) {
  return (
    <BackEndLayout>
    {children}
    </BackEndLayout>   
  )
}
