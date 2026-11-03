"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 md:px-10 lg:py-24 space-y-16">
      <div className="border-b border-[var(--border)] pb-8 text-center max-w-2xl mx-auto space-y-3">
        <p className="font-serif text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Direct Dialogue
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--foreground)]">
          Contact POM&apos;S
        </h1>
        <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
          Whether you have an inquiry regarding custom bespoke footwear, international wholesale cartons, or order status, our team is at your disposal.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        {/* Contact Coordinates */}
        <div className="space-y-8">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
            <h2 className="font-serif text-xl text-[var(--foreground)]">Direct Channels</h2>

            <div className="flex items-start gap-4 text-xs">
              <Phone className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--foreground-muted)] uppercase tracking-wider">Phone &amp; WhatsApp</p>
                <p className="font-serif text-base font-medium text-[var(--gold)] mt-0.5">+251 920 237 030</p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Mon–Sat, 8:00 AM – 7:00 PM (EAT)</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-xs">
              <Mail className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--foreground-muted)] uppercase tracking-wider">Official Inquiries</p>
                <p className="font-serif text-base font-medium text-[var(--foreground)] mt-0.5">inquiries@poms-shoes.com</p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-xs">
              <MapPin className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--foreground-muted)] uppercase tracking-wider">Workshop &amp; Export Office</p>
                <p className="font-serif text-base font-medium text-[var(--foreground)] mt-0.5">Addis Ababa, Ethiopia</p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">Around Mesalemiya Footwear District</p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/251920237030"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 border border-green-700 bg-green-950/30 p-4 text-xs font-semibold text-green-300 hover:bg-green-900/40 transition"
          >
            <MessageSquare className="h-4 w-4" />
            Connect via WhatsApp Live Desk
          </a>
        </div>

        {/* Contact Form */}
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-[var(--gold)] mx-auto" />
              <h3 className="font-serif text-2xl text-[var(--foreground)]">Message Received</h3>
              <p className="text-xs text-[var(--foreground-muted)] max-w-sm mx-auto">
                Thank you for reaching out. We have logged your communication and will reply promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-gold-outline text-xs mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-serif text-2xl text-[var(--foreground)]">Send a Message</h2>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Full Name <span className="text-[var(--gold)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                    Email Address <span className="text-[var(--gold)]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+251 ..."
                    className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Subject Category
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                >
                  <option value="General Inquiry">General Footwear Inquiry</option>
                  <option value="Custom Footwear">Custom Footwear &amp; Fitting</option>
                  <option value="Wholesale Export">Wholesale &amp; Bulk Export</option>
                  <option value="Authenticity Check">Authenticity Verification Assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--foreground)] mb-1 font-medium">
                  Your Message <span className="text-[var(--gold)]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How may our footwear team assist you?..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <button type="submit" className="btn-gold w-full text-xs">
                Transmit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
