import { PreviewProps } from "@/types/generator";
import { themeById } from "@/lib/themes";
import { formatMoney, symbolFor } from "@/lib/currencies";
import { paperStyle } from "./shared";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function str(data: PreviewProps["data"], key: string): string {
  const v = data[key];
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "";
  return String(v);
}

/** Indian numbering -> words for whole rupees. Returns "" if not feasible. */
function rupeesToWords(amount: string): string {
  const n = Math.floor(parseFloat(amount));
  if (!Number.isFinite(n) || n <= 0 || n > 999999999) return "";

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

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${two(crore)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (thousand) parts.push(`${two(thousand)} Thousand`);
  if (rest) parts.push(three(rest));

  const words = parts.join(" ").replace(/\s+/g, " ").trim();
  return words ? `${words} Only` : "";
}

/** Light, html2canvas-safe crumple effect (respected harmlessly when true). */
function crumpleStyle(crumpled: boolean): React.CSSProperties {
  if (!crumpled) return {};
  return {
    backgroundImage:
      "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.035) 0%, rgba(0,0,0,0) 22%)," +
      "radial-gradient(circle at 75% 65%, rgba(0,0,0,0.035) 0%, rgba(0,0,0,0) 24%)",
    transform: "rotate(-0.3deg)",
  };
}

/**
 * A ₹1 revenue stamp (required on Indian cash rent receipts).
 * Source PNG is full-res (1024×1256, portrait ~0.82); we render it small at a
 * fixed display width so it shows as a realistic ~2cm stamp on the receipt.
 */
const STAMP_W = 74; // px on screen → ~90px tall at the image's portrait aspect
function RevenueStamp({ muted }: { muted: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/revenue-stamp.png"
        alt="₹1 Revenue Stamp"
        width={STAMP_W}
        style={{ width: STAMP_W, height: "auto", display: "block", margin: "0 auto" }}
      />
      <div style={{ color: muted, fontSize: 9.5, marginTop: 4, maxWidth: 116, lineHeight: 1.3 }}>
        Affix ₹1 Revenue Stamp &amp; sign across it
      </div>
    </div>
  );
}

/** Revenue stamp + landlord signature line, side by side. */
function Signature({ name, pan, accent, ink, muted }: { name: string; pan: string; accent: string; ink: string; muted: string }) {
  return (
    <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
      <RevenueStamp muted={muted} />
      <div style={{ textAlign: "center", minWidth: 180 }}>
        <div style={{ borderTop: `1px solid ${ink}`, paddingTop: 5 }}>
          <div style={{ fontWeight: 700, color: accent }}>{name || "Landlord"}</div>
          <div style={{ color: muted, fontSize: 11 }}>Signature of Landlord</div>
          {pan ? <div style={{ color: muted, fontSize: 11 }}>PAN: {pan}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* component                                                          */
/* ================================================================== */

export default function RentReceiptPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const receiptNo = str(data, "receiptNo");
  const date = str(data, "date");
  const amount = str(data, "amount");
  const paymentMode = str(data, "paymentMode");
  const periodFrom = str(data, "periodFrom");
  const periodTo = str(data, "periodTo");
  const tenantName = str(data, "tenantName");
  const tenantPan = str(data, "tenantPan");
  const landlordName = str(data, "landlordName");
  const landlordPan = str(data, "landlordPan");
  const propertyAddress = str(data, "propertyAddress");
  const lastBalance = str(data, "lastBalance");
  const houseTax = str(data, "houseTax");
  const electricityBill = str(data, "electricityBill");
  const waterBill = str(data, "waterBill");
  const advance = str(data, "advance");
  const balance = str(data, "balance");

  const amountFmt = formatMoney(amount, currency);
  const words = rupeesToWords(amount);

  const v = {
    t, crumpled, currency, receiptNo, date, amount, paymentMode, periodFrom, periodTo,
    tenantName, tenantPan, landlordName, landlordPan, propertyAddress, amountFmt, words,
    lastBalance, houseTax, electricityBill, waterBill, advance, balance,
  };

  switch (template) {
    case "template-2":
      return <BorderedForm {...v} />;
    case "template-3":
      return <Minimal {...v} />;
    case "template-4":
      return <ClassicForm {...v} />;
    case "template-1":
    default:
      return <StandardReceipt {...v} />;
  }
}

type RV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  receiptNo: string;
  date: string;
  amount: string;
  paymentMode: string;
  periodFrom: string;
  periodTo: string;
  tenantName: string;
  tenantPan: string;
  landlordName: string;
  landlordPan: string;
  propertyAddress: string;
  amountFmt: string;
  words: string;
  lastBalance: string;
  houseTax: string;
  electricityBill: string;
  waterBill: string;
  advance: string;
  balance: string;
};

/** The shared "Received a sum of …" sentence. */
function Sentence(p: RV) {
  const { t } = p;
  return (
    <p style={{ margin: 0, lineHeight: 1.85, color: t.ink, fontSize: 14 }}>
      Received a sum of <strong style={{ color: t.accent }}>{p.amountFmt}</strong>
      {p.words ? <span style={{ color: t.muted }}> ({p.words}) </span> : " "}
      from <strong>{p.tenantName || "the Tenant"}</strong> towards rent for the property{" "}
      <strong>{p.propertyAddress || "—"}</strong>
      {p.periodFrom || p.periodTo ? (
        <>
          {" "}for the period <strong>{p.periodFrom || "—"}</strong> to <strong>{p.periodTo || "—"}</strong>
        </>
      ) : null}
      {p.paymentMode ? (
        <>
          , paid via <strong>{p.paymentMode}</strong>
        </>
      ) : null}
      .
    </p>
  );
}

/* ================================================================== */
/* TEMPLATE 1 — Standard Receipt                                      */
/* ================================================================== */

function StandardReceipt(p: RV) {
  const { t } = p;
  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: "Georgia, 'Times New Roman', serif",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 6,
        overflow: "hidden",
        ...crumpleStyle(p.crumpled),
      }}
    >
      {/* accent header */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "16px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>RENT RECEIPT</div>
        <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1 }}>For House Rent Allowance (HRA)</div>
      </div>

      <div style={{ padding: "22px 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 13 }}>
          <div>
            <span style={{ color: t.muted }}>Receipt No: </span>
            <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
          </div>
          <div>
            <span style={{ color: t.muted }}>Date: </span>
            <strong style={{ color: t.ink }}>{p.date || "—"}</strong>
          </div>
        </div>

        <div
          style={{
            border: `1px dashed ${t.muted}`,
            borderRadius: 6,
            padding: "16px 18px",
            marginBottom: 18,
          }}
        >
          <Sentence {...p} />
        </div>

        {p.tenantPan ? (
          <div style={{ fontSize: 12, color: t.muted, marginBottom: 6 }}>
            Tenant PAN: <span style={{ color: t.ink }}>{p.tenantPan}</span>
          </div>
        ) : null}

        <Signature name={p.landlordName} pan={p.landlordPan} accent={t.accent} ink={t.ink} muted={t.muted} />

        <div style={{ textAlign: "center", color: t.muted, fontSize: 11, marginTop: 22, borderTop: `1px solid ${t.muted}`, paddingTop: 10 }}>
          This receipt is issued for income-tax HRA exemption purposes.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Bordered Form                                         */
/* ================================================================== */

function FormRow({ label, value, ink, muted, last }: { label: string; value: string; ink: string; muted: string; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: last ? "none" : `1px solid ${muted}`,
        fontSize: 13,
      }}
    >
      <div style={{ width: 170, padding: "9px 12px", color: muted, fontWeight: 700, borderRight: `1px solid ${muted}`, background: "rgba(0,0,0,0.02)" }}>
        {label}
      </div>
      <div style={{ flex: 1, padding: "9px 12px", color: ink }}>{value || "—"}</div>
    </div>
  );
}

