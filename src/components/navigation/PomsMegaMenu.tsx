
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function PomsMegaMenu() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const groups = [
    {
      title: t("nav.collection"),
      description: "Discover the POM'S footwear universe.",
      links: [
        { href: "/collection", label: t("nav.collection") },
        { href: "/catalogue", label: t("nav.catalogue") },
      ],
    },
    {
      title: "Bespoke & Trade",
      description: "Create, collaborate and grow with POM'S.",
      links: [
        { href: "/custom-design", label: t("nav.customDesign") },
        { href: "/wholesale", label: t("nav.wholesale") },
      ],
    },
    {
      title: "Brand & Assurance",
      description: "Learn about our identity and authenticity.",
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/authenticity", label: t("nav.authenticity") },
      ],
    },
  ];

  return (
    <div ref={menuRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="poms-desktop-mega-menu"
        className="flex h-8 w-8 items-center justify-center text-[var(--foreground-muted)] transition hover:text-[var(--gold)]"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id="poms-desktop-mega-menu"
          className="absolute right-0 top-full z-[80] w-[min(760px,90vw)] pt-5"
        >
          <div className="grid grid-cols-1 gap-7 border border-[var(--border)] bg-[var(--background)] p-6 shadow-2xl md:grid-cols-3 md:p-8">
            <div className="border-b border-[var(--border)] pb-5 md:col-span-3">
              <p className="font-serif text-2xl text-[var(--foreground)]">
                POM&apos;S INTERNATIONAL
              </p>
              <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]">
                Explore our world
              </p>
            </div>

            {groups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="font-serif text-sm text-[var(--gold)]">
                  {group.title}
                </h3>
                <p className="text-xs leading-6 text-[var(--foreground-muted)]">
                  {group.description}
                </p>
                <div className="space-y-3">
                  {group.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group/link flex items-center justify-between gap-2 text-xs text-[var(--foreground)] transition hover:text-[var(--gold)]"
                    >
                      {item.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover/link:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-[var(--border)] pt-4 md:col-span-3">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] hover:text-[var(--foreground)]"
              >
                Contact POM&apos;S INTERNATIONAL
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
