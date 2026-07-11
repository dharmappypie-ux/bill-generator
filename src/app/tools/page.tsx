import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES, toolsByCategory } from "@/config/tools";

export const metadata: Metadata = {
  title: "54 Free Tools — Tax, GST, Salary & Business Calculators",
  description:
    "54 free online calculators for India: GST, income tax, salary, HR, restaurant and business tools. No sign-up, instant results.",
};

export default function ToolsPage() {
  return (
    <div className="container-bg py-12 sm:py-16">
      <p className="section-eyebrow">Free Tools</p>
      <h1 className="section-title">
        {TOOLS.length} Free Calculators & Tools
      </h1>
      <p className="section-sub">
        Tax, GST, salary, HR and restaurant tools built for India. Free forever —
        no sign-up, no downloads, instant results.
      </p>

      {TOOL_CATEGORIES.map((cat) => {
        const items = toolsByCategory(cat);
        if (!items.length) return null;
        return (
          <section key={cat} className="mt-12">
            <h2 className="mb-5 flex items-center gap-3 text-xl font-extrabold text-ink">
              {cat}
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                {items.length}
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group rounded-2xl border border-line bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                >
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand group-hover:text-white">
                    <i className={`fa-solid ${t.icon}`} />
                  </div>
                  <p className="text-[15px] font-bold text-ink group-hover:text-brand-700">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-inkSoft">
                    {t.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
