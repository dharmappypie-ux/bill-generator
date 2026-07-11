import Link from "next/link";
import Logo from "./Logo";
import { CATALOG } from "@/config/catalog";

export default function Footer() {
  const year = 2026;
  const popular = CATALOG.slice(0, 12);

  return (
    <footer className="mt-24 bg-[#0f1230] text-white/80">
      <div className="container-bg grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Create professional bills, invoices and receipts online in minutes — no design skills
            needed. 22+ generators, multiple templates, themes and currencies, instant PDF & email.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { i: "fa-facebook-f", h: "#" },
              { i: "fa-x-twitter", h: "#" },
              { i: "fa-instagram", h: "#" },
              { i: "fa-linkedin-in", h: "#" },
              { i: "fa-youtube", h: "#" },
            ].map((s) => (
              <a key={s.i} href={s.h} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-brand" aria-label="social">
                <i className={`fa-brands ${s.i}`} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Popular Bills</h4>
          <ul className="space-y-2 text-sm">
            {popular.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-white/60 transition hover:text-brand-200">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Home"],
              ["/bills", "All Generators"],
              ["/tools", "Free Tools"],
              ["/pricing", "Pricing"],
              ["/contact", "Contact Us"],
              ["/dashboard", "My Bills"],
            ].map(([h, l]) => (
              <li key={h}><Link href={h} className="text-white/60 transition hover:text-brand-200">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/legal/privacy", "Privacy Policy"],
              ["/legal/terms", "Terms of Service"],
              ["/legal/refund", "Refund Policy"],
              ["/legal/disclaimer", "Disclaimer"],
            ].map(([h, l]) => (
              <li key={h}><Link href={h} className="text-white/60 transition hover:text-brand-200">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-bg flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {year} Bill Generator. All rights reserved.</p>
          <p>
            Crafted by <span className="font-semibold text-white/70">Digitrix Agency</span>. For documentation/demo use only — not for fraudulent or unlawful purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
