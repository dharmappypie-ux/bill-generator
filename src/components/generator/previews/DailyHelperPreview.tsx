import type { CSSProperties } from "react";
import { PreviewProps } from "@/types/generator";
import { str, num, plain, fmtDMonY, paperStyle } from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

/** Indian numbering -> words for whole rupees. Returns "" if not feasible. */
function amountToWords(n: number): string {
  const whole = Math.floor(n);
  if (!Number.isFinite(whole) || whole <= 0 || whole > 999999999) return "";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const two = (x: number): string => {
    if (x === 0) return "";
    if (x < 20) return ones[x];
    return `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
  };
  const three = (x: number): string => {
    const h = Math.floor(x / 100);
    const r = x % 100;
    return `${h ? ones[h] + " Hundred" + (r ? " " : "") : ""}${two(r)}`;
  };

  const crore = Math.floor(whole / 10000000);
  const lakh = Math.floor((whole % 10000000) / 100000);
  const thousand = Math.floor((whole % 100000) / 1000);
  const rest = whole % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${two(crore)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (thousand) parts.push(`${two(thousand)} Thousand`);
  if (rest) parts.push(three(rest));

  const words = parts.join(" ").replace(/\s+/g, " ").trim();
  return words ? `${words} Only` : "";
}

/* ================================================================== */
/* component                                                          */
/* ================================================================== */

export default function DailyHelperPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const employerName = str(data, "employerName");
  const helperName = str(data, "helperName");
  const workType = str(data, "workType");
  const month = str(data, "month");
  const amount = str(data, "amount");
  const paymentMode = str(data, "paymentMode");
  const receiptNo = str(data, "receiptNo");
  const date = str(data, "date");

  const amountNum = num(amount);
  const amountFmt = plain(amountNum, currency);
  const words = amountToWords(amountNum);
  const dateFmt = date ? fmtDMonY(date) : "";

  const v: DV = {
    t, crumpled, employerName, helperName, workType, month,
    paymentMode, receiptNo, dateFmt, amountFmt, words,
  };

  switch (template) {
    case "template-2":
      return <Minimal {...v} />;
    case "template-1":
    default:
      return <StandardReceipt {...v} />;
  }
}

type DV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  employerName: string;
  helperName: string;
  workType: string;
  month: string;
  paymentMode: string;
  receiptNo: string;
  dateFmt: string;
  amountFmt: string;
  words: string;
};

/** The shared "Received with thanks …" sentence. */
function ThanksSentence(p: DV) {
  const { t } = p;
  const role = p.workType ? p.workType.toLowerCase() : "household help";
  return (
    <p style={{ margin: 0, lineHeight: 1.9, color: t.ink, fontSize: 14 }}>
      Received with thanks a sum of <strong style={{ color: t.accent }}>{p.amountFmt}</strong>
      {p.words ? <span style={{ color: t.muted }}> ({p.words}) </span> : " "}
      from <strong>{p.employerName || "the Employer"}</strong> being the salary paid to{" "}
      <strong>{p.helperName || "the helper"}</strong>
      {p.workType ? <> for services rendered as <strong>{role}</strong></> : null}
      {p.month ? <> for the month of <strong>{p.month}</strong></> : null}
      {p.paymentMode ? <>, paid via <strong>{p.paymentMode}</strong></> : null}
      .
    </p>
  );
}

/** Signature block — helper acknowledges receipt. */
function Signature({ name, accent, ink, muted }: { name: string; accent: string; ink: string; muted: string }) {
  return (
    <div style={{ marginTop: 34, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ textAlign: "center", minWidth: 200 }}>
        <div style={{ height: 26 }} />
        <div style={{ borderTop: `1px solid ${ink}`, paddingTop: 5 }}>
          <div style={{ fontWeight: 700, color: accent }}>{name || "Helper"}</div>
          <div style={{ color: muted, fontSize: 11 }}>Signature of Helper</div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 1 — Standard Receipt                                      */
/* ================================================================== */

function StandardReceipt(p: DV) {
  const { t } = p;
  const root: CSSProperties = {
    width: 640,
    margin: "0 auto",
    color: t.ink,
    fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
    boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 6,
    overflow: "hidden",
    ...paperStyle(t, p.crumpled),
  };
  return (
    <div style={root}>
      {/* accent header */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>HOUSEHOLD HELP RECEIPT</div>
          <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1 }}>Domestic Worker Salary Payment</div>
        </div>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
          ₹
        </div>
      </div>

      <div style={{ padding: "22px 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, fontSize: 13 }}>
          <div>
            <span style={{ color: t.muted }}>Receipt No: </span>
            <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
          </div>
          <div>
            <span style={{ color: t.muted }}>Date: </span>
            <strong style={{ color: t.ink }}>{p.dateFmt || "—"}</strong>
          </div>
        </div>

        {/* details grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 24px",
            border: `1px solid ${t.muted}`,
            borderRadius: 6,
            padding: "14px 18px",
            marginBottom: 18,
            fontSize: 13,
          }}
        >
          <Cell k="Paid To (Helper)" v={p.helperName} ink={t.ink} muted={t.muted} />
          <Cell k="Work Type" v={p.workType} ink={t.ink} muted={t.muted} />
          <Cell k="Paid By (Employer)" v={p.employerName} ink={t.ink} muted={t.muted} />
          <Cell k="For the Month" v={p.month} ink={t.ink} muted={t.muted} />
          <Cell k="Payment Mode" v={p.paymentMode} ink={t.ink} muted={t.muted} />
          <Cell k="Amount" v={p.amountFmt} ink={t.ink} muted={t.muted} bold />
        </div>

        {/* received-with-thanks */}
        <div style={{ border: `1px dashed ${t.muted}`, borderRadius: 6, padding: "16px 18px" }}>
          <ThanksSentence {...p} />
        </div>

        <Signature name={p.helperName} accent={t.accent} ink={t.ink} muted={t.muted} />

        <div style={{ textAlign: "center", color: t.muted, fontSize: 11, marginTop: 22, borderTop: `1px solid ${t.muted}`, paddingTop: 10 }}>
          This receipt acknowledges salary paid to the above domestic worker. Please retain for your records.
        </div>
      </div>
    </div>
  );
}

function Cell({ k, v, ink, muted, bold }: { k: string; v: string; ink: string; muted: string; bold?: boolean }) {
  return (
    <div>
      <div style={{ color: muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
      <div style={{ color: ink, fontWeight: bold ? 800 : 600, fontSize: bold ? 15 : 13 }}>{v || "—"}</div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Minimal                                               */
/* ================================================================== */

function Minimal(p: DV) {
  const { t } = p;
  const root: CSSProperties = {
    width: 560,
    margin: "0 auto",
    color: t.ink,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.06)",
    padding: "44px 48px",
    ...paperStyle(t, p.crumpled),
  };
  return (
    <div style={root}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 34 }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: 3, color: t.ink }}>HELPER PAYMENT</div>
        <div style={{ fontSize: 11, color: t.muted, textAlign: "right" }}>
          {p.receiptNo ? <div>No. {p.receiptNo}</div> : null}
          {p.dateFmt ? <div>{p.dateFmt}</div> : null}
        </div>
      </div>

      <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
        Amount Paid
      </div>
      <div style={{ fontSize: 34, fontWeight: 300, color: t.accent, marginBottom: 4 }}>{p.amountFmt}</div>
      {p.words ? (
        <div style={{ fontSize: 12, color: t.muted, marginBottom: 26 }}>{p.words}</div>
      ) : (
        <div style={{ marginBottom: 26 }} />
      )}

      <div style={{ borderTop: `1px solid ${t.muted}`, paddingTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", fontSize: 13, marginBottom: 22 }}>
        <Line k="Helper" v={p.helperName} ink={t.ink} muted={t.muted} />
        <Line k="Work Type" v={p.workType} ink={t.ink} muted={t.muted} />
        <Line k="Employer" v={p.employerName} ink={t.ink} muted={t.muted} />
        <Line k="Month" v={p.month} ink={t.ink} muted={t.muted} />
        <Line k="Payment Mode" v={p.paymentMode} ink={t.ink} muted={t.muted} />
      </div>

      <ThanksSentence {...p} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}>
        <div style={{ textAlign: "center", minWidth: 180 }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5 }}>
            <span style={{ color: t.ink, fontWeight: 600 }}>{p.helperName || "Helper"}</span>
            <div style={{ fontSize: 11, color: t.muted }}>Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <span style={{ color: muted, minWidth: 96 }}>{k}</span>
      <span style={{ color: ink, fontWeight: 600 }}>{v || "—"}</span>
    </div>
  );
}
