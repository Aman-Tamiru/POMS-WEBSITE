
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import PomsMegaMenu from "@/components/navigation/PomsMegaMenu";
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

        
     {/* Premium Desktop Navigation */}
<nav
  className="hidden items-center gap-7 lg:flex"
  aria-label={t("nav.primaryNavigation")}
>
  <Link
    href="/"
    className={`font-serif text-[0.72rem] tracking-[0.2em] uppercase transition-colors ${
      pathname === "/"
        ? "font-bold text-[var(--gold)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--gold)]"
    }`}
  >
    {t("nav.home")}
  </Link>

  <Link
    href="/collection"
    className={`font-serif text-[0.72rem] tracking-[0.2em] uppercase transition-colors ${
      pathname === "/collection"
        ? "font-bold text-[var(--gold)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--gold)]"
    }`}
  >
    {t("nav.collection")}
  </Link>
  <Link
  href="/catalogue"
  className={`font-serif text-[0.72rem] tracking-[0.2em] uppercase transition-colors ${
    pathname === "/catalogue"
      ? "font-bold text-[var(--gold)]"
      : "text-[var(--foreground-muted)] hover:text-[var(--gold)]"
  }`}
>
  {t("nav.catalogue")}
</Link>
  <Link
    href="/custom-design"
    className={`font-serif text-[0.72rem] tracking-[0.2em] uppercase transition-colors ${
      pathname === "/custom-design"
        ? "font-bold text-[var(--gold)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--gold)]"
    }`}
  >
    {t("nav.customDesign")}
  </Link>

  <Link
    href="/wholesale"
    className={`font-serif text-[0.72rem] tracking-[0.2em] uppercase transition-colors ${
      pathname === "/wholesale"
        ? "font-bold text-[var(--gold)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--gold)]"
    }`}
  >
    {t("nav.wholesale")}
  </Link>

  <Link
    href="/authenticity"
    className={`font-serif text-[0.72rem] tracking-[0.2em] uppercase transition-colors ${
      pathname === "/authenticity"
        ? "font-bold text-[var(--gold)]"
        : "text-[var(--foreground-muted)] hover:text-[var(--gold)]"
    }`}
  >
    {t("nav.authenticity")}
  </Link>

  <PomsMegaMenu />
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
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Premium Half-Width Mobile Drawer */}
      {open && (
        <aside
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.mobileNavigation")}
          className="fixed inset-y-0 left-0 z-[70] flex w-1/2 min-w-[180px] max-w-[420px] flex-col overflow-y-auto border-r border-[var(--gold)]/25 bg-[var(--background)] px-4 pb-6 pt-5 text-[var(--foreground)] shadow-2xl lg:hidden"
        >
          {/* Drawer Branding */}
          <div className="mb-6 flex items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label={t("nav.home")}
              className="min-w-0"
            >
              <Logo className="h-9 w-auto max-w-full" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.closeMenu")}
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--gold)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col"
            aria-label={t("nav.mobileNavigation")}
          >
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.17em] text-[var(--gold)]">
              POMS INTERNATIONAL
            </p>

            {navLinks.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`border-b border-[var(--border)] py-3 text-[10px] font-medium leading-5 tracking-[0.08em] uppercase transition-colors ${
                  pathname === item.href
                    ? "text-[var(--gold)]"
                    : "text-[var(--foreground)] hover:text-[var(--gold)]"
                }`}
              >
                <span className="mb-1 block text-[8px] tracking-widest text-[var(--foreground-muted)]">
                  0{index + 1}
                </span>
                {item.label}
              </Link>
            ))}

            <div className="my-5 h-px bg-[var(--border)]" />

            <p className="mb-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">
              Information
            </p>

            {supportLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-[9px] leading-4 text-[var(--foreground-muted)] transition-colors hover:text-[var(--gold)]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-auto border-t border-[var(--border)] pt-5">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-[9px] font-medium uppercase tracking-widest text-[var(--gold)]/80 hover:text-[var(--gold)]"
              >
                Admin Portal
              </Link>
            </div>
          </nav>
        </aside>
      )}

    </header>
  );
}
