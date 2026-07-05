import Link from "next/link";

const REASONS = [
  {
    icon: "fa-bullseye",
    title: "Precision",
    desc: "Tax-aware calculations and validated fields mean every total adds up correctly.",
  },
  {
    icon: "fa-wand-magic-sparkles",
    title: "Ease of Use",
    desc: "Clean, guided forms anyone can complete — no accounting knowledge needed.",
  },
  {
    icon: "fa-gauge-high",
    title: "Speed",
    desc: "Generate a finished, downloadable document in well under a minute.",
  },
  {
    icon: "fa-headset",
    title: "24/7 Support",
    desc: "Help is available whenever you need it, by email, chat or phone.",
  },
  {
    icon: "fa-chart-line",
    title: "Efficiency",
    desc: "Reuse details, duplicate bills and batch your invoicing in record time.",
  },
  {
    icon: "fa-sliders",
    title: "Full Customization",
    desc: "Add your logo, switch themes, pick currencies and tailor every layout.",
  },
];

const STATS = [
  { value: "22+", label: "Generators" },
  { value: "27", label: "Currencies" },
  { value: "17", label: "Themes" },
  { value: "100%", label: "Free to try" },
];

export default function WhyChoose() {
  return (
    <section className="bg-section py-16 lg:py-20">
      <div className="container-bg grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        {/* Reasons */}
        <div>
          <p className="mb-3 w-fit rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-600">
            Why choose us
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            A bill generator that earns your trust
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-inkSoft">
            Thousands of freelancers, shops and small businesses rely on us to look
            professional and stay organized. Here&apos;s what sets it apart.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {REASONS.map((r) => (
              <div key={r.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-lg text-brand-600 shadow-soft">
                  <i className={`fa-solid ${r.icon}`} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-inkSoft">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stat block */}
        <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-brand-600 via-brand to-indigoBtn p-8 text-white shadow-card lg:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-accent/20 blur-2xl"
          />

          <p className="relative text-sm font-semibold uppercase tracking-wider text-white/80">
            By the numbers
          </p>
          <p className="relative mt-2 text-2xl font-extrabold leading-snug">
            One tool, every kind of bill you&apos;ll ever need.
          </p>

          <div className="relative mt-8 grid grid-cols-2 gap-5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur"
              >
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="mt-1 text-sm text-white/80">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/bills"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigoBtn-deep transition hover:bg-white/90"
          >
            <i className="fa-solid fa-grip" />
            Explore all generators
          </Link>
        </div>
      </div>
    </section>
  );
}
