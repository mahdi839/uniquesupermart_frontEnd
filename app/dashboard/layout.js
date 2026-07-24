import BackEndLayout from "../components/layouts/BackEndLayout"
import { siteConfig } from "@/config/siteConfig";

export const metadata = {
  title: `Dashboard | ${siteConfig.company_name}`,
}

export default function RootLayout({ children }) {
  return (
    <BackEndLayout>
    {children}
    </BackEndLayout>   
  )
}
