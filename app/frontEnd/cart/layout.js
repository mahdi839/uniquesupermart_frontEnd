import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Cart",
  robots: noIndexRobots,
};

export default function CartLayout({ children }) {
  return children;
}
