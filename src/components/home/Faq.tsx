"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Do I need an account to use Bill Generator?",
    a: "No account is needed to generate a bill — start for free and download right away. You only need to sign in if you want to save your bills and access them later.",
  },
  {
    q: "Does it save my bills?",
    a: "Yes. When you're signed in, every bill you create is stored securely and synced across all your devices, so you can revisit, duplicate or re-download them any time.",
  },
  {
    q: "What bill types are available?",
    a: "There are 22+ generators including fuel bills, rent receipts, GST invoices, restaurant bills, hotel invoices, medical, school and donation receipts — and we keep adding more.",
  },
  {
    q: "Can I add my own logo?",
    a: "Absolutely. You can upload your business logo, choose from multiple themes and currencies, and customize the layout so every document matches your brand.",
  },
  {
    q: "Is it free?",
    a: "Generating and downloading bills is free. Paid plans unlock unlimited bills, saved history across devices, priority support and advanced customization options.",
  },
  {
    q: "Is this legal to use?",
    a: "Bill Generator is intended for legitimate documentation, record-keeping and demonstration purposes only. It must never be used to create fraudulent or misleading documents.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-20">
      <div className="container-bg">
        <p className="section-eyebrow">FAQ</p>
        <h2 className="section-title">Frequently asked questions</h2>
        <p className="section-sub">
          Everything you might want to know before you create your first bill.
        </p>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-200 ${
                  isOpen ? "border-brand-200 shadow-soft" : "border-line"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[15px] font-bold text-ink">{item.q}</span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-brand text-white"
                        : "bg-brand-50 text-brand-600"
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down text-xs" />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-inkSoft">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
