import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Checkout",
  robots: noIndexRobots,
};

export default function CheckoutLayout({ children }) {
  return children;
}