function BorderedForm(p: RV) {
  const { t } = p;
  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: "Arial, Helvetica, sans-serif",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
        padding: 22,
        ...crumpleStyle(p.crumpled),
      }}
    >
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: t.accent }}>RENT RECEIPT</div>
        <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1 }}>House Rent Allowance — Income Tax</div>
      </div>

      <div style={{ border: `1px solid ${t.muted}`, marginBottom: 16 }}>
        <FormRow label="Receipt No." value={p.receiptNo} ink={t.ink} muted={t.muted} />
        <FormRow label="Date" value={p.date} ink={t.ink} muted={t.muted} />
        <FormRow label="Tenant Name" value={p.tenantName} ink={t.ink} muted={t.muted} />
        <FormRow label="Tenant PAN" value={p.tenantPan} ink={t.ink} muted={t.muted} />
        <FormRow label="Landlord Name" value={p.landlordName} ink={t.ink} muted={t.muted} />
        <FormRow label="Landlord PAN" value={p.landlordPan} ink={t.ink} muted={t.muted} />
        <FormRow label="Property Address" value={p.propertyAddress} ink={t.ink} muted={t.muted} />
        <FormRow label="Rent Period" value={[p.periodFrom, p.periodTo].filter(Boolean).join("  to  ")} ink={t.ink} muted={t.muted} />
        <FormRow label="Payment Mode" value={p.paymentMode} ink={t.ink} muted={t.muted} />
        <FormRow label="Amount" value={p.words ? `${p.amountFmt}  (${p.words})` : p.amountFmt} ink={t.ink} muted={t.muted} last />
      </div>

      <div style={{ border: `1px dashed ${t.muted}`, borderRadius: 4, padding: "12px 14px" }}>
        <Sentence {...p} />
      </div>

      <Signature name={p.landlordName} pan={p.landlordPan} accent={t.accent} ink={t.ink} muted={t.muted} />
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 3 — Minimal                                               */
/* ================================================================== */

