import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "POM'S | Luxury International Footwear & Wholesale",
    template: "%s | POM'S Footwear",
  },
  description:
    "POM'S International Footwear — Luxury women's shoes, bespoke made-to-order footwear design, and international wholesale export. Handcrafted excellence.",
  openGraph: {
    title: "POM'S | Luxury International Footwear",
    description: "Bespoke handcrafted women's shoes and international wholesale collections.",
    type: "website",
    siteName: "POM'S Footwear",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased flex flex-col selection:bg-[var(--gold)] selection:text-black">
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main className="flex-1 pt-[65px]">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
