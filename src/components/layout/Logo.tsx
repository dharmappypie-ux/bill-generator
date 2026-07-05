import Link from "next/link";

export default function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="Bill Generator home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-indigoBtn text-white shadow-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2h9l5 5v13a1 1 0 0 1-1.4.9L16 20l-2 1-2-1-2 1-2-1-2.6 1.3A1 1 0 0 1 2 20V4a2 2 0 0 1 2-2" />
          <path d="M8 7h6M8 11h8M8 15h5" />
        </svg>
      </span>
      <span className="flex flex-col gap-1 leading-none">
        <span className={`font-pixel text-[11px] leading-[1.4] ${dark ? "text-white" : "text-ink"}`}>
          Bill<span className="text-brand">Generator</span>
        </span>
        <span className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-white/60" : "text-placeholderGray"}`}>
          Invoices · Receipts · Bills
        </span>
      </span>
    </Link>
  );
}
