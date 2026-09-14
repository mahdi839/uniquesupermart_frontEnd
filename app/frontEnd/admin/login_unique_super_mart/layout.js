import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Admin Login",
  robots: noIndexRobots,
};

export default function AdminLoginLayout({ children }) {
  return children;
}
