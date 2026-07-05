"use client";
import { useState } from "react";
import { GeneratorConfig } from "@/types/generator";

/** Per-generator FAQ accordion (rendered at the bottom of every generator page). */
export default function GeneratorFaq({ config }: { config: GeneratorConfig }) {
  const name = config.name;
  const lower = name.toLowerCase();

  const items: { q: string; a: string }[] = [
    {
      q: `Do I need an account to create a ${lower}?`,
      a: "No. You can generate and download your bill for free without creating an account — it's a hassle-free process. Signing in is only needed if you want to save and sync your bills across devices.",
    },
    {
      q: `Can I save my ${lower} details?`,
      a: "Yes. Sign in (with email + password, a one-time email code, or Google), then click Save. Your saved bills appear under “My Bills” and are available on any device you log in from.",
    },
    {
      q: `Are there any fees for creating a ${lower}?`,
      a: "Generating and downloading bills is free. Optional paid plans (₹299 / ₹999 / ₹1999) unlock unlimited saves, all templates and priority support.",
    },
    {
      q: "Is my data safe?",
      a: "Your bill is rendered right in your browser. We only store the bills you explicitly choose to save, tied to your account. We never sell your data.",
    },
    {
      q: `How do I receive the generated ${lower}?`,
      a: "Instantly — use the toolbar under the live preview to Download a PDF, Email it as an attachment, or Print just the receipt.",
    },
    {
      q: `Can I customize the ${lower}?`,
      a: `Yes — choose from ${config.templates.length} template${config.templates.length === 1 ? "" : "s"}, 27 currencies${
        config.hasThemes ? ", 17 paper themes" : ""
      }, edit every field, and watch the live preview update as you type.`,
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-section py-14">
      <div className="container-bg max-w-3xl">
        <div className="mb-8 text-center">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title">If you got questions, we have answers</h2>
          <p className="section-sub">Everything about creating your {lower} online.</p>
        </div>

        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="overflow-hidden rounded-xl border border-line bg-white shadow-soft">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-ink">{it.q}</span>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand text-white transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <i className="fa-solid fa-chevron-down text-xs" />
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-[15px] leading-relaxed text-inkSoft">{it.a}</p>
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
