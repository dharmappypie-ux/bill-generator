const BENEFITS = [
  {
    icon: "fa-bolt",
    title: "Save Time",
    desc: "Skip spreadsheets and design tools — a finished bill in under a minute.",
  },
  {
    icon: "fa-leaf",
    title: "Eco-Friendly",
    desc: "Go fully paperless with clean digital receipts you can share anywhere.",
  },
  {
    icon: "fa-calculator",
    title: "Auto Calculations",
    desc: "Taxes, totals and discounts compute themselves — no manual math errors.",
  },
  {
    icon: "fa-folder-tree",
    title: "Organized Storage",
    desc: "Sign in to keep every bill neatly filed and searchable across devices.",
  },
  {
    icon: "fa-award",
    title: "Professional Look",
    desc: "Polished templates and themes that make any document look credible.",
  },
  {
    icon: "fa-envelope",
    title: "Email Delivery",
    desc: "Send the finished PDF straight to a client or yourself in one click.",
  },
  {
    icon: "fa-globe",
    title: "Access Anywhere",
    desc: "100% browser-based — works on phone, tablet and desktop alike.",
  },
  {
    icon: "fa-piggy-bank",
    title: "Cost Savings",
    desc: "Free to generate, with affordable plans only when you need more.",
  },
];

export default function Benefits() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-bg">
        <p className="section-eyebrow">Why Bill Generator</p>
        <h2 className="section-title">Everything you need to bill like a pro</h2>
        <p className="section-sub">
          Built to make invoicing painless — fast, accurate and good-looking, whether
          you bill once a month or a hundred times a day.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-xl text-brand-600 transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                <i className={`fa-solid ${b.icon}`} />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-inkSoft">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
