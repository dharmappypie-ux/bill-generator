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
  care: string;
};

const OPERATORS: Record<string, Operator> = {
  Airtel: {
    name: "Airtel",
    legal: "Bharti Airtel Limited",
    address: "Airtel Center, Plot No. 16, Udyog Vihar Phase IV, Gurugram, Haryana 122015",
    gstin: "06AAACB2894G1ZW",
    care: "121",
  },
  Jio: {
    name: "Jio",
    legal: "Reliance Jio Infocomm Limited",
    address: "Office-101, Saffron, Nr. Centre Point, Panchwati, Ambawadi, Ahmedabad, Gujarat 380006",
    gstin: "24AAACR5055K1Z2",
    care: "199",
  },
  Vi: {
    name: "Vi",
    legal: "Vodafone Idea Limited",
    address: "Suman Tower, Plot No. 18, Sector 11, Gandhinagar, Gujarat 382011",
    gstin: "24AAACB3055A1ZK",
    care: "199",
  },
  BSNL: {
    name: "BSNL",
    legal: "Bharat Sanchar Nigam Limited",
    address: "Bharat Sanchar Bhawan, Harish Chandra Mathur Lane, Janpath, New Delhi 110001",
    gstin: "07AABCB5576G1Z6",
    care: "1503",
  },
};

function operatorOf(id: string): Operator {
  return (
    OPERATORS[id] ?? {
      name: id || "Recharge",
      legal: id || "Telecom Operator",
      address: "",
      gstin: "",
      care: "198",
    }
  );
}

/* ------------------------------------------------------------------ */
/* derived view-model                                                 */
/* ------------------------------------------------------------------ */

type MV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  op: Operator;
  operator: string;
  mobileNumber: string;
  planAmount: number; // amount paid (tax-inclusive)
  validity: string;
  talktime: string;
  dataPack: string;
  txnId: string;
  date: string;
  time: string;
  paymentMethod: string;
  // GST is shown as a back-calculated split out of the inclusive plan amount.
  baseValue: number; // plan / 1.18
  gst: number; // plan - base
  total: number; // == planAmount
};

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";
const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";

export default function RechargeBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const op = operatorOf(str(data, "operator"));
  const planAmount = num(str(data, "planAmount"));
  const baseValue = planAmount / 1.18;
  const gst = planAmount - baseValue;

  const v: MV = {
    t,
    crumpled,
    currency,
    op,
    operator: str(data, "operator"),
    mobileNumber: str(data, "mobileNumber"),
    planAmount,
    validity: str(data, "validity"),
    talktime: str(data, "talktime"),
    dataPack: str(data, "data"),
    txnId: str(data, "txnId"),
    date: str(data, "date"),
    time: str(data, "time"),
    paymentMethod: str(data, "paymentMethod"),
    baseValue,
    gst,
    total: planAmount,
  };

  switch (template) {
    case "template-2":
      return <ReceiptCard {...v} />;
    case "template-1":
    default:
      return <ThermalSlip {...v} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — Thermal Slip (~340px monospace)                       */
/* ================================================================== */

function ThermalSlip(p: MV) {
  const { t, op } = p;
  const f = (n: number) => plain(n, p.currency);

  return (
    <div
      style={{
        width: 340,
        margin: "0 auto",
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 12.5,
        padding: "22px 24px 20px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>{op.name}</div>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 400, lineHeight: 1.4 }}>{op.legal}</div>
        <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: 2, marginTop: 9 }}>RECHARGE RECEIPT</div>
        <div style={{ fontSize: 10.5, color: t.muted, fontWeight: 400, marginTop: 2 }}>Prepaid Mobile Top-up</div>
      </div>

      <Dashes color={t.muted} />

      <Line k="Mobile No" v={p.mobileNumber} ink={t.ink} muted={t.muted} />
      <Line k="Operator" v={op.name} ink={t.ink} muted={t.muted} />
      <Line k="Txn ID" v={p.txnId} ink={t.ink} muted={t.muted} />
      <Line k="Date" v={p.date ? fmtDMY(p.date) : ""} ink={t.ink} muted={t.muted} />
      <Line k="Time" v={p.time} ink={t.ink} muted={t.muted} />

      <Dashes color={t.muted} />

      {/* plan benefits */}
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 11.5, letterSpacing: 1.5 }}>PLAN BENEFITS</div>
      <div style={{ height: 4 }} />
      <Line k="Validity" v={p.validity} ink={t.ink} muted={t.muted} />
      <Line k="Talktime" v={p.talktime} ink={t.ink} muted={t.muted} />
      <Line k="Data" v={p.dataPack} ink={t.ink} muted={t.muted} />

      <Dashes color={t.muted} />

      {/* amount breakup (GST split out of inclusive plan amount) */}
      <Line k="Plan Value" v={f(p.baseValue)} ink={t.ink} muted={t.muted} />
      <Line k="GST 18%" v={f(p.gst)} ink={t.ink} muted={t.muted} />
      <Line k="Pay Mode" v={p.paymentMethod} ink={t.ink} muted={t.muted} />

      <Dashes color={t.muted} />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
        <span>AMOUNT PAID</span>
        <span>{money(p.total, p.currency)}</span>
      </div>

      <Dashes color={t.muted} />

      <div style={{ textAlign: "center", lineHeight: 1.7 }}>
        <div style={{ fontWeight: 800, letterSpacing: 1 }}>RECHARGE SUCCESSFUL</div>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 400, marginTop: 6 }}>
          {op.gstin ? `GSTIN: ${op.gstin}` : null}
        </div>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 400 }}>
          Care: dial {op.care} from your {op.name} number
        </div>
        <div style={{ fontSize: 11, color: t.muted, fontWeight: 400, marginTop: 6 }}>
          *** Computer generated — no signature ***
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Receipt Card (~400px, app-style success card)         */
/* ================================================================== */

