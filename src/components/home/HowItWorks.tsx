const STEPS = [
  {
    icon: "fa-table-cells",
    title: "Choose a template",
    desc: "Pick from 22+ bill, invoice and receipt generators built for every use case.",
  },
  {
    icon: "fa-pen-to-square",
    title: "Enter your details",
    desc: "Fill the smart form — line items, taxes and totals are calculated for you.",
  },
  {
    icon: "fa-file-arrow-down",
    title: "Download or email PDF",
    desc: "Export a crisp PDF in one click, or send it straight to any inbox.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-section py-16 lg:py-20">
      <div className="container-bg">
        <p className="section-eyebrow">How it works</p>
        <h2 className="section-title">From blank page to PDF in three steps</h2>
        <p className="section-sub">
          No tutorials, no setup. The whole flow takes less than a minute.
        </p>

        <div className="relative mt-14">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-9 mx-auto hidden h-0.5 w-2/3 bg-gradient-to-r from-brand-200 via-indigoBtn/30 to-brand-200 lg:block"
          />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {/* Numbered circle */}
                <div className="relative z-10 grid h-[72px] w-[72px] place-items-center rounded-full bg-white shadow-card ring-1 ring-line">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand to-indigoBtn text-2xl text-white">
                    <i className={`fa-solid ${step.icon}`} />
                  </span>
                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-extrabold text-white ring-4 ring-section">
                    {i + 1}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-inkSoft">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
