import { PreviewProps } from "@/types/generator";
import { str, num, money, fmtDMonY, paperStyle, KV, Divider } from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared values                                                      */
/* ------------------------------------------------------------------ */

type RV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  orgName: string;
  orgAddress: string;
  orgPan: string;
  regNo80G: string;
  receiptNo: string;
  date: string;
  donorName: string;
  donorPan: string;
  donorAddress: string;
  amount: string;
  paymentMode: string;
  purpose: string;
};

/* number → Indian-rupee words (whole rupees only) */
function inWords(n: number): string {
  const v = Math.floor(Math.abs(n));
  if (v === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x: number): string => {
    if (x < 20) return ones[x];
    return `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
  };
  const three = (x: number): string => {
    const h = Math.floor(x / 100);
    const r = x % 100;
    return `${h ? ones[h] + " Hundred" + (r ? " " : "") : ""}${r ? two(r) : ""}`;
  };
  let res = "";
  const crore = Math.floor(v / 10000000);
  const lakh = Math.floor((v % 10000000) / 100000);
  const thousand = Math.floor((v % 100000) / 1000);
  const rest = v % 1000;
  if (crore) res += three(crore) + " Crore ";
  if (lakh) res += two(lakh) + " Lakh ";
  if (thousand) res += two(thousand) + " Thousand ";
  if (rest) res += three(rest);
  return res.trim();
}

export default function DonationReceiptPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const v: RV = {
    t,
    crumpled,
    currency,
    orgName: str(data, "orgName"),
    orgAddress: str(data, "orgAddress"),
    orgPan: str(data, "orgPan"),
    regNo80G: str(data, "regNo80G"),
    receiptNo: str(data, "receiptNo"),
    date: str(data, "date"),
    donorName: str(data, "donorName"),
    donorPan: str(data, "donorPan"),
    donorAddress: str(data, "donorAddress"),
    amount: str(data, "amount"),
    paymentMode: str(data, "paymentMode") || "Cash",
    purpose: str(data, "purpose"),
  };

  switch (template) {
    case "template-2":
      return <SimpleReceipt {...v} />;
    case "template-1":
    default:
      return <Receipt80G {...v} />;
  }
}

function amountWords(amount: string, currency: string): string {
  const n = num(amount);
  if (!n) return "—";
  const unit = currency === "INR" ? "Rupees" : currency;
  return `${unit} ${inWords(n)} Only`;
}

function orgInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "OR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ================================================================== */
/* TEMPLATE 1 — 80G Receipt (~640px)                                  */
/* ================================================================== */

function Receipt80G(p: RV) {
  const { t } = p;
  const amountFmt = money(p.amount, p.currency);

  return (
    <div
      style={{
        width: 640,
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
      {/* ---- header banner ---- */}
      <div
        style={{
          background: t.accent,
          color: "#ffffff",
          padding: "20px 30px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
            flexShrink: 0,
          }}
        >
          {orgInitials(p.orgName)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.2 }}>
            {p.orgName || "Organisation Name"}
          </div>
          <div style={{ fontSize: 11.5, opacity: 0.9, lineHeight: 1.5, marginTop: 2 }}>
            {p.orgAddress || "Registered Office Address"}
          </div>
        </div>
      </div>

      {/* registration strip */}
      <div
        style={{
          background: "rgba(0,0,0,0.04)",
          borderBottom: `1px solid ${t.muted}`,
          padding: "8px 30px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: t.muted,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>
          PAN: <strong style={{ color: t.ink }}>{p.orgPan || "—"}</strong>
        </span>
        <span>
          80G Reg. No.: <strong style={{ color: t.ink }}>{p.regNo80G || "—"}</strong>
        </span>
      </div>

      <div style={{ padding: "20px 30px 26px" }}>
        {/* title + receipt meta */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 3,
              color: t.accent,
              borderBottom: `2px solid ${t.accent}`,
              paddingBottom: 4,
            }}
          >
            DONATION RECEIPT
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 14 }}>
          <div>
            <span style={{ color: t.muted }}>Receipt No.: </span>
            <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
          </div>
          <div>
            <span style={{ color: t.muted }}>Date: </span>
            <strong style={{ color: t.ink }}>{p.date ? fmtDMonY(p.date) : "—"}</strong>
          </div>
        </div>

        <Divider color={t.muted} />

        {/* donor card */}
        <div
          style={{
            border: `1px solid ${t.muted}`,
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 16,
            background: "rgba(0,0,0,0.015)",
          }}
        >
          <div style={{ fontSize: 10.5, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            Received With Thanks From
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.ink, marginBottom: 6 }}>{p.donorName || "—"}</div>
          <KV k="Donor PAN" v={p.donorPan} ink={t.ink} muted={t.muted} />
          {p.donorAddress ? <KV k="Address" v={p.donorAddress} ink={t.ink} muted={t.muted} /> : null}
        </div>

        {/* donation details */}
        <div style={{ marginBottom: 16 }}>
          <KV k="Payment Mode" v={p.paymentMode} ink={t.ink} muted={t.muted} />
          <KV k="Purpose / Fund" v={p.purpose} ink={t.ink} muted={t.muted} />
          <KV k="Amount in Words" v={amountWords(p.amount, p.currency)} ink={t.ink} muted={t.muted} />
        </div>

        {/* amount block */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: t.accent,
            color: "#ffffff",
            borderRadius: 8,
            padding: "14px 20px",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>Donation Amount</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{amountFmt}</div>
        </div>

        {/* 80G note */}
        <div
          style={{
            border: `1px dashed ${t.muted}`,
            borderRadius: 8,
            padding: "12px 16px",
            marginTop: 18,
            fontSize: 12,
            color: t.ink,
            lineHeight: 1.7,
          }}
        >
          Received with sincere thanks the above-mentioned donation from{" "}
          <strong>{p.donorName || "the donor"}</strong>. This contribution is eligible for deduction under
          <strong> Section 80G</strong> of the Income-Tax Act, 1961, vide registration no.{" "}
          <strong>{p.regNo80G || "—"}</strong>.
        </div>

        {/* signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36 }}>
          <div style={{ textAlign: "center", minWidth: 220 }}>
            <div style={{ height: 26 }} />
            <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>For {p.orgName || "Organisation"}</div>
              <div style={{ fontSize: 11, color: t.muted }}>Authorised Signatory</div>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            color: t.muted,
            fontSize: 10.5,
            marginTop: 20,
            borderTop: `1px solid ${t.muted}`,
            paddingTop: 10,
            lineHeight: 1.5,
          }}
        >
          This is a computer-generated receipt. Please retain it for your income-tax records.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Simple Receipt                                        */
/* ================================================================== */

function SimpleReceipt(p: RV) {
  const { t } = p;
  const amountFmt = money(p.amount, p.currency);

  return (
    <div
      style={{
        width: 580,
        margin: "0 auto",
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        padding: "40px 46px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.06)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.ink}`, paddingBottom: 14, marginBottom: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: t.ink, letterSpacing: 0.5 }}>
          {p.orgName || "Organisation Name"}
        </div>
        {p.orgAddress ? (
          <div style={{ fontSize: 11.5, color: t.muted, marginTop: 3, lineHeight: 1.5 }}>{p.orgAddress}</div>
        ) : null}
        <div style={{ fontSize: 11, color: t.muted, marginTop: 4 }}>
          {p.orgPan ? `PAN: ${p.orgPan}` : ""}
          {p.orgPan && p.regNo80G ? "  |  " : ""}
          {p.regNo80G ? `80G: ${p.regNo80G}` : ""}
        </div>
      </div>

      {/* title */}
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 4,
          color: t.muted,
          textTransform: "uppercase",
          margin: "10px 0 18px",
        }}
      >
        Donation Receipt
      </div>

      {/* meta row */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 12 }}>
        <div>
          <span style={{ color: t.muted }}>No.: </span>
          <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
        </div>
        <div>
          <span style={{ color: t.muted }}>Date: </span>
          <strong style={{ color: t.ink }}>{p.date ? fmtDMonY(p.date) : "—"}</strong>
        </div>
      </div>

      <Divider color={t.muted} />

      {/* body */}
      <div style={{ fontSize: 13.5, lineHeight: 2.1, color: t.ink, marginBottom: 6 }}>
        Received with thanks from{" "}
        <strong style={{ borderBottom: `1px dotted ${t.muted}`, padding: "0 4px" }}>{p.donorName || "—"}</strong>
        {p.donorPan ? (
          <>
            {" "}(PAN <strong>{p.donorPan}</strong>)
          </>
        ) : null}
        {p.donorAddress ? (
          <>
            , residing at{" "}
            <span style={{ color: t.muted }}>{p.donorAddress}</span>
          </>
        ) : null}
        , the sum of{" "}
        <strong style={{ color: t.accent }}>{amountWords(p.amount, p.currency)}</strong> via{" "}
        <strong>{p.paymentMode}</strong>
        {p.purpose ? (
          <>
            {" "}towards <strong>{p.purpose}</strong>
          </>
        ) : null}
        .
      </div>

      {/* amount line */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: `1px solid ${t.ink}`,
          borderRadius: 6,
          padding: "12px 18px",
          marginTop: 16,
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: 1, color: t.muted, textTransform: "uppercase" }}>
          Amount
        </span>
        <span style={{ fontSize: 24, fontWeight: 800, color: t.accent }}>{amountFmt}</span>
      </div>

      {/* 80G note */}
      <div style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.7, marginTop: 16 }}>
        This donation is eligible for deduction under Section 80G of the Income-Tax Act, 1961.
      </div>

      {/* signature */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
        <div style={{ textAlign: "center", minWidth: 200 }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>For {p.orgName || "Organisation"}</div>
            <div style={{ fontSize: 11, color: t.muted }}>Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