function ReceiptCard(p: MV) {
  const { t, op } = p;
  const f = (n: number) => plain(n, p.currency);
  const dateTime = [p.date ? fmtDMonY(p.date) : "", p.time].filter(Boolean).join(" • ");

  return (
    <div
      style={{
        width: 400,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 13,
        padding: 0,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12,
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header band */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "18px 22px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1 }}>{op.name}</div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 4 }}>{op.legal}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>RECHARGE</div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>Prepaid Receipt</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 22px 22px" }}>
        {/* success badge + amount */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              display: "inline-block",
              background: t.accent,
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              padding: "4px 14px",
              borderRadius: 999,
            }}
          >
            ✓ RECHARGE SUCCESSFUL
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: t.ink, marginTop: 12, lineHeight: 1 }}>
            {money(p.total, p.currency)}
          </div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>
            recharged on <strong style={{ color: t.ink }}>{p.mobileNumber || "—"}</strong>
          </div>
        </div>

        {/* benefits strip */}
        <div
          style={{
            display: "flex",
            border: `1px solid ${t.muted}`,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <Cell label="Validity" value={p.validity || "—"} ink={t.ink} muted={t.muted} />
          <Cell label="Data" value={p.dataPack || "—"} ink={t.ink} muted={t.muted} divider />
          <Cell label="Talktime" value={p.talktime || "—"} ink={t.ink} muted={t.muted} divider />
        </div>

        {/* transaction details */}
        <div style={{ fontSize: 12.5 }}>
          <Row k="Transaction ID" v={p.txnId} ink={t.ink} muted={t.muted} />
          <Row k="Date & Time" v={dateTime} ink={t.ink} muted={t.muted} />
          <Row k="Payment Method" v={p.paymentMethod} ink={t.ink} muted={t.muted} />
          <Row k="Operator" v={op.name} ink={t.ink} muted={t.muted} />
        </div>

        {/* amount breakup */}
        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "14px 0 4px" }} />
        <div style={{ fontSize: 12.5 }}>
          <Row k="Plan Value" v={f(p.baseValue)} ink={t.ink} muted={t.muted} />
          <Row k="GST (18%)" v={f(p.gst)} ink={t.ink} muted={t.muted} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 12px",
            background: t.accent,
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 15,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          <span>Amount Paid</span>
          <span>{money(p.total, p.currency)}</span>
        </div>

        {/* footer */}
        <div
          style={{
            borderTop: `1px solid ${t.muted}`,
            marginTop: 18,
            paddingTop: 10,
            color: t.muted,
            fontSize: 10.5,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          {op.gstin ? (
            <div>
              GSTIN: <span style={{ color: t.ink }}>{op.gstin}</span>
            </div>
          ) : null}
          <div>
            This is a computer-generated receipt. For queries dial{" "}
            <strong style={{ color: t.ink }}>{op.care}</strong> from your {op.name} number. E. &amp; O.E.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* small render helpers                                               */
/* ------------------------------------------------------------------ */

function Cell({
  label,
  value,
  ink,
  muted,
  divider,
}: {
  label: string;
  value: string;
  ink: string;
  muted: string;
  divider?: boolean;
}) {
  return (
    <div style={{ flex: 1, padding: "8px 10px", borderLeft: divider ? `1px solid ${muted}` : "none", textAlign: "center" }}>
      <div style={{ color: muted, fontSize: 9.5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ color: ink, fontWeight: 700, fontSize: 12, marginTop: 3, overflowWrap: "anywhere" }}>{value}</div>
    </div>
  );
}

function Row({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, lineHeight: 1.85 }}>
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: ink, fontWeight: 600, textAlign: "right", maxWidth: "62%", overflowWrap: "anywhere" }}>
        {v || "—"}
      </span>
    </div>
  );
}

function Dashes({ color }: { color: string }) {
  return (
    <div style={{ overflow: "hidden", color, textAlign: "center", margin: "8px 0", lineHeight: 1 }}>{"- ".repeat(24)}</div>
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
