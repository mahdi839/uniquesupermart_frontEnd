import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/siteConfig";

export default function SiteLogo({
  variant = "dark",
  href = "/",
  className = "",
  width = 1600,
  height = 562,
  sizes = "200px",
  priority = false,
  link = true,
}) {
  const src = variant === "light" ? siteConfig?.logo?.light : siteConfig?.logo?.dark;

  const image = (
    <Image
      src={src}
      alt={siteConfig.company_name}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );

  if (!link) return image;

  return <Link href={href}>{image}</Link>;
}
