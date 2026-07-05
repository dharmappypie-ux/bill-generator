import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  plain,
  fmtDMonY,
  parseItems,
  paperStyle,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared values                                                      */
/* ------------------------------------------------------------------ */

type FeeRow = { head: string; amount: string };

type RV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  schoolName: string;
  address: string;
  receiptNo: string;
  date: string;
  studentName: string;
  className: string;
  rollNo: string;
  session: string;
  paymentMode: string;
  rows: FeeRow[];
  total: number;
};

export default function SchoolReceiptPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const rows: FeeRow[] = parseItems(data.items).map((r) => ({
    head: String(r.head ?? ""),
    amount: String(r.amount ?? ""),
  }));
  const total = rows.reduce((s, r) => s + num(r.amount), 0);

  const v: RV = {
    t,
    crumpled,
    currency,
    schoolName: str(data, "schoolName") || "School Name",
    address: str(data, "address"),
    receiptNo: str(data, "receiptNo"),
    date: str(data, "date"),
    studentName: str(data, "studentName"),
    className: str(data, "className"),
    rollNo: str(data, "rollNo"),
    session: str(data, "session"),
    paymentMode: str(data, "paymentMode") || "Cash",
    rows,
    total,
  };

  switch (template) {
    case "template-2":
      return <Compact {...v} />;
    case "template-1":
    default:
      return <FeeReceipt {...v} />;
  }
}

/* tiny shared bits ------------------------------------------------- */

function Field({
  label,
  value,
  ink,
  muted,
}: {
  label: string;
  value: string;
  ink: string;
  muted: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: muted,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: ink }}>
        {value || "—"}
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 1 — Fee Receipt (~600px)                                  */
/* ================================================================== */

