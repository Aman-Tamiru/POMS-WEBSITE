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
              <div className="absolute right-0 mt-2 w-36 rounded-sm border border-[var(--border)] bg-[var(--surface)] py-1 shadow-2xl z-50">
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
        <div className="fixed inset-x-0 top-[65px] bottom-0 z-40 bg-[var(--background)]/98 backdrop-blur-xl lg:hidden overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-6" aria-label={t("nav.mobileNavigation")}>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-serif text-xl tracking-[0.2em] text-[var(--foreground)] uppercase transition hover:text-[var(--gold)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-4 h-px w-full bg-[var(--border)]" />
            <Link
              href="/size-guide"
              className="text-sm tracking-widest uppercase text-[var(--foreground-muted)] hover:text-[var(--gold)]"
            >
              {t("nav.sizeGuide")}
            </Link>
            <Link
              href="/about"
              className="text-sm tracking-widest uppercase text-[var(--foreground-muted)] hover:text-[var(--gold)]"
            >
              {t("nav.about")}
            </Link>
            <Link
              href="/contact"
              className="text-sm tracking-widest uppercase text-[var(--foreground-muted)] hover:text-[var(--gold)]"
            >
              {t("nav.contact")}
            </Link>
            <div className="mt-6 pt-4 border-t border-[var(--border)]">
              <Link
                href="/admin"
                className="text-xs uppercase tracking-widest text-[var(--gold)]/70 hover:text-[var(--gold)]"
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
