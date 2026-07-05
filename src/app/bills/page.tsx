import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG, CATEGORIES } from "@/config/catalog";

export const metadata: Metadata = {
  title: "All Bill & Invoice Generators",
  description: "Browse all 22+ bill, invoice and receipt generators — fuel, rent, GST, restaurant, hotel, medical and more.",
};

export default function BillsPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-section to-white py-14">
        <div className="container-bg text-center">
          <span className="section-eyebrow">22+ Generators</span>
          <h1 className="section-title">All bill & receipt generators</h1>
          <p className="section-sub">
            Pick a template, fill in the details, and download a professional PDF in seconds.
            No login required to generate.
          </p>
        </div>
      </section>

      <div className="container-bg space-y-12 pb-16">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink">
              <span className="h-5 w-1.5 rounded-full bg-brand" />
              {cat}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {CATALOG.filter((c) => c.category === cat).map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="group relative flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-white">
                    <i className={`fa-solid ${c.icon}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-bold text-ink">
                      {c.name}
                      {c.ready && <span className="rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-bold text-success">LIVE</span>}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-inkSoft">{c.blurb}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