function FeeReceipt(p: RV) {
  const { t } = p;
  const inWords = p.total > 0 ? amountInWords(p.total) : "";

  return (
    <div
      style={{
        width: 600,
        margin: "0 auto",
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        padding: 0,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 6,
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header banner */}
      <div
        style={{
          background: t.accent,
          color: "#ffffff",
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              border: "1.5px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {initials(p.schoolName)}
          </div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.15 }}>
              {p.schoolName}
            </div>
            {p.address ? (
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.9,
                  lineHeight: 1.45,
                  maxWidth: 320,
                  marginTop: 3,
                }}
              >
                {p.address}
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.55)",
              borderRadius: 4,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
            }}
          >
            FEE RECEIPT
          </div>
        </div>
      </div>

      {/* receipt meta strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 28px",
          background: "rgba(0,0,0,0.035)",
          borderBottom: `1px dashed ${t.muted}`,
          fontSize: 12.5,
        }}
      >
        <span style={{ color: t.muted }}>
          Receipt No:{" "}
          <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
        </span>
        <span style={{ color: t.muted }}>
          Date:{" "}
          <strong style={{ color: t.ink }}>
            {p.date ? fmtDMonY(p.date) : "—"}
          </strong>
        </span>
      </div>

      <div style={{ padding: "20px 28px 26px" }}>
        {/* student grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 24px",
            marginBottom: 18,
          }}
        >
          <Field label="Student Name" value={p.studentName} ink={t.ink} muted={t.muted} />
          <Field label="Class / Section" value={p.className} ink={t.ink} muted={t.muted} />
          <Field label="Roll Number" value={p.rollNo} ink={t.ink} muted={t.muted} />
          <Field label="Academic Session" value={p.session} ink={t.ink} muted={t.muted} />
        </div>

        {/* fee table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: t.accent, color: "#ffffff" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "9px 12px",
                  fontWeight: 700,
                  width: 44,
                }}
              >
                #
              </th>
              <th style={{ textAlign: "left", padding: "9px 12px", fontWeight: 700 }}>
                Particulars
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "9px 12px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {p.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{ padding: "14px 12px", color: t.muted, textAlign: "center" }}
                >
                  No fee heads added
                </td>
              </tr>
            ) : (
              p.rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.muted}` }}>
                  <td style={{ padding: "9px 12px", color: t.muted }}>{i + 1}</td>
                  <td style={{ padding: "9px 12px", color: t.ink }}>
                    {r.head || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      textAlign: "right",
                      color: t.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {plain(num(r.amount), p.currency)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* total */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div
            style={{
              minWidth: 260,
              background: t.accent,
              color: "#ffffff",
              borderRadius: 6,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
              Total Fee Paid
            </span>
            <span style={{ fontSize: 21, fontWeight: 800 }}>
              {plain(p.total, p.currency)}
            </span>
          </div>
        </div>

        {/* amount in words */}
        {inWords ? (
          <div style={{ marginTop: 12, fontSize: 11.5, color: t.muted }}>
            <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              In words:{" "}
            </span>
            <span style={{ color: t.ink, fontStyle: "italic" }}>
              {inWords} only
            </span>
          </div>
        ) : null}

        {/* footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 30,
            gap: 24,
          }}
        >
          <div style={{ fontSize: 12, color: t.muted }}>
            <div>
              Payment Mode:{" "}
              <strong style={{ color: t.ink }}>{p.paymentMode}</strong>
            </div>
            <div style={{ marginTop: 6, color: "#16803c", fontWeight: 700, fontSize: 12.5 }}>
              ✓ PAID
            </div>
          </div>
          <div style={{ textAlign: "center", minWidth: 180 }}>
            <div style={{ height: 26 }} />
            <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5 }}>
              <div style={{ fontSize: 12, color: t.muted }}>
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            color: t.muted,
            fontSize: 10.5,
            marginTop: 18,
            borderTop: `1px dashed ${t.muted}`,
            paddingTop: 10,
            lineHeight: 1.5,
          }}
        >
          This is a computer-generated fee receipt. Fees once paid are
          non-refundable. Please retain this receipt for your records.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Compact                                               */
/* ================================================================== */

function Compact(p: RV) {
  const { t } = p;

  return (
    <div
      style={{
        width: 480,
        margin: "0 auto",
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        padding: "26px 30px 28px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 4,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: t.ink, lineHeight: 1.2 }}>
          {p.schoolName}
        </div>
        {p.address ? (
          <div style={{ fontSize: 10.5, color: t.muted, marginTop: 3, lineHeight: 1.4 }}>
            {p.address}
          </div>
        ) : null}
        <div
          style={{
            display: "inline-block",
            marginTop: 8,
            background: t.accent,
            color: "#ffffff",
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 1.5,
            padding: "3px 14px",
            borderRadius: 999,
          }}
        >
          FEE RECEIPT
        </div>
      </div>

      <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "14px 0" }} />

      {/* meta + student rows */}
      <div style={{ fontSize: 12, lineHeight: 1.9 }}>
        <Row k="Receipt No." v={p.receiptNo || "—"} ink={t.ink} muted={t.muted} />
        <Row k="Date" v={p.date ? fmtDMonY(p.date) : "—"} ink={t.ink} muted={t.muted} />
        <Row k="Student" v={p.studentName || "—"} ink={t.ink} muted={t.muted} bold />
        <Row
          k="Class / Roll"
          v={`${p.className || "—"}  ·  Roll ${p.rollNo || "—"}`}
          ink={t.ink}
          muted={t.muted}
        />
        <Row k="Session" v={p.session || "—"} ink={t.ink} muted={t.muted} />
      </div>

      <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "12px 0 4px" }} />

      {/* fee lines */}
      <div style={{ fontSize: 12.5 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: t.muted,
            fontSize: 10.5,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            padding: "6px 0",
          }}
        >
          <span>Fee Head</span>
          <span>Amount</span>
        </div>
        {p.rows.length === 0 ? (
          <div style={{ padding: "8px 0", color: t.muted, textAlign: "center" }}>
            No fee heads added
          </div>
        ) : (
          p.rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "5px 0",
                borderBottom: `1px dotted ${t.muted}`,
              }}
            >
              <span style={{ color: t.ink }}>{r.head || "—"}</span>
              <span style={{ color: t.ink, whiteSpace: "nowrap" }}>
                {plain(num(r.amount), p.currency)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 10,
          borderTop: `2px solid ${t.accent}`,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>
          TOTAL PAID
        </span>
        <span style={{ fontSize: 18, fontWeight: 800, color: t.accent }}>
          {plain(p.total, p.currency)}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          fontSize: 11.5,
          color: t.muted,
        }}
      >
        <span>
          Mode: <strong style={{ color: t.ink }}>{p.paymentMode}</strong>
        </span>
        <span style={{ color: "#16803c", fontWeight: 700 }}>✓ PAID</span>
      </div>

      <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "14px 0 8px" }} />

      <div style={{ textAlign: "center", fontSize: 10, color: t.muted, lineHeight: 1.5 }}>
        Computer-generated receipt · Fees once paid are non-refundable.
      </div>
    </div>
  );
}

function Row({
  k,
  v,
  ink,
  muted,
  bold,
}: {
  k: string;
  v: string;
  ink: string;
  muted: string;
  bold?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{k}</span>
      <span
        style={{
          color: ink,
          fontWeight: bold ? 700 : 500,
          textAlign: "right",
        }}
      >
        {v}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "S";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* Indian-numbering amount in words (whole rupees). */
function amountInWords(amount: number): string {
  const n = Math.round(amount);
  if (n === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const twoDigit = (x: number): string => {
    if (x < 20) return ones[x];
    const t = Math.floor(x / 10);
    const o = x % 10;
    return tens[t] + (o ? " " + ones[o] : "");
  };

  const threeDigit = (x: number): string => {
    const h = Math.floor(x / 100);
    const rest = x % 100;
    let s = "";
    if (h) s += ones[h] + " Hundred";
    if (rest) s += (s ? " " : "") + twoDigit(rest);
    return s;
  };

  let result = "";
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;

  if (crore) result += threeDigit(crore) + " Crore ";
  if (lakh) result += twoDigit(lakh) + " Lakh ";
  if (thousand) result += twoDigit(thousand) + " Thousand ";
  if (hundred) result += threeDigit(hundred);

  return result.trim();
}
