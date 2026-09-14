import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Admin Login",
  robots: noIndexRobots,
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function AdminLayout({ children }) {
  return children;
}
