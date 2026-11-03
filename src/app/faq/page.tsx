import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ)",
  description: "Common questions regarding bespoke footwear orders, wholesale freight, payments, and sizing.",
};

const faqs = [
  {
    q: "How does the custom shoe design process work?",
    a: "You submit reference photographs, sketches, or ideas through our Custom Design page. Our artisans review the structure, provide leather options and formal pricing. Once confirmed and the deposit is paid, handcrafted production begins.",
  },
  {
    q: "What is the typical deposit required for custom shoes?",
    a: "The standard production deposit is 50% of the agreed quotation price. Production begins once your deposit is confirmed.",
  },
  {
    q: "What are the wholesale minimum order quantities (MOQ)?",
    a: "Our standard export packaging is 12 or 24 pairs per carton. The minimum order quantity is typically 1 carton (12 pairs) for existing catalogue lines, with custom last developments varying based on complexity.",
  },
  {
    q: "Which currencies are supported for wholesale invoicing?",
    a: "We issue pro-forma quotations in US Dollars (USD), Ethiopian Birr (ETB), Chinese Yuan (CNY), Indian Rupees (INR), and Euros (EUR).",
  },
  {
    q: "How can I verify the authenticity of my POM'S shoes?",
    a: "Every genuine pair has a unique serial identifier on the presentation packaging. You can enter that code on our Authenticity page to confirm registration against our official master database.",
  },
  {
    q: "Where do you ship?",
    a: "We ship domestically within Ethiopia and export internationally across the Middle East, Europe, North America, and Asia via air cargo and ocean container freight.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-24 space-y-12">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-2xl mx-auto space-y-3">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Knowledge Base
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          Frequently Asked Questions
        </h1>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          Answers to common questions about our footwear craftsmanship, bespoke ordering, wholesale shipping, and authenticity.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2"
          >
            <h2 className="font-serif text-lg font-medium text-[var(--foreground)]">
              {item.q}
            </h2>
            <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
