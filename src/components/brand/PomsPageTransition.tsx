
"use client";

import { usePathname } from "next/navigation";

type PageKind =
  | "product"
  | "collection"
  | "brand"
  | "wholesale"
  | "custom-design"
  | "default"
  | "admin";

export default function PomsPageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let pageKind: PageKind = "default";

  if (pathname.startsWith("/admin")) {
    pageKind = "admin";
  } else if (pathname.startsWith("/product/")) {
    pageKind = "product";
  } else if (pathname.startsWith("/collection")) {
    pageKind = "collection";
  } else if (pathname.startsWith("/about")) {
    pageKind = "brand";
  } else if (pathname.startsWith("/wholesale")) {
    pageKind = "wholesale";
  } else if (pathname.startsWith("/custom-design")) {
    pageKind = "custom-design";
  }

  return (
    <div
      key={pathname}
      className={`poms-page-transition poms-page-transition--${pageKind}`}
    >
      {children}
    </div>
  );
}
