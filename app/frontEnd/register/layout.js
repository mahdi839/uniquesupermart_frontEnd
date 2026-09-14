import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Register",
  robots: noIndexRobots,
};

export default function RegisterLayout({ children }) {
  return children;
}
