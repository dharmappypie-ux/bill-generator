import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Bill Generator team — chat, email or phone support, 24/7.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-section to-white py-14">
        <div className="container-bg text-center">
          <span className="section-eyebrow">We&apos;re here to help</span>
          <h1 className="section-title">Contact us</h1>
          <p className="section-sub">Questions, feedback or partnership ideas? Reach out — we usually reply within a few hours.</p>
        </div>
      </section>

      <div className="container-bg grid gap-8 pb-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { i: "fa-envelope", t: "Email", v: "support@billgenerator.local" },
            { i: "fa-phone", t: "Phone", v: "+91 00000 00000" },
            { i: "fa-comments", t: "Live chat", v: "24/7 in-app chat & WhatsApp" },
            { i: "fa-location-dot", t: "Office", v: "Digitrix Agency, India" },
          ].map((c) => (
            <div key={c.t} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand">
                <i className={`fa-solid ${c.i}`} />
              </span>
              <div>
                <p className="font-bold text-ink">{c.t}</p>
                <p className="text-sm text-inkSoft">{c.v}</p>
              </div>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
