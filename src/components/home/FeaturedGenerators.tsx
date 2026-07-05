import Link from "next/link";
import { POPULAR } from "@/config/catalog";

export default function FeaturedGenerators() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-bg">
        <p className="section-eyebrow">Popular generators</p>
        <h2 className="section-title">Most-used bill &amp; receipt makers</h2>
        <p className="section-sub">
          Jump straight into the generators people reach for the most — each one is
          pre-formatted and ready to fill in.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="group relative flex flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
            >
              {item.ready && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Live
                </span>
              )}

              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-xl text-brand-600 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <i className={`fa-solid ${item.icon}`} />
              </span>

              <h3 className="mt-4 flex items-center gap-2 text-base font-bold text-ink">
                {item.name}
              </h3>
              {item.blurb && (
                <p className="mt-1.5 text-sm leading-relaxed text-inkSoft">{item.blurb}</p>
              )}

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigoBtn">
                Create now
                <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/bills" className="btn-outline">
            <i className="fa-solid fa-grip" />
            View all 22+ generators
          </Link>
        </div>
      </div>
    </section>
  );
}