function Minimal(p: RV) {
  const { t } = p;
  return (
    <div
      style={{
        width: 560,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.06)",
        padding: "44px 48px",
        ...crumpleStyle(p.crumpled),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36 }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: 4, color: t.ink }}>RENT RECEIPT</div>
        <div style={{ fontSize: 11, color: t.muted, textAlign: "right" }}>
          {p.receiptNo ? <div>No. {p.receiptNo}</div> : null}
          {p.date ? <div>{p.date}</div> : null}
        </div>
      </div>

      <div style={{ fontSize: 12, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
        Amount Received
      </div>
      <div style={{ fontSize: 34, fontWeight: 300, color: t.accent, marginBottom: 4 }}>{p.amountFmt}</div>
      {p.words ? <div style={{ fontSize: 12, color: t.muted, marginBottom: 28 }}>{p.words}</div> : <div style={{ marginBottom: 28 }} />}

      <div style={{ borderTop: `1px solid ${t.muted}`, paddingTop: 22 }}>
        <Sentence {...p} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28, fontSize: 12, color: t.muted }}>
        <RevenueStamp muted={t.muted} />
        <div style={{ flex: 1, padding: "0 16px" }}>
          {p.tenantPan ? <div>Tenant PAN: <span style={{ color: t.ink }}>{p.tenantPan}</span></div> : null}
          {p.landlordPan ? <div>Landlord PAN: <span style={{ color: t.ink }}>{p.landlordPan}</span></div> : null}
        </div>
        <div style={{ textAlign: "center", minWidth: 170 }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5 }}>
            <span style={{ color: t.ink, fontWeight: 600 }}>{p.landlordName || "Landlord"}</span>
            <div style={{ fontSize: 11 }}>Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 4 — Classic Form (the blue rent-receipt-book layout)      */
/* ================================================================== */

