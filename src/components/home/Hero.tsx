import Link from "next/link";

const TRUST = [
  { icon: "fa-circle-check", label: "No login required" },
  { icon: "fa-layer-group", label: "22+ templates" },
  { icon: "fa-coins", label: "27 currencies" },
  { icon: "fa-file-pdf", label: "Instant PDF" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-section via-white to-white">
      {/* Decorative brand blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-32 h-80 w-80 rounded-full bg-indigoBtn/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container-bg relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        {/* Copy column */}
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
            <i className="fa-solid fa-bolt" />
            Free Online Bill Generator
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Create professional{" "}
            <span className="bg-gradient-to-r from-brand-600 via-brand to-indigoBtn bg-clip-text text-transparent">
              bills, invoices &amp; receipts
            </span>{" "}
            in minutes
          </h1>

          <p className="section-sub mx-auto mt-5 max-w-xl text-base lg:mx-0 lg:text-left">
            Pick from 22+ ready-made generators, fill in your details, and download a
            polished PDF or send it by email instantly. No login, no software, no
            watermarks &mdash; just clean documents in seconds.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
            <Link href="/fuel-bill" className="btn-accent w-full sm:w-auto">
              <i className="fa-solid fa-file-invoice" />
              Create a Bill
            </Link>
            <Link href="/bills" className="btn-ghost w-full sm:w-auto">
              <i className="fa-solid fa-grip" />
              Browse all generators
            </Link>
          </div>

          {/* Trust chips */}
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
            {TRUST.map((t) => (
              <li key={t.label} className="chip">
                <i className={`fa-solid ${t.icon}`} />
                {t.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Receipt mockup column */}
        <div className="relative mx-auto w-full max-w-md animate-fade-in lg:mx-0">
          {/* Glow plate behind the card */}
          <div
            aria-hidden
            className="absolute inset-0 -rotate-6 rounded-xl2 bg-gradient-to-br from-brand-300/40 to-indigoBtn/20 blur-xl"
          />

          {/* Floating mini badge */}
          <div className="absolute -left-4 top-6 z-20 hidden animate-fade-up rounded-2xl bg-white px-4 py-3 shadow-card sm:block">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-success/10 text-success">
                <i className="fa-solid fa-check" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold text-placeholderGray">PDF ready</p>
                <p className="text-sm font-bold text-ink">in 1.2s</p>
              </div>
            </div>
          </div>

          {/* Floating currency badge */}
          <div className="absolute -right-3 bottom-10 z-20 hidden animate-fade-up rounded-2xl bg-white px-4 py-3 shadow-card sm:block">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
                <i className="fa-solid fa-indian-rupee-sign" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-[11px] font-semibold text-placeholderGray">Auto totals</p>
                <p className="text-sm font-bold text-ink">27 currencies</p>
              </div>
            </div>
          </div>

          {/* The receipt card */}
          <div className="relative z-10 rotate-2 rounded-xl2 border border-line bg-white p-6 shadow-card transition-transform duration-300 hover:rotate-0">
            <div className="flex items-start justify-between border-b border-dashed border-line pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand to-indigoBtn text-white">
                  <i className="fa-solid fa-gas-pump" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-ink">Fuel Receipt</p>
                  <p className="text-[11px] text-placeholderGray">No. INV-002948</p>
                </div>
              </div>
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">
                PAID
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: "Petrol (Premium)", qty: "32.50 L", amt: "₹3,412.50" },
                { label: "Rate per litre", qty: "—", amt: "₹105.00" },
                { label: "Service charge", qty: "—", amt: "₹12.00" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-inkSoft">{row.label}</span>
                  <span className="font-semibold text-ink">{row.amt}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-section px-4 py-3">
              <span className="text-sm font-semibold text-ink">Total amount</span>
              <span className="text-lg font-extrabold text-indigoBtn">₹3,424.50</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {[...Array(28)].map((_, i) => (
                <span
                  key={i}
                  className="h-7 w-[3px] rounded-full bg-ink/80"
                  style={{ opacity: i % 3 === 0 ? 1 : 0.45 }}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] tracking-[0.3em] text-placeholderGray">
              BILLGENERATOR.ORG
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
