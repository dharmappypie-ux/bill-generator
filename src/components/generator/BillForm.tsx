"use client";
import { GeneratorConfig, BillData, FieldDef } from "@/types/generator";
import { CURRENCIES } from "@/lib/currencies";

export default function BillForm({
  config,
  values,
  onChange,
}: {
  config: GeneratorConfig;
  values: BillData;
  onChange: (name: string, value: string | boolean) => void;
}) {
  // Group fields preserving config order.
  const groups: { name: string; fields: FieldDef[] }[] = [];
  for (const f of config.fields) {
    let g = groups.find((x) => x.name === f.group);
    if (!g) {
      g = { name: f.group, fields: [] };
      groups.push(g);
    }
    g.fields.push(f);
  }

  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <fieldset key={group.name}>
          <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <span className="h-4 w-1 rounded-full bg-brand" />
            {group.name}
          </legend>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {group.fields.map((field) => (
              <Field key={field.name} field={field} value={values[field.name]} onChange={onChange} />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | boolean | undefined;
  onChange: (name: string, value: string | boolean) => void;
}) {
  const full = !field.half || field.type === "textarea" || field.type === "logo" || field.type === "items";
  const wrap = full ? "sm:col-span-2" : "";
  const str = typeof value === "string" ? value : "";

  if (field.type === "toggle") {
    return (
      <label className={`flex items-center justify-between gap-3 rounded-lg border border-line2 px-3 py-2.5 ${wrap}`}>
        <span className="text-[13px] font-semibold text-ink">{field.label}</span>
        <button
          type="button"
          onClick={() => onChange(field.name, !value)}
          className={`relative h-6 w-11 rounded-full transition ${value ? "bg-brand" : "bg-line"}`}
          aria-pressed={Boolean(value)}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </label>
    );
  }

  if (field.type === "logo") {
    return (
      <div className={wrap}>
        <label className="field-label">{field.label}</label>
        <div className="flex flex-wrap gap-2">
          {field.logos?.map((logo) => (
            <button
              key={logo.id}
              type="button"
              onClick={() => onChange(field.name, logo.id)}
              className={`flex items-center gap-2 rounded-lg border-2 bg-white px-2 py-1.5 transition ${
                value === logo.id ? "border-brand ring-2 ring-brand-100" : "border-line2 hover:border-brand-300"
              }`}
              title={logo.label}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.label} className="h-7 w-auto" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "items") {
    const cols = field.columns ?? [];
    let rows: Record<string, string>[] = [];
    try {
      const p = JSON.parse(str || "[]");
      if (Array.isArray(p)) rows = p;
    } catch {
      rows = [];
    }
    const update = (next: Record<string, string>[]) => onChange(field.name, JSON.stringify(next));
    const setCell = (i: number, key: string, v: string) =>
      update(rows.map((r, idx) => (idx === i ? { ...r, [key]: v } : r)));
    const addRow = () => update([...rows, Object.fromEntries(cols.map((c) => [c.key, ""]))]);
    const removeRow = (i: number) => update(rows.filter((_, idx) => idx !== i));

    return (
      <div className={wrap}>
        <label className="field-label">{field.label}</label>
        <div className="overflow-hidden rounded-lg border border-line2">
          <div className="flex gap-2 bg-section px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-inkSoft">
            {cols.map((c) => (
              <span key={c.key} style={{ flex: c.grow ?? 1 }}>{c.label}</span>
            ))}
            <span className="w-6 shrink-0" />
          </div>
          {rows.length === 0 && (
            <div className="px-2 py-2 text-xs text-placeholderGray">No items yet — add one below.</div>
          )}
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2 border-t border-line2 px-2 py-1.5">
              {cols.map((c) => (
                <input
                  key={c.key}
                  style={{ flex: c.grow ?? 1, minWidth: 0 }}
                  className="w-full rounded border border-line2 px-2 py-1 text-sm outline-none focus:border-brand"
                  type={c.type === "number" ? "number" : "text"}
                  value={row[c.key] ?? ""}
                  onChange={(e) => setCell(i, c.key, e.target.value)}
                />
              ))}
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded text-rose-500 hover:bg-rose-50"
                aria-label="Remove row"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow} className="mt-2 text-xs font-semibold text-brand hover:underline">
          <i className="fa-solid fa-plus mr-1" />
          {field.addLabel ?? "Add item"}
        </button>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <label className="field-label" htmlFor={field.name}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          className="field-input min-h-[72px] resize-y"
          placeholder={field.placeholder}
          value={str}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      ) : field.type === "select" ? (
        <select id={field.name} className="field-select" value={str} onChange={(e) => onChange(field.name, e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : field.type === "currency" ? (
        <select id={field.name} className="field-select" value={str || "INR"} onChange={(e) => onChange(field.name, e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
          ))}
        </select>
      ) : (
        <input
          id={field.name}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text"}
          className="field-input"
          placeholder={field.placeholder}
          value={str}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      )}
    </div>
  );
}
