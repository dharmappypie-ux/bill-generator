import { PreviewProps } from "@/types/generator";
import { themeById } from "@/lib/themes";
import { str, num, money, plain, fmtDMonY, fmtDMY, paperStyle } from "./shared";

/* ------------------------------------------------------------------ */
/* operator-specific branding                                         */
/* ------------------------------------------------------------------ */

type Operator = {
  name: string;
  legal: string;
  address: string;
  gstin: string;
  color: string; // brand color, used only as an accent tint where readable
  care: string;
};

const OPERATORS: Record<string, Operator> = {
  Airtel: {
    name: "Airtel",
    legal: "Bharti Airtel Limited",
    address: "Airtel Center, Plot No. 16, Udyog Vihar Phase IV, Gurugram, Haryana 122015",
    gstin: "06AAACB2894G1ZW",
    color: "#e40000",
    care: "121",
  },
  Jio: {
    name: "Jio",
    legal: "Reliance Jio Infocomm Limited",
    address: "Office-101, Saffron, Nr. Centre Point, Panchwati, Ambawadi, Ahmedabad, Gujarat 380006",
    gstin: "24AAACR5055K1Z2",
    color: "#0a2885",
    care: "199",
  },
  Vi: {
    name: "Vi",
    legal: "Vodafone Idea Limited",
    address: "Suman Tower, Plot No. 18, Sector 11, Gandhinagar, Gujarat 382011",
    gstin: "24AAACB3055A1ZK",
    color: "#e60000",
    care: "199",
  },
  BSNL: {
    name: "BSNL",
    legal: "Bharat Sanchar Nigam Limited",
    address: "Bharat Sanchar Bhawan, Harish Chandra Mathur Lane, Janpath, New Delhi 110001",
    gstin: "07AABCB5576G1Z6",
    color: "#cf0a2c",
    care: "1503",
  },
};

function operatorOf(id: string): Operator {
  return (
    OPERATORS[id] ?? {
      name: id || "Mobile",
      legal: id || "Telecom Operator",
      address: "",
      gstin: "",
      color: "#26262b",
      care: "198",
    }
  );
}

/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */

type MV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  op: Operator;
  operator: string;
  mobileNumber: string;
  customerName: string;
  planName: string;
  billingFrom: string;
  billingTo: string;
  rental: number;
  call: number;
  dataC: number;
  sms: number;
  tax: number;
  usageSubtotal: number; // rental + call + data + sms
  total: number; // usageSubtotal + tax
  invoiceNo: string;
  dueDate: string;
};

export default function MobileBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const operator = str(data, "operator");
  const op = operatorOf(operator);

  const rental = num(str(data, "rentalCharge"));
  const call = num(str(data, "callCharges"));
  const dataC = num(str(data, "dataCharges"));
  const sms = num(str(data, "smsCharges"));
  const tax = num(str(data, "tax"));
  const usageSubtotal = rental + call + dataC + sms;
  const total = usageSubtotal + tax;

  const v: MV = {
    t,
    crumpled,
    currency,
    op,
    operator,
    mobileNumber: str(data, "mobileNumber"),
    customerName: str(data, "customerName"),
    planName: str(data, "planName"),
    billingFrom: str(data, "billingFrom"),
    billingTo: str(data, "billingTo"),
    rental,
    call,
    dataC,
    sms,
    tax,
    usageSubtotal,
    total,
    invoiceNo: str(data, "invoiceNo"),
    dueDate: str(data, "dueDate"),
  };

  switch (template) {
    case "template-2":
      return <SummarySlip {...v} />;
    case "template-1":
    default:
      return <StatementLayout {...v} />;
  }
}

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";
const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";

/** period "01 Jun 2026 – 30 Jun 2026" (falls back gracefully when empty). */
function periodLabel(from: string, to: string): string {
  const a = from ? fmtDMonY(from) : "";
  const b = to ? fmtDMonY(to) : "";
  if (a && b) return `${a} – ${b}`;
  return a || b || "—";
}

/* ================================================================== */
/* TEMPLATE 1 — Statement (full A-width tax-style invoice, ~640px)    */
/* ================================================================== */

