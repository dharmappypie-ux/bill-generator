import { PreviewProps } from "@/types/generator";
import { themeById } from "@/lib/themes";
import {
  str,
  num,
  plain,
  fmtDMonY,
  fmtDMY,
  paperStyle,
} from "./shared";

/* ================================================================== */
/* shared model                                                       */
/* ================================================================== */

type IV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  ispName: string;
  accountNo: string;
  customerName: string;
  address: string;
  planName: string;
  billingFrom: string;
  billingTo: string;
  invoiceNo: string;
  dueDate: string;
  paymentStatus: string;
  monthly: number;
  install: number;
  tax: number;
  subtotal: number;
  total: number;
};

function StatusPill({ status, accent }: { status: string; accent: string }) {
  const paid = status === "Paid";
  const bg = paid ? "#1f7a4d" : "#b23b2e";
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color: "#ffffff",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1,
        padding: "4px 12px",
        borderRadius: 999,
        textTransform: "uppercase",
      }}
    >
      {paid ? "Paid" : "Amount Due"}
    </span>
  );
}

export default function InternetBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const monthly = num(str(data, "monthlyCharge"));
  const install = num(str(data, "installation"));
  const tax = num(str(data, "tax"));
  const subtotal = monthly + install;
  const total = subtotal + tax;

  const v: IV = {
    t,
    crumpled,
    currency,
    ispName: str(data, "ispName"),
    accountNo: str(data, "accountNo"),
    customerName: str(data, "customerName"),
    address: str(data, "address"),
    planName: str(data, "planName"),
    billingFrom: str(data, "billingFrom"),
    billingTo: str(data, "billingTo"),
    invoiceNo: str(data, "invoiceNo"),
    dueDate: str(data, "dueDate"),
    paymentStatus: str(data, "paymentStatus") || "Due",
    monthly,
    install,
    tax,
    subtotal,
    total,
  };

  switch (template) {
    case "template-2":
      return <Statement {...v} />;
    case "template-1":
    default:
      return <Invoice {...v} />;
  }
}

const FONT = "'Product Sans', 'Montserrat', Arial, sans-serif";

function period(from: string, to: string): string {
  const a = from ? fmtDMonY(from) : "";
  const b = to ? fmtDMonY(to) : "";
  if (a && b) return `${a} — ${b}`;
  return a || b || "—";
}

/* ================================================================== */
/* TEMPLATE 1 — Invoice (~640px)                                      */
/* ================================================================== */

