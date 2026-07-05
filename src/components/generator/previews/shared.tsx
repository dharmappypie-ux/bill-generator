import type { CSSProperties } from "react";
import { themeById } from "@/lib/themes";
import { symbolFor } from "@/lib/currencies";

/* ---- value helpers ---- */
export function str(data: Record<string, string | boolean>, key: string): string {
  const v = data[key];
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "";
  return String(v);
}

export function bool(data: Record<string, string | boolean>, key: string): boolean {
  return data[key] === true || data[key] === "true";
}

export function num(v: string | number | undefined): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : 0;
}

/** Money with the currency symbol; returns just the symbol when empty. */
export function money(v: string | number | undefined, currency: string): string {
  const sym = symbolFor(currency);
  if (v === "" || v === undefined || v === null) return sym;
  const n = num(v);
  return `${sym}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function plain(n: number, currency: string): string {
  return `${symbolFor(currency)}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ---- date helpers ---- */
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDMonY(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]} ${MONTHS[+m[2]] || m[2]} ${m[1]}` : iso;
}
export function fmtDMY(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : iso;
}

/* ---- line items ---- */
export type ItemRow = Record<string, string>;
export function parseItems(value: string | boolean | undefined): ItemRow[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const p = JSON.parse(value);
    return Array.isArray(p) ? (p as ItemRow[]) : [];
  } catch {
    return [];
  }
}

/**
 * Receipt "paper". With the crumpled effect on, the receipt is printed on the
 * selected crumpled-paper photo (Theme N); otherwise a clean white sheet.
 * Spread AFTER the base style so it wins `background`/`backgroundImage`.
 */
export function paperStyle(t: ReturnType<typeof themeById>, crumpled: boolean): CSSProperties {
  if (crumpled) {
    return {
      background: "none",
      backgroundImage: `url('${t.image}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#f4efe6",
      boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
    };
  }
  return { background: "#ffffff" };
}

/* ---- tiny render helpers ---- */
export function KV({
  k,
  v,
  ink,
  muted,
  bold,
  size = 12,
}: {
  k: string;
  v: string;
  ink: string;
  muted: string;
  bold?: boolean;
  size?: number;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, lineHeight: 1.7, fontSize: size }}>
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: ink, fontWeight: bold ? 700 : 400, textAlign: "right" }}>{v || "—"}</span>
    </div>
  );
}

export function Divider({ color }: { color: string }) {
  return <div style={{ borderTop: `1px dashed ${color}`, margin: "10px 0" }} />;
}
