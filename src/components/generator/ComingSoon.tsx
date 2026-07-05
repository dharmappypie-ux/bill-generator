import Link from "next/link";
import { CatalogItem, READY } from "@/config/catalog";

export default function ComingSoon({ item }: { item: CatalogItem }) {
  return (
    <div className="container-bg py-16">
      <nav className="mb-6 text-xs text-placeholderGray">
        <Link href="/" className="hover:text-brand">Home</Link> /{" "}
        <Link href="/bills" className="hover:text-brand">Bills</Link> /{" "}
        <span className="text-ink">{item.name}</span>
      </nav>

      <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand">
          <i className={`fa-solid ${item.icon}`} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink">{item.name} Generator</h1>
        <p className="mt-2 text-sm text-inkSoft">{item.blurb}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-700">
          <i className="fa-solid fa-screwdriver-wrench" /> This generator is being set up
        </div>
        <p className="mx-auto mt-5 max-w-md text-sm text-inkSoft">
          The {item.name.toLowerCase()} generator is part of our 22+ template library. In the
          meantime, try our fully-featured live generators below.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {READY.map((r) => (
            <Link key={r.slug} href={`/${r.slug}`} className="btn-primary !py-2.5">
              <i className={`fa-solid ${r.icon}`} /> {r.name}
            </Link>
          ))}
          <Link href="/bills" className="btn-outline !py-2.5">All generators</Link>
        </div>
      </div>
    </div>
  );
}
