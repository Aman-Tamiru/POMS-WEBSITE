
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Image as ImageIcon,
  Languages,
  Mail,
  Palette,
  Settings,
  ShieldCheck,
} from "lucide-react";

const settingsGroups = [
  {
    title: "Homepage Content",
    description: "Manage homepage sections, headlines, descriptions and visibility.",
    href: "/admin/homepage",
    icon: Globe,
  },
  {
    title: "Website Media",
    description: "Manage uploaded website images and media assets.",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Translations",
    description: "Manage the website's supported languages and translated content.",
    href: "/admin/translations",
    icon: Languages,
  },
  {
    title: "Theme and Appearance",
    description: "Review the existing theme and visual design controls.",
    href: "/admin/theme",
    icon: Palette,
  },
  {
    title: "Customer Messages",
    description: "Access customer communication records.",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Admin Access",
    description: "Review the existing administration and access-control area.",
    href: "/admin/rbac",
    icon: ShieldCheck,
  },
];

export default function WebsiteSettingsClient() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-6 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-7">
        <header>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            POMS International
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Settings className="h-7 w-7 text-[var(--gold)]" />
            <h1 className="font-serif text-3xl">Website Settings</h1>
          </div>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Central access to the website&apos;s existing content, appearance,
          language and administration controls.
          </p>
        </header>

        <section className="border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-serif text-xl">Configuration status</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            The settings control centre is ready. Persistent global settings
            still need to be connected to the verified Supabase schema.
            No settings table has been assumed or created by this page.
          </p>
          <p className="mt-3 text-xs text-[var(--gold)]">
            Existing products, collections and customer records are not modified here.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {settingsGroups.map((group) => {
            const Icon = group.icon;

            return (
              <Link
                key={group.title}
                href={group.href}
                className="group flex items-start gap-4 border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--gold)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--gold)]">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg">
                    {group.title}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-[var(--foreground-muted)]">
                    {group.description}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--gold)]">
                    Open section
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            );
          })}
        </section>

        <div className="border-t border-[var(--border)] pt-5">
          <Link
            href="/admin"
            className="text-sm text-[var(--gold)] hover:underline"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