function ClassicForm(p: RV) {
  const BLUE = "#2350c9";
  const n = (s: string) => {
    const x = parseFloat(s);
    return Number.isFinite(x) ? x : 0;
  };
  const sym = symbolFor(p.currency);
  const numStr = (s: string) => (s.trim() === "" ? "" : n(s).toLocaleString("en-IN"));
  const fmtDate = (iso: string) => {
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    const M = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${m[3]} ${M[+m[2]]} ${m[1]}`;
  };
  const total =
    n(p.amount) + n(p.lastBalance) + n(p.houseTax) + n(p.electricityBill) + n(p.waterBill);
  const totalWords = rupeesToWords(String(Math.round(total)));

  const Field = ({ label, value, flex = 1 }: { label: string; value: string; flex?: number }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, flex }}>
      <span style={{ color: BLUE, fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>
      <span
        style={{
          flex: 1,
          minWidth: 24,
          borderBottom: `1.5px solid ${BLUE}`,
          color: BLUE,
          textAlign: "center",
          paddingBottom: 1,
          minHeight: 18,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div
      style={{
        width: 660,
        margin: "0 auto",
        color: BLUE,
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 14,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        ...paperStyle(p.t, p.crumpled),
      }}
    >
      <div style={{ border: `2px solid ${BLUE}`, margin: 7, padding: "20px 22px" }}>
        {/* top: receipt no / dated / owner + RENT RECEIPT badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 20 }}>
              <Field label="Receipt No." value={p.receiptNo} />
              <Field label="Dated" value={fmtDate(p.date)} />
            </div>
            <Field label="Owner's Name" value={p.landlordName} />
          </div>
          <div
            style={{
              border: `2px solid ${BLUE}`,
              padding: "5px 14px",
              textAlign: "right",
              lineHeight: 1.0,
              fontStyle: "italic",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: 1,
            }}
          >
            <div>RENT</div>
            <div>RECEIPT</div>
          </div>
        </div>

        {/* main bordered block */}
        <div
          style={{
            border: `2px solid ${BLUE}`,
            marginTop: 16,
            padding: "16px 16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Field label="Received From (Tenant)" value={p.tenantName} />
          <Field label="Address" value={p.propertyAddress} />
          <div style={{ display: "flex", gap: 18 }}>
            <Field label={`Monthly Rent ${sym}.`} value={numStr(p.amount)} flex={2} />
            <Field label="From" value={fmtDate(p.periodFrom)} />
            <Field label="To" value={fmtDate(p.periodTo)} />
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Field label={`Last Balance ${sym}.`} value={numStr(p.lastBalance)} />
            <Field label={`House Tax ${sym}.`} value={numStr(p.houseTax)} />
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Field label={`Electricity Bill ${sym}.`} value={numStr(p.electricityBill)} />
            <Field label={`Water Bill ${sym}.`} value={numStr(p.waterBill)} />
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Field label={`Total ${sym}.`} value={total ? total.toLocaleString("en-IN") : ""} />
            <Field label={`Balance ${sym}.`} value={numStr(p.balance)} />
            <Field label={`Advance ${sym}.`} value={numStr(p.advance)} />
          </div>
          <Field label={`Total in Words ${sym}.`} value={totalWords} />
        </div>

        {/* bottom: amount box + revenue stamp + signature */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18, gap: 16 }}>
          <div style={{ border: `2px solid ${BLUE}`, padding: "12px 18px", fontWeight: 800, fontSize: 18, minWidth: 140 }}>
            {sym}. {total ? total.toLocaleString("en-IN") : ""}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/revenue-stamp.png"
              alt="Revenue Stamp"
              width={62}
              style={{ width: 62, height: "auto", border: `1px dashed ${BLUE}`, padding: 3 }}
            />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>Sign. of Owner</span>
              <span style={{ width: 130, borderBottom: `1.5px solid ${BLUE}`, textAlign: "center", paddingBottom: 1 }}>
                {p.landlordName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
