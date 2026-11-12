
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  const collectionLinks = [
    { href: "/collection", label: t("nav.collection") },
    { href: "/catalogue", label: t("nav.catalogue") },
    { href: "/custom-design", label: t("nav.customDesign") },
    { href: "/wholesale", label: t("nav.wholesale") },
    { href: "/authenticity", label: t("nav.authenticity") },
  ];

  const supportLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/size-guide", label: t("nav.sizeGuide") },
    { href: "/shipping", label: t("footer.shippingCustoms") },
    { href: "/faq", label: t("footer.faq") },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)]">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-14">

        <div className="grid grid-cols-2 gap-x-7 gap-y-10 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <Logo />

            <p className="max-w-xs font-serif text-sm italic leading-7 text-[var(--foreground-muted)]">
              {t("footer.brandTagline")}
            </p>

            <div className="space-y-2 pt-2 text-xs text-[var(--foreground-muted)]">
              <p>{t("footer.manufacturing")}</p>

              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                {t("footer.location")}
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 pt-2 text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] transition hover:text-[var(--foreground)]"
            >
              Discover our story
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Collections and Shopping */}
          <div>
            <h3 className="mb-5 font-serif text-xs uppercase tracking-[0.22em] text-[var(--gold)]">
              {t("nav.collection")}
            </h3>

            <ul className="space-y-3">
              {collectionLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs leading-5 text-[var(--foreground-muted)] transition hover:text-[var(--gold)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Assistance */}
          <div>
            <h3 className="mb-5 font-serif text-xs uppercase tracking-[0.22em] text-[var(--gold)]">
              {t("footer.assistanceFit")}
            </h3>

            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs leading-5 text-[var(--foreground-muted)] transition hover:text-[var(--gold)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <h3 className="font-serif text-xs uppercase tracking-[0.22em] text-[var(--gold)]">
              {t("footer.globalCommunications")}
            </h3>

            <p className="text-xs leading-6 text-[var(--foreground-muted)]">
              {t("footer.wholesaleInquiries")}
            </p>

            <a
              href="tel:+251920237030"
              className="flex items-center gap-3 text-sm text-[var(--foreground)] transition hover:text-[var(--gold)]"
            >
              <Phone className="h-4 w-4 text-[var(--gold)]" />
              +251 920 237 030
            </a>

            <p className="text-xs leading-6 text-[var(--foreground-muted)]">
              {t("footer.whatsappExport")}
            </p>

            <Link
              href="/custom-design"
              className="btn-gold-outline inline-flex items-center gap-2 px-4 py-3 text-[9px] uppercase tracking-[0.15em]"
            >
              {t("footer.startCustomOrder")}
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Global Contact and Legal Bar */}
        <div className="mt-12 flex flex-col gap-5 border-t border-[var(--border)]/60 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] leading-5 text-[var(--foreground-muted)]">
            {t("footer.copyright")}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] text-[var(--foreground-muted)]">

            <Link
              href="/privacy"
              className="transition hover:text-[var(--gold)]"
            >
              {t("footer.privacyPolicy")}
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[var(--gold)]"
            >
              {t("footer.termsConditions")}
            </Link>

            <Link
              href="/admin"
              title={t("footer.restrictedStaffTitle")}
              className="transition hover:text-[var(--gold)]"
            >
              {t("footer.adminLink")}
            </Link>
          </div>
        </div>

        {/* Brand Signature */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)]/40 pt-6 text-center sm:flex-row sm:text-left">
          <span className="font-serif text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
            POM&apos;S INTERNATIONAL
          </span>

          <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
            Addis Ababa · Ethiopia
          </span>
        </div>
      </div>
    </footer>
  );
}
