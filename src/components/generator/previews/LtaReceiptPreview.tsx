import { PreviewProps } from "@/types/generator";
import {
  str,
  money,
  fmtDMonY,
  paperStyle,
  KV,
  Divider,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared values                                                      */
/* ------------------------------------------------------------------ */

type RV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  employeeName: string;
  employeeId: string;
  fromPlace: string;
  toPlace: string;
  mode: string;
  travelDate: string;
  ticketNo: string;
  amount: string;
  currency: string;
  receiptNo: string;
  date: string;
  purpose: string;
};

const ROUTE = "Delhi → Mumbai";

export default function LtaReceiptPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const v: RV = {
    t,
    crumpled,
    currency,
    employeeName: str(data, "employeeName"),
    employeeId: str(data, "employeeId"),
    fromPlace: str(data, "fromPlace"),
    toPlace: str(data, "toPlace"),
    mode: str(data, "mode") || "Train",
    travelDate: str(data, "travelDate"),
    ticketNo: str(data, "ticketNo"),
    amount: str(data, "amount"),
    receiptNo: str(data, "receiptNo"),
    date: str(data, "date"),
    purpose: str(data, "purpose"),
  };

  switch (template) {
    case "template-2":
      return <Minimal {...v} />;
    case "template-1":
    default:
      return <Standard {...v} />;
  }
}

/* mode → small descriptor used in copy */
function modeLine(mode: string): string {
  switch (mode) {
    case "Flight":
      return "Air travel (economy class)";
    case "Bus":
      return "Road travel (state transport / bus)";
    case "Train":
    default:
      return "Rail travel (eligible class)";
  }
}

function route(from: string, to: string): string {
  if (!from && !to) return ROUTE;
  return `${from || "—"}  →  ${to || "—"}`;
}

/* ================================================================== */
/* TEMPLATE 1 — Standard Receipt (~600px)                             */
/* ================================================================== */

function Standard(p: RV) {
  const { t } = p;
  const amountFmt = money(p.amount, p.currency);

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
      {/* accent banner */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>LTA CLAIM RECEIPT</div>
          <div style={{ fontSize: 11.5, opacity: 0.9, letterSpacing: 1 }}>Leave Travel Allowance — Tax Exemption</div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11.5, opacity: 0.95, lineHeight: 1.6 }}>
          <div>Receipt No.</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{p.receiptNo || "—"}</div>
        </div>
      </div>

      <div style={{ padding: "22px 28px 26px" }}>
        {/* employee + date row */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Employee</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>{p.employeeName || "—"}</div>
            <div style={{ fontSize: 12, color: t.muted }}>ID: {p.employeeId || "—"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10.5, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Issued On</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{p.date ? fmtDMonY(p.date) : "—"}</div>
          </div>
        </div>

        <Divider color={t.muted} />

        {/* journey card */}
        <div
          style={{
            border: `1px solid ${t.muted}`,
            borderRadius: 8,
            padding: "16px 18px",
            marginBottom: 16,
            background: "rgba(0,0,0,0.015)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10.5, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>Journey</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: t.accent }}>{route(p.fromPlace, p.toPlace)}</div>
            </div>
            <div
              style={{
                background: t.accent,
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                padding: "5px 12px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {p.mode}
            </div>
          </div>

          <KV k="Mode of Travel" v={modeLine(p.mode)} ink={t.ink} muted={t.muted} />
          <KV k="Date of Travel" v={p.travelDate ? fmtDMonY(p.travelDate) : "—"} ink={t.ink} muted={t.muted} />
          <KV k="Ticket / PNR No." v={p.ticketNo} ink={t.ink} muted={t.muted} />
        </div>

        {/* purpose */}
        {p.purpose ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Purpose of Travel</div>
            <div style={{ fontSize: 13, color: t.ink, lineHeight: 1.6 }}>{p.purpose}</div>
          </div>
        ) : null}

        {/* amount block */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: t.accent,
            color: "#ffffff",
            borderRadius: 8,
            padding: "14px 18px",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>Total Claim Amount</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{amountFmt}</div>
        </div>

        {/* signatures */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 34, gap: 24 }}>
          <SignLine label="Claimant Signature" name={p.employeeName} ink={t.ink} muted={t.muted} />
          <SignLine label="Authorised Signatory" name="" ink={t.ink} muted={t.muted} />
        </div>

        <div style={{ textAlign: "center", color: t.muted, fontSize: 10.5, marginTop: 22, borderTop: `1px solid ${t.muted}`, paddingTop: 10, lineHeight: 1.5 }}>
          This receipt is issued towards Leave Travel Allowance reimbursement and may be used for income-tax exemption under the applicable LTA block.
        </div>
      </div>
    </div>
  );
}

function SignLine({ label, name, ink, muted }: { label: string; name: string; ink: string; muted: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ height: 28 }} />
      <div style={{ borderTop: `1px solid ${ink}`, paddingTop: 5 }}>
        {name ? <div style={{ fontSize: 13, fontWeight: 700, color: ink }}>{name}</div> : <div style={{ height: 17 }} />}
        <div style={{ fontSize: 11, color: muted }}>{label}</div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Minimal                                               */
/* ================================================================== */

function Minimal(p: RV) {
  const { t } = p;
  const amountFmt = money(p.amount, p.currency);

  return (
    <div
      style={{
        width: 560,
        margin: "0 auto",
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        padding: "44px 48px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.06)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: 3, color: t.ink }}>LTA RECEIPT</div>
        <div style={{ fontSize: 11, color: t.muted, textAlign: "right", lineHeight: 1.6 }}>
          {p.receiptNo ? <div>No. {p.receiptNo}</div> : null}
          {p.date ? <div>{fmtDMonY(p.date)}</div> : null}
        </div>
      </div>

      {/* amount headline */}
      <div style={{ fontSize: 11.5, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
        Leave Travel Allowance Claim
      </div>
      <div style={{ fontSize: 36, fontWeight: 300, color: t.accent, marginBottom: 4 }}>{amountFmt}</div>
      <div style={{ fontSize: 12.5, color: t.muted, marginBottom: 30 }}>
        {p.employeeName || "—"}
        {p.employeeId ? ` · ${p.employeeId}` : ""}
      </div>

      {/* journey strip */}
      <div style={{ borderTop: `1px solid ${t.muted}`, paddingTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 19, fontWeight: 600, color: t.ink }}>{route(p.fromPlace, p.toPlace)}</div>
          <div style={{ fontSize: 12, color: t.muted, border: `1px solid ${t.muted}`, borderRadius: 999, padding: "3px 12px" }}>{p.mode}</div>
        </div>

        <KV k="Date of Travel" v={p.travelDate ? fmtDMonY(p.travelDate) : "—"} ink={t.ink} muted={t.muted} />
        <KV k="Ticket / PNR No." v={p.ticketNo} ink={t.ink} muted={t.muted} />
        {p.purpose ? <KV k="Purpose" v={p.purpose} ink={t.ink} muted={t.muted} /> : null}
      </div>

      {/* signature */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
        <div style={{ textAlign: "center", minWidth: 190 }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>{p.employeeName || "Employee"}</span>
            <div style={{ fontSize: 11, color: t.muted }}>Claimant Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}