function Invoice(p: IV) {
  const { t } = p;
  const charges: { label: string; sub?: string; amt: number }[] = [
    { label: p.planName || "Broadband Plan", sub: `Billing period: ${period(p.billingFrom, p.billingTo)}`, amt: p.monthly },
  ];
  if (p.install > 0) charges.push({ label: "Installation / One-time", amt: p.install });

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: FONT,
        padding: 0,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.08)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header banner */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            <i className="fa-solid fa-wifi" aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 0.5 }}>{p.ispName || "Internet Provider"}</div>
            <div style={{ fontSize: 11.5, opacity: 0.85 }}>Broadband &amp; Internet Services</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>INVOICE</div>
          <div style={{ fontSize: 11.5, opacity: 0.9 }}>#{p.invoiceNo || "—"}</div>
        </div>
      </div>

      <div style={{ padding: "24px 30px 30px" }}>
        {/* bill-to + meta */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 22 }}>
          <div style={{ maxWidth: 320 }}>
            <div style={{ fontSize: 10.5, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Billed To</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>{p.customerName || "Customer Name"}</div>
            <div style={{ fontSize: 12.5, color: t.muted, lineHeight: 1.5, marginTop: 2, whiteSpace: "pre-line" }}>{p.address || "—"}</div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>
              Account No: <span style={{ color: t.ink, fontWeight: 600 }}>{p.accountNo || "—"}</span>
            </div>
          </div>
          <div style={{ minWidth: 200, fontSize: 12.5 }}>
            <MetaRow k="Invoice Date" v={fmtDMonY(new Date().toISOString().slice(0, 10))} ink={t.ink} muted={t.muted} />
            <MetaRow k="Due Date" v={p.dueDate ? fmtDMonY(p.dueDate) : "—"} ink={t.ink} muted={t.muted} />
            <MetaRow k="Billing Period" v={period(p.billingFrom, p.billingTo)} ink={t.ink} muted={t.muted} />
            <div style={{ marginTop: 10, textAlign: "right" }}>
              <StatusPill status={p.paymentStatus} accent={t.accent} />
            </div>
          </div>
        </div>

        {/* charges table */}
        <div style={{ border: `1px solid ${t.muted}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ display: "flex", background: t.accent, color: "#ffffff", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5 }}>
            <div style={{ flex: 1, padding: "10px 14px" }}>Description</div>
            <div style={{ width: 140, padding: "10px 14px", textAlign: "right" }}>Amount</div>
          </div>
          {charges.map((c, i) => (
            <div key={i} style={{ display: "flex", borderTop: i === 0 ? "none" : `1px solid ${t.muted}`, fontSize: 13 }}>
              <div style={{ flex: 1, padding: "11px 14px" }}>
                <div style={{ color: t.ink, fontWeight: 600 }}>{c.label}</div>
                {c.sub ? <div style={{ color: t.muted, fontSize: 11.5, marginTop: 2 }}>{c.sub}</div> : null}
              </div>
              <div style={{ width: 140, padding: "11px 14px", textAlign: "right", color: t.ink }}>{plain(c.amt, p.currency)}</div>
            </div>
          ))}
        </div>

        {/* totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 280, fontSize: 13 }}>
            <TotalRow k="Subtotal" v={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
            <TotalRow k="GST (18%)" v={plain(p.tax, p.currency)} ink={t.ink} muted={t.muted} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                padding: "11px 14px",
                background: t.accent,
                color: "#ffffff",
                borderRadius: 6,
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              <span>Total {p.paymentStatus === "Paid" ? "Paid" : "Due"}</span>
              <span>{plain(p.total, p.currency)}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 24, paddingTop: 12, fontSize: 11, color: t.muted, lineHeight: 1.6 }}>
          <div>Please pay on or before the due date to avoid service interruption. Late payment may attract a reconnection fee.</div>
          <div style={{ marginTop: 4 }}>This is a computer-generated invoice and does not require a signature.</div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, lineHeight: 1.9 }}>
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: ink, fontWeight: 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}

function TotalRow({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 14px", color: muted }}>
      <span>{k}</span>
      <span style={{ color: ink }}>{v}</span>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Statement                                             */
/* ================================================================== */

function Statement(p: IV) {
  const { t } = p;
  const lines: { k: string; v: string }[] = [
    { k: "Monthly Subscription", v: plain(p.monthly, p.currency) },
  ];
  if (p.install > 0) lines.push({ k: "Installation / One-time", v: plain(p.install, p.currency) });
  lines.push({ k: "GST (18%)", v: plain(p.tax, p.currency) });

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: FONT,
        padding: "34px 38px 32px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 6,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* heading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `2px solid ${t.accent}`, paddingBottom: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: t.accent, letterSpacing: 0.5 }}>{p.ispName || "Internet Provider"}</div>
          <div style={{ fontSize: 11.5, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Account Statement</div>
        </div>
        <StatusPill status={p.paymentStatus} accent={t.accent} />
      </div>

      {/* account summary grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 28px", fontSize: 12.5, marginBottom: 22 }}>
        <SItem k="Customer" v={p.customerName || "—"} ink={t.ink} muted={t.muted} />
        <SItem k="Account No." v={p.accountNo || "—"} ink={t.ink} muted={t.muted} />
        <SItem k="Statement No." v={p.invoiceNo || "—"} ink={t.ink} muted={t.muted} />
        <SItem k="Plan" v={p.planName || "—"} ink={t.ink} muted={t.muted} />
        <SItem k="Billing Period" v={period(p.billingFrom, p.billingTo)} ink={t.ink} muted={t.muted} />
        <SItem k="Due Date" v={p.dueDate ? fmtDMY(p.dueDate) : "—"} ink={t.ink} muted={t.muted} />
        <div style={{ gridColumn: "1 / span 2" }}>
          <SItem k="Service Address" v={p.address || "—"} ink={t.ink} muted={t.muted} />
        </div>
      </div>

      {/* charge breakdown */}
      <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Charge Breakdown</div>
      <div style={{ borderTop: `1px dashed ${t.muted}`, borderBottom: `1px dashed ${t.muted}`, padding: "6px 0" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 2px", fontSize: 13 }}>
            <span style={{ color: t.ink }}>{l.k}</span>
            <span style={{ color: t.ink }}>{l.v}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 2px 4px", fontSize: 13, borderTop: `1px solid ${t.muted}`, marginTop: 4, color: t.muted }}>
          <span>Subtotal</span>
          <span style={{ color: t.ink }}>{plain(p.subtotal, p.currency)}</span>
        </div>
      </div>

      {/* amount due block */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 18px",
          border: `2px solid ${t.accent}`,
          borderRadius: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase" }}>
            {p.paymentStatus === "Paid" ? "Total Paid" : "Total Amount Due"}
          </div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
            {p.paymentStatus === "Paid" ? "Payment received — thank you" : p.dueDate ? `Payable by ${fmtDMonY(p.dueDate)}` : "Payable on receipt"}
          </div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: t.accent }}>{plain(p.total, p.currency)}</div>
      </div>

      <div style={{ textAlign: "center", color: t.muted, fontSize: 10.5, marginTop: 22, borderTop: `1px solid ${t.muted}`, paddingTop: 10, lineHeight: 1.6 }}>
        For billing queries contact your service provider quoting your account number. This is a computer-generated statement.
      </div>
    </div>
  );
}

function SItem({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div>
      <div style={{ color: muted, fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase" }}>{k}</div>
      <div style={{ color: ink, fontWeight: 600, fontSize: 13, marginTop: 1, whiteSpace: "pre-line" }}>{v}</div>
    </div>
  );
}
