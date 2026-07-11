"use client";

/**
 * Shared building blocks for the Free Tools calculators.
 * Every calculator composes these so all 54 tools look identical.
 */

export const formatINR = (n: number, decimals = 0) =>
  isFinite(n)
    ? n.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : "—";

export const inr = (n: number, decimals = 0) => `₹${formatINR(n, decimals)}`;

/** Two-column responsive layout: inputs card on the left, results on the right. */
export function ToolLayout({
  inputs,
  results,
}: {
  inputs: React.ReactNode;
  results: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
        <div className="space-y-4">{inputs}</div>
      </div>
      <div className="space-y-4">{results}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-inkSoft">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-100";

export function NumberField({
  label,
  value,
  onChange,
  hint,
  prefix,
  suffix,
  min = 0,
  step,
  placeholder,
}: {
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  hint?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-inkSoft">
            {prefix}
          </span>
        )}
        <input
          type="number"
          inputMode="decimal"
          className={`${inputCls} ${prefix ? "pl-8" : ""} ${suffix ? "pr-14" : ""}`}
          value={value}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-inkSoft">
            {suffix}
          </span>
        )}
      </div>
    </Field>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        className={inputCls}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Pill-style single choice, e.g. GST rate or Add/Remove GST. */
export function ToggleGroup({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const body = (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
            value === o.value
              ? "bg-indigoBtn text-white shadow-card"
              : "bg-section text-inkSoft hover:bg-brand-50 hover:text-brand-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
  if (!label) return body;
  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
      {body}
    </div>
  );
}

/** Hero number at the top of the results column. */
export function BigResult({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 text-white shadow-card ${
        accent
          ? "bg-gradient-to-br from-accent to-accent-700"
          : "bg-gradient-to-br from-indigoBtn to-indigoBtn-deeper"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-white/70">{label}</p>
      <p className="mt-1 text-3xl font-extrabold sm:text-4xl">{value}</p>
    </div>
  );
}

/** Card that groups detail rows below the BigResult. */
export function ResultCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      {title && (
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600">
          {title}
        </p>
      )}
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

export function ResultRow({
  label,
  value,
  bold = false,
  negative = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <span className={`text-[13px] ${bold ? "font-bold text-ink" : "text-inkSoft"}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${
          bold ? "font-extrabold text-ink" : "font-semibold"
        } ${negative ? "text-red-500" : bold ? "" : "text-ink"}`}
      >
        {negative ? `− ${value}` : value}
      </span>
    </div>
  );
}

/** Small print shown under every calculator's results. */
export function ToolNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-section px-4 py-3 text-xs leading-relaxed text-inkSoft">
      <i className="fa-solid fa-circle-info mr-1.5 text-brand-400" />
      {children}
    </p>
  );
}
