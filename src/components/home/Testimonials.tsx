"use client";
import { useCallback, useEffect, useState } from "react";

interface Review {
  name: string;
  role: string;
  quote: string;
}

const REVIEWS: Review[] = [
  {
    name: "Arjun Mehta",
    role: "IT Specialist",
    quote:
      "I needed reimbursement receipts fast and this nailed it. The fuel bill looked exactly like the real thing and exported as a clean PDF instantly.",
  },
  {
    name: "Priya Sharma",
    role: "Mechanical Engineer",
    quote:
      "The auto-calculation saved me from so many mistakes. I just enter the line items and the totals and taxes are always spot on.",
  },
  {
    name: "Rahul Nair",
    role: "Product Designer",
    quote:
      "Beautiful templates that actually look professional. I customized the colors and logo and it matched my studio branding perfectly.",
  },
  {
    name: "Sneha Kapoor",
    role: "Business Consultant",
    quote:
      "I generate GST invoices for clients every week. It's become my default tool — fast, accurate and zero setup each time.",
  },
  {
    name: "Vikram Singh",
    role: "Chartered Accountant",
    quote:
      "My clients love how organized their records are now. Saved bills sync across devices, so nothing ever gets lost.",
  },
  {
    name: "Ananya Iyer",
    role: "Shop Owner",
    quote:
      "Running my mart, I print dozens of receipts a day. This makes it effortless and the bills look way more credible than my old book.",
  },
  {
    name: "Karan Patel",
    role: "Freelancer",
    quote:
      "No login, no friction — I made my first invoice in under a minute. The email delivery feature is a genuine time-saver.",
  },
  {
    name: "Dr. Meera Joshi",
    role: "Physician",
    quote:
      "Clinic receipts used to be a hassle. Now I generate clean, itemized medical bills that my patients can keep for insurance.",
  },
  {
    name: "Sahil Verma",
    role: "Teacher",
    quote:
      "I use it for school and tuition fee receipts. Simple enough that even parents compliment how neat the documents are.",
  },
  {
    name: "Nisha Reddy",
    role: "Startup Founder",
    quote:
      "From rent receipts to client invoices, one tool covers everything. For a lean startup, that's exactly what we needed.",
  },
];

const AVATAR_COLORS = [
  "bg-brand",
  "bg-indigoBtn",
  "bg-teal",
  "bg-brand-600",
  "bg-accent",
];

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Card({ r, i }: { r: Review; i: number }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft">
      <div className="flex gap-0.5 text-accent">
        {[...Array(5)].map((_, s) => (
          <i key={s} className="fa-solid fa-star text-sm" />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-inkSoft">
        &ldquo;{r.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <span
          className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white ${
            AVATAR_COLORS[i % AVATAR_COLORS.length]
          }`}
        >
          {initials(r.name)}
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-ink">{r.name}</p>
          <p className="text-xs text-placeholderGray">{r.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const [perView, setPerView] = useState(1);

  // Responsive cards-per-view
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pageCount = Math.ceil(REVIEWS.length / perView);

  // Clamp page when perView changes
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const next = useCallback(
    () => setPage((p) => (p + 1) % pageCount),
    [pageCount]
  );
  const prev = useCallback(
    () => setPage((p) => (p - 1 + pageCount) % pageCount),
    [pageCount]
  );

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="bg-section py-16 lg:py-20">
      <div className="container-bg">
        <p className="section-eyebrow">Testimonials</p>
        <h2 className="section-title">Loved by thousands of users</h2>
        <p className="section-sub">
          From freelancers to clinics and shops — here&apos;s what people say about
          billing with us.
        </p>

        <div className="relative mt-12">
          {/* Viewport */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pageCount }).map((_, p) => (
                <div
                  key={p}
                  className="grid w-full shrink-0 gap-5 px-0.5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {REVIEWS.slice(p * perView, p * perView + perView).map((r) => (
                    <Card key={r.name} r={r} i={REVIEWS.indexOf(r)} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous reviews"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink shadow-soft transition hover:border-brand hover:text-brand"
            >
              <i className="fa-solid fa-chevron-left text-sm" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === page ? "w-6 bg-brand" : "w-2 bg-brand-200 hover:bg-brand-300"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next reviews"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink shadow-soft transition hover:border-brand hover:text-brand"
            >
              <i className="fa-solid fa-chevron-right text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
