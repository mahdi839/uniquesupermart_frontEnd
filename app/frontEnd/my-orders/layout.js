import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "My Orders",
  robots: noIndexRobots,
};

export default function MyOrdersLayout({ children }) {
  return children;
}