function StatementLayout(p: MV) {
  const { t, op } = p;
  const f = (n: number) => plain(n, p.currency);

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        padding: 0,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header band */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: t.accent,
          color: "#ffffff",
          padding: "18px 26px",
        }}
      >
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1, lineHeight: 1 }}>{op.name}</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>{op.legal}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>TAX INVOICE</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>Postpaid Mobile Statement</div>
        </div>
      </div>

      <div style={{ padding: "20px 26px 26px" }}>
        {/* operator address + GSTIN */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 16 }}>
          <div style={{ maxWidth: "62%" }}>
            {op.address ? <div style={{ color: t.muted, lineHeight: 1.55 }}>{op.address}</div> : null}
            {op.gstin ? (
              <div style={{ color: t.ink, marginTop: 6, fontWeight: 700 }}>
                GSTIN: <span style={{ fontWeight: 400 }}>{op.gstin}</span>
              </div>
            ) : null}
          </div>
          <div style={{ textAlign: "right", color: t.ink, lineHeight: 1.7 }}>
            {p.invoiceNo ? (
              <div>
                <span style={{ color: t.muted }}>Invoice No: </span>
                {p.invoiceNo}
              </div>
            ) : null}
            <div>
              <span style={{ color: t.muted }}>Bill Date: </span>
              {p.billingTo ? fmtDMY(p.billingTo) : "—"}
            </div>
            {p.dueDate ? (
              <div>
                <span style={{ color: t.muted }}>Due Date: </span>
                <strong>{fmtDMY(p.dueDate)}</strong>
              </div>
            ) : null}
          </div>
        </div>

        {/* account summary box */}
        <div
          style={{
            display: "flex",
            border: `1px solid ${t.muted}`,
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          <SummaryCell label="Customer Name" value={p.customerName || "—"} muted={t.muted} ink={t.ink} />
          <SummaryCell label="Mobile Number" value={p.mobileNumber || "—"} muted={t.muted} ink={t.ink} divider />
          <SummaryCell label="Plan" value={p.planName || "—"} muted={t.muted} ink={t.ink} divider />
        </div>

        <div style={{ marginBottom: 14, fontSize: 12 }}>
          <span style={{ color: t.muted, fontWeight: 700 }}>Billing Period: </span>
          <span style={{ color: t.ink }}>{periodLabel(p.billingFrom, p.billingTo)}</span>
        </div>

        {/* charges table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: t.accent, color: "#ffffff" }}>
              <th style={{ textAlign: "left", padding: "8px 10px", border: "1px solid rgba(0,0,0,0.15)" }}>
                Description of Charges
              </th>
              <th style={{ textAlign: "right", padding: "8px 10px", border: "1px solid rgba(0,0,0,0.15)", width: 150 }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <ChargeRow label={`Monthly Rental${p.planName ? ` — ${p.planName}` : ""}`} value={f(p.rental)} ink={t.ink} muted={t.muted} />
            <ChargeRow label="Call / Voice Charges" value={f(p.call)} ink={t.ink} muted={t.muted} />
            <ChargeRow label="Mobile Data Charges" value={f(p.dataC)} ink={t.ink} muted={t.muted} />
            <ChargeRow label="SMS Charges" value={f(p.sms)} ink={t.ink} muted={t.muted} />
          </tbody>
        </table>

        {/* totals block */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 300 }}>
            <TotalRow label="Current Charges" value={f(p.usageSubtotal)} ink={t.ink} muted={t.muted} />
            <TotalRow label="GST (CGST + SGST)" value={f(p.tax)} ink={t.ink} muted={t.muted} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "11px 14px",
                background: t.accent,
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                borderRadius: 5,
                marginTop: 8,
              }}
            >
              <span>Amount Payable</span>
              <span>{money(p.total, p.currency)}</span>
            </div>
            {p.dueDate ? (
              <div style={{ textAlign: "right", color: t.muted, fontSize: 11, marginTop: 6 }}>
                Pay by <strong style={{ color: t.ink }}>{fmtDMonY(p.dueDate)}</strong> to avoid late fee
              </div>
            ) : null}
          </div>
        </div>

        {/* footer */}
        <div style={{ borderTop: `1px solid ${t.muted}`, marginTop: 24, paddingTop: 12, color: t.muted, fontSize: 10.5, lineHeight: 1.6 }}>
          This is a computer-generated invoice and does not require a signature. GST is charged as applicable. For billing
          queries dial <strong style={{ color: t.ink }}>{op.care}</strong> from your {op.name} mobile. E. &amp; O.E.
        </div>
      </div>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  muted,
  ink,
  divider,
}: {
  label: string;
  value: string;
  muted: string;
  ink: string;
  divider?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "10px 14px",
        borderLeft: divider ? `1px solid ${muted}` : "none",
      }}
    >
      <div style={{ color: muted, fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      <div style={{ color: ink, fontWeight: 700, fontSize: 13, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function ChargeRow({ label, value, ink, muted }: { label: string; value: string; ink: string; muted: string }) {
  return (
    <tr>
      <td style={{ padding: "9px 10px", border: `1px solid ${muted}`, color: ink }}>{label}</td>
      <td style={{ padding: "9px 10px", border: `1px solid ${muted}`, color: ink, textAlign: "right" }}>{value}</td>
    </tr>
  );
}

function TotalRow({ label, value, ink, muted }: { label: string; value: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 14px", color: muted }}>
      <span>{label}</span>
      <span style={{ color: ink }}>{value}</span>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Summary (compact thermal-style slip, ~380px)          */
/* ================================================================== */

function SummarySlip(p: MV) {
  const { t, op } = p;
  const f = (n: number) => plain(n, p.currency);

  return (
    <div
      style={{
        width: 380,
        margin: "0 auto",
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 12.5,
        padding: "24px 28px 22px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>{op.name}</div>
        <div style={{ fontSize: 10.5, color: t.muted, fontWeight: 400 }}>{op.legal}</div>
        <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 2, marginTop: 10 }}>POSTPAID BILL SUMMARY</div>
      </div>

      <Dashes color={t.muted} />

      <Line k="Invoice" v={p.invoiceNo} ink={t.ink} muted={t.muted} />
      <Line k="Customer" v={p.customerName} ink={t.ink} muted={t.muted} />
      <Line k="Mobile No" v={p.mobileNumber} ink={t.ink} muted={t.muted} />
      <Line k="Plan" v={p.planName} ink={t.ink} muted={t.muted} />
      <Line k="From" v={p.billingFrom ? fmtDMY(p.billingFrom) : ""} ink={t.ink} muted={t.muted} />
      <Line k="To" v={p.billingTo ? fmtDMY(p.billingTo) : ""} ink={t.ink} muted={t.muted} />

      <Dashes color={t.muted} />

      <Line k="Rental" v={f(p.rental)} ink={t.ink} muted={t.muted} />
      <Line k="Calls" v={f(p.call)} ink={t.ink} muted={t.muted} />
      <Line k="Data" v={f(p.dataC)} ink={t.ink} muted={t.muted} />
      <Line k="SMS" v={f(p.sms)} ink={t.ink} muted={t.muted} />

      <Dashes color={t.muted} />

      <Line k="Subtotal" v={f(p.usageSubtotal)} ink={t.ink} muted={t.muted} />
      <Line k="GST 18%" v={f(p.tax)} ink={t.ink} muted={t.muted} />

      <Dashes color={t.muted} />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
        <span>TOTAL DUE</span>
        <span>{money(p.total, p.currency)}</span>
      </div>

      <Dashes color={t.muted} />

      <div style={{ textAlign: "center", lineHeight: 1.7 }}>
        {p.dueDate ? <div>DUE BY: {fmtDMonY(p.dueDate)}</div> : null}
        <div style={{ marginTop: 8 }}>PAY ON TIME TO STAY CONNECTED</div>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 400 }}>
          Queries? Dial {op.care} from your {op.name} mobile
        </div>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 400, marginTop: 6 }}>
          *** Computer generated — no signature ***
        </div>
      </div>
    </div>
  );
}

function Dashes({ color }: { color: string }) {
  return (
    <div style={{ overflow: "hidden", color, textAlign: "center", margin: "8px 0", lineHeight: 1 }}>
      {"- ".repeat(28)}
    </div>
  );
}

function Line({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, lineHeight: 1.85 }}>
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: ink, textAlign: "right", maxWidth: "62%", overflowWrap: "anywhere" }}>{v || "—"}</span>
    </div>
  );
}
