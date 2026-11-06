"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage, LANGUAGE_LABELS, SupportedLanguage } from "@/components/LanguageProvider";
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

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/collection", label: t("nav.collection") },
    { href: "/catalogue", label: t("nav.catalogue") },
    { href: "/custom-design", label: t("nav.customDesign") },
    { href: "/wholesale", label: t("nav.wholesale") },
    { href: "/authenticity", label: t("nav.authenticity") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-[var(--background)]/95 shadow-md backdrop-blur-md border-b border-[var(--border)]"
          : "bg-[var(--background)]/75 backdrop-blur-sm border-b border-[var(--border)]/40"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-10">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center" aria-label={t("nav.home")}>
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label={t("nav.primaryNavigation")}>
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

        {/* Header Controls: Theme & Language */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 rounded-sm border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--foreground)] transition hover:border-[var(--gold)]"
              aria-label={t("nav.changeLanguage")}
            >
              <Globe className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span className="font-medium">{LANGUAGE_LABELS[language].code}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-sm border border-[var(--border)] bg-[var(--surface)] py-1 shadow-2xl z-50">
                {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((langKey) => (
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
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--gold)] transition hover:border-[var(--gold)] hover:bg-[var(--surface-hover)]"
            aria-label={theme === "dark" ? t("nav.switchToLightTheme") : t("nav.switchToDarkTheme")}
            title={theme === "dark" ? t("theme.light") : t("theme.dark")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center text-[var(--gold)] lg:hidden"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

            
      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="fixed inset-x-0 top-[65px] bottom-0 z-40 overflow-y-auto overscroll-contain bg-[var(--background)] px-6 py-6 backdrop-blur-xl lg:hidden">
          <nav
            className="mx-auto flex max-w-xl flex-col gap-5 pb-10"
            aria-label={t("nav.mobileNavigation")}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
              POMS INTERNATIONAL
            </p>

            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`border-b border-[var(--border)] pb-4 font-serif text-lg tracking-widest uppercase transition-colors ${
                  pathname === item.href
                    ? "text-[var(--gold)]"
                    : "text-[var(--foreground)] hover:text-[var(--gold)]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px w-full bg-[var(--border)]" />

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Information & Support
            </p>

            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/size-guide", label: "Size Guide" },
              { href: "/shipping", label: "Shipping & Customs" },
              { href: "/faq", label: "Frequently Asked Questions" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms & Conditions" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm tracking-wider text-[var(--foreground-muted)] transition-colors hover:text-[var(--gold)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 border-t border-[var(--border)] pt-5">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)]"
              >
                {t("nav.adminPortal")}
              </Link>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}
