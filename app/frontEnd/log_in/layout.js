import { noIndexRobots } from "@/lib/seo";

export const metadata = {
  title: "Login",
  robots: noIndexRobots,
};

export default function LoginLayout({ children }) {
  return children;
}
