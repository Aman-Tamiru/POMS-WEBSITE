
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import {
  useLanguage,
  LANGUAGE_LABELS,
  SupportedLanguage,
} from "@/components/LanguageProvider";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/collection", label: t("nav.collection") },
    { href: "/catalogue", label: t("nav.catalogue") },
    { href: "/custom-design", label: t("nav.customDesign") },
    { href: "/wholesale", label: t("nav.wholesale") },
    { href: "/authenticity", label: t("nav.authenticity") },
  ];

  const supportLinks = [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/shipping", label: "Shipping & Customs" },
    { href: "/faq", label: "Frequently Asked Questions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-[var(--background)]/95 shadow-md border-b border-[var(--border)]"
          : "bg-[var(--background)]/75 border-b border-[var(--border)]/40"
      }`}
    >
      {/* Main Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-10">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center"
          aria-label={t("nav.home")}
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label={t("nav.primaryNavigation")}
        >
          {navLinks.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-serif text-[0.72rem] tracking-[0.24em] uppercase transition-colors ${
                  active
                    ? "text-[var(--gold)] font-bold"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 rounded-sm border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--foreground)] transition hover:border-[var(--gold)]"
              aria-label={t("nav.changeLanguage")}
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span className="font-medium">
                {LANGUAGE_LABELS[language].code}
              </span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-44 rounded-sm border border-[var(--border)] bg-[var(--surface)] py-1 shadow-2xl">
                {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map(
                  (langKey) => (
                    <button
                      key={langKey}
                      type="button"
                      onClick={() => {
                        setLanguage(langKey);
                        setLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition ${
                        language === langKey
                          ? "bg-[var(--gold)]/15 text-[var(--gold)] font-semibold"
                          : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      <span>{LANGUAGE_LABELS[langKey].flag}</span>
                      <span>{LANGUAGE_LABELS[langKey].label}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--gold)] transition hover:border-[var(--gold)] hover:bg-[var(--surface-hover)]"
            aria-label={
              theme === "dark"
                ? t("nav.switchToLightTheme")
                : t("nav.switchToDarkTheme")
            }
            title={theme === "dark" ? t("theme.light") : t("theme.dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => {
              setOpen((previous) => !previous);
              setLangMenuOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center text-[var(--gold)] lg:hidden"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-navigation-drawer"
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      {open && (
        <aside
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.mobileNavigation")}
          className="fixed inset-y-0 left-0 z-[70] flex w-[320px] max-w-[88vw] flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--background)] px-5 pb-7 pt-5 text-[var(--foreground)] shadow-2xl lg:hidden"
        >
          {/* Drawer Header: Logo and Close Button */}
          <div className="mb-8 flex min-h-[52px] items-center justify-between border-b border-[var(--border)] pb-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label={t("nav.home")}
              className="flex min-w-0 items-center"
            >
              <Logo />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.closeMenu")}
              className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--gold)] transition hover:bg-[var(--surface-hover)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="flex flex-col gap-4"
            aria-label={t("nav.mobileNavigation")}
          >
            {/* Brand Heading */}
            <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
              POMS INTERNATIONAL
            </p>

            {/* Main Navigation Links */}
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`border-b border-[var(--border)] pb-3 font-serif text-sm tracking-[0.16em] uppercase transition-colors ${
                  pathname === item.href
                    ? "text-[var(--gold)] font-semibold"
                    : "text-[var(--foreground)] hover:text-[var(--gold)]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Support Section */}
            <div className="my-2 h-px w-full bg-[var(--border)]" />

            <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Information &amp; Support
            </p>

            {supportLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 text-sm tracking-wide text-[var(--foreground-muted)] transition-colors hover:text-[var(--gold)]"
              >
                {item.label}
              </Link>
            ))}

            {/* Admin Portal */}
            <div className="mt-3 border-t border-[var(--border)] pt-5">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)] transition-colors hover:text-[var(--foreground)]"
              >
                {t("nav.adminPortal")}
              </Link>
            </div>
          </nav>
        </aside>
      )}
    </header>
  );
}
