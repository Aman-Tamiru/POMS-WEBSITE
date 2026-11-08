"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  Layers,
  MessageSquare,
  FileSpreadsheet,
  Palette,
  Globe,
  Settings,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  Users,
  Compass,
  FileText,
  Sliders,
  Activity,
  Plus,
  Camera,
  Send,
  Eye,
  LogOut,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

const handleLogout = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Unable to sign out. Please try again.");
    return;
  }

  router.replace("/admin/login");
  router.refresh();
};
  const [activeTab, setActiveTab] = useState<string>("overview");

  // KPI Metrics for mobile dashboard
  const metrics = [
    { label: "Active Inquiries", val: "4 New", icon: Compass, alert: true },
    { label: "Unread Messages", val: "7 Live", icon: MessageSquare, alert: true },
    { label: "Pending Quotes", val: "3 Drafts", icon: FileSpreadsheet, alert: false },
    { label: "In Production", val: "12 Orders", icon: Package, alert: false },
  ];

  // The 19 Administrative Sections
  const adminSections = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, cat: "Core" },
    { id: "homepage", label: "Homepage Editor", icon: Eye, cat: "Content" },
    { id: "products", label: "Product Manager", icon: Package, cat: "Catalogue" },
    { id: "collections", label: "Collection Manager", icon: Layers, cat: "Catalogue" },
    { id: "media", label: "Media Library", icon: ImageIcon, cat: "Assets" },
    { id: "designs", label: "Custom Design Inquiries", icon: Compass, cat: "Sales" },
    { id: "messages", label: "Customer Messages", icon: MessageSquare, cat: "Sales" },
    { id: "customers", label: "Customer Directory", icon: Users, cat: "Sales" },
    { id: "quotations", label: "Quotations (5 Currencies)", icon: FileSpreadsheet, cat: "Sales" },
    { id: "orders", label: "Order Production Tracker", icon: FileText, cat: "Sales" },
    { id: "translations", label: "Translation Matrix (5 Langs)", icon: Globe, cat: "Content" },
    { id: "layout", label: "Catalogue Layout Editor", icon: Sliders, cat: "Content" },
    { id: "theme", label: "Theme & Styling Tokens", icon: Palette, cat: "Settings" },
    { id: "wholesale", label: "Wholesale & Carton Rules", icon: Package, cat: "Settings" },
    { id: "shipping", label: "Shipping & Customs Rules", icon: Settings, cat: "Settings" },
    { id: "authenticity", label: "Authenticity Code Generator", icon: ShieldCheck, cat: "Security" },
    { id: "staff", label: "Staff & Permissions (RBAC)", icon: Users, cat: "Security" },
    { id: "logs", label: "Audit & Activity Logs", icon: Activity, cat: "Security" },
    { id: "settings", label: "Website Settings", icon: Settings, cat: "Settings" },
  ];
  const adminRoutes: Record<string, string> = {
    homepage: "/admin/homepage",
    products: "/admin/products",
    collections: "/admin/collections",
    media: "/admin/media",
    designs: "/admin/inquiries",
    messages: "/admin/messages",
    quotations: "/admin/quotations",
    orders: "/admin/orders",
    settings: "/admin/settings",
  };
  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--foreground)]">
      {/* Mobile-Friendly Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[var(--gold)] text-black font-serif font-bold flex items-center justify-center text-sm">
            P
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold tracking-wider text-[var(--gold)]">
              POM&apos;S OS
            </h1>
            <p className="text-[10px] text-[var(--foreground-muted)]">Owner / Android Console</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--foreground)] hover:border-[var(--gold)]"
          >
            <Eye className="h-3 w-3 text-[var(--gold)]" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>
          <button
  type="button"
  onClick={handleLogout}
  className="flex items-center gap-1 border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--foreground-muted)] hover:text-red-400"
  aria-label="Sign out"
  title="Sign out"
>
  <LogOut className="h-3 w-3" />
</button>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-8">
        {/* Quick Android Actions Tray */}
        <section className="space-y-2">
          <p className="font-serif text-[11px] uppercase tracking-widest text-[var(--gold)]">
            Quick Mobile Actions
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => router.push("/admin/products")}
              className="flex flex-col items-center justify-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] p-3.5 text-center active:scale-95 transition hover:border-[var(--gold)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium">Add Product</span>
            </button>

            <button
              onClick={() => router.push("/admin/products")}
              className="flex flex-col items-center justify-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] p-3.5 text-center active:scale-95 transition hover:border-[var(--gold)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                <Camera className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium">Upload Photo</span>
            </button>

            <button
              onClick={() => alert("Quick Customer Reply: Loading active WhatsApp & In-App threads")}
              className="flex flex-col items-center justify-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] p-3.5 text-center active:scale-95 transition hover:border-[var(--gold)]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
                <Send className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium">Quick Reply</span>
            </button>
          </div>
        </section>

        {/* Real-Time Business KPI Metric Cards */}
        <section className="space-y-2">
          <p className="font-serif text-[11px] uppercase tracking-widest text-[var(--gold)]">
            Live Business Status
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1 relative overflow-hidden"
                >
                  {m.alert && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" />
                  )}
                  <Icon className="h-4 w-4 text-[var(--gold)]" />
                  <p className="font-serif text-lg font-bold text-[var(--foreground)]">{m.val}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">{m.label}</p>
                </div>
              );
            })}
          </div>
        </section>

               {/* The 19 Administrative Sections Grid */}
               <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <p className="font-serif text-xs uppercase tracking-widest text-[var(--gold)]">
              Administrative Control Centers (19 Modules)
            </p>
            <span className="text-[10px] text-[var(--foreground-muted)]">
              Full Android Access
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {adminSections.map((sec) => {
              const Icon = sec.icon;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    const route = adminRoutes[sec.id];

                    if (route) {
                      router.push(route);
                      return;
                    }

                    if (sec.id === "dashboard") {
                      router.push("/admin");
                      return;
                    }

                    alert(`${sec.label} is not connected yet.`);
                  }}
                  className="flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] p-3.5 text-left transition hover:border-[var(--gold)] hover:bg-[var(--surface-hover)] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--gold)]">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[var(--foreground)]">
                        {sec.label}
                      </p>
                      <p className="text-[10px] text-[var(--foreground-muted)]">
                        {sec.cat}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-[var(--gold)]">→</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Activity Log Snapshot */}
        <section className="border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-semibold text-[var(--foreground)]">
              Recent Administrative Activity
            </h3>
            <span className="text-[10px] text-[var(--gold)]">
              Database Synced
            </span>
          </div>

          <div className="space-y-2 text-xs text-[var(--foreground-muted)] divide-y divide-[var(--border)]/40">
            <div className="pt-2 flex justify-between">
              <span>Owner Bootstrap Initialized</span>
              <span className="font-mono text-[10px]">Just now</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span>Homepage Layout Verified (5 sections active)</span>
              <span className="font-mono text-[10px]">Today</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span>Multilingual Dictionaries Loaded (EN, AM, ZH, HI, ES)</span>
              <span className="font-mono text-[10px]">Today</span>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)]/98 backdrop-blur-xl px-4 py-2 flex items-center justify-around text-center text-[10px] text-[var(--foreground-muted)]">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "overview" ? "text-[var(--gold)] font-bold" : ""
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("products");
            router.push("/admin/products");
          }}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "products" ? "text-[var(--gold)] font-bold" : ""
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Catalogue</span>
        </button>

        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex flex-col items-center gap-1 relative ${
            activeTab === "inbox" ? "text-[var(--gold)] font-bold" : ""
          }`}
        >
          <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-[var(--gold)]" />
          <MessageSquare className="h-4 w-4" />
          <span>Messages</span>
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "quotes" ? "text-[var(--gold)] font-bold" : ""
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Quotes</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center gap-1 ${
            activeTab === "settings" ? "text-[var(--gold)] font-bold" : ""
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}