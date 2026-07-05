import type { Metadata } from "next";
import PricingSection from "@/components/home/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — Unlimited Bills & Receipts",
  description: "Affordable plans for unlimited bill generation. Quarterly, yearly and lifetime options with all 22+ generators and templates.",
};

export default function PricingPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-section to-white py-14">
        <div className="container-bg text-center">
          <span className="section-eyebrow">Pricing</span>
          <h1 className="section-title">Generate for free. Upgrade for unlimited.</h1>
          <p className="section-sub">
            Create and download bills for free. Go unlimited with a plan that fits you — cancel anytime.
          </p>
        </div>
      </section>

      <PricingSection />

      <section className="container-bg pb-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-section p-8 text-center">
          <h2 className="text-lg font-extrabold text-ink">Have a coupon?</h2>
          <p className="mt-1 text-sm text-inkSoft">
            Apply it on any plan above. Try <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand">WELCOME10</code>,{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand">SAVE20</code> or{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-brand">BILL50</code> at checkout.
          </p>
        </div>
      </section>
    </div>
  );
}
