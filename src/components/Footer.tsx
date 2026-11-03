"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo />
            <p className="mt-3 font-serif text-sm italic leading-relaxed text-[var(--foreground-muted)]">
              {t("footer.brandTagline")}
            </p>
            <div className="pt-2 text-xs text-[var(--foreground-muted)] space-y-1">
              <p>Footwear Manufacturing &amp; Wholesale Export</p>
              <p>Addis Ababa, Ethiopia · Global Distribution</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="font-serif text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              {t("nav.collection")}
            </p>
            <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/collection" className="hover:text-[var(--gold)] transition">
                  {t("nav.collection")}
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-[var(--gold)] transition">
                  {t("nav.catalogue")}
                </Link>
              </li>
              <li>
                <Link href="/custom-design" className="hover:text-[var(--gold)] transition">
                  {t("nav.customDesign")}
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-[var(--gold)] transition">
                  {t("nav.wholesale")}
                </Link>
              </li>
              <li>
                <Link href="/authenticity" className="hover:text-[var(--gold)] transition">
                  {t("nav.authenticity")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Sizing */}
          <div className="space-y-3">
            <p className="font-serif text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              Assistance &amp; Fit
            </p>
            <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/size-guide" className="hover:text-[var(--gold)] transition">
                  {t("nav.sizeGuide")}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-[var(--gold)] transition">
                  Shipping &amp; Customs
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--gold)] transition">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--gold)] transition">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--gold)] transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <p className="font-serif text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
              Global Communications
            </p>
            <div className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <p>Direct Wholesale &amp; Inquiries:</p>
              <p className="font-medium text-[var(--gold)]">+251 920 237 030</p>
              <p>WhatsApp &amp; Export Desk Available</p>
              <div className="pt-2">
                <Link
                  href="/custom-design"
                  className="btn-gold-outline text-[0.65rem] py-2 px-4 inline-flex"
                >
                  Start Custom Order
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with discreet Admin link */}
        <div className="mt-14 pt-8 border-t border-[var(--border)]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground-muted)]">
          <p>{t("footer.copyright")}</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--gold)] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--gold)] transition">
              Terms &amp; Conditions
            </Link>
            {/* Discreet Admin Portal link */}
            <Link
              href="/admin"
              className="text-[var(--gold)]/60 hover:text-[var(--gold)] transition"
              title="Restricted Staff Operating System"
            >
              {t("footer.adminLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
