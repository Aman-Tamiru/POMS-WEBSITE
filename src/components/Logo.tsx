"use client";

import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  const { theme } = useTheme();

  const logoSrc =
    theme === "dark"
      ? "/images/POMS-logo-dark-mode.png"
      : "/images/POMS-logo-light-mode.png";

  return (
    <Image
      src={logoSrc}
      alt="POM'S Footwear"
      width={160}
      height={160}
      priority
      className={`${className} object-contain`}
    />
  );
}