import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  money,
  plain,
  fmtDMonY,
  paperStyle,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared bits                                                        */
/* ------------------------------------------------------------------ */

type V = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  employerName: string;
  driverName: string;
  month: string;
  designation: string;
  paymentMode: string;
  receiptNo: string;
  date: string;
  salaryAmount: string;
  advanceDeducted: string;
  netPaid: number;
};

/**
 * Revenue-stamp box (driver cash salary receipts carry a revenue stamp, same as
 * rent receipts). The PNG is portrait; render it at a fixed small width inside a
 * dashed box with the affix caption.
 */
const STAMP_W = 74;
function RevenueStamp({ ink, muted }: { ink: string; muted: string }) {
  return (
    <div
      style={{
        border: `1px dashed ${muted}`,
        borderRadius: 6,
        padding: "10px 12px",
        textAlign: "center",
        width: 132,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/revenue-stamp.png"
        alt="Revenue Stamp"
        width={STAMP_W}
        style={{ width: STAMP_W, height: "auto", display: "block", margin: "0 auto" }}
      />
      <div style={{ color: muted, fontSize: 9.5, marginTop: 5, lineHeight: 1.3 }}>
        Affix Revenue Stamp and sign across it
      </div>
    </div>
  );
}

function SignatureLine({ name, ink, muted, accent }: { name: string; ink: string; muted: string; accent: string }) {
  return (
    <div style={{ textAlign: "center", minWidth: 180 }}>
      <div style={{ borderTop: `1px solid ${ink}`, paddingTop: 5 }}>
        <div style={{ fontWeight: 700, color: accent }}>{name || "Driver"}</div>
        <div style={{ color: muted, fontSize: 11 }}>Signature of Driver</div>
      </div>
    </div>
  );
}

/** "Received with thanks …" sentence shared by both templates. */
function Sentence(p: V) {
  const { t } = p;
  const net = plain(p.netPaid, p.currency);
  return (
    <p style={{ margin: 0, lineHeight: 1.85, color: t.ink, fontSize: 14 }}>
      Received with thanks a net sum of <strong style={{ color: t.accent }}>{net}</strong> from{" "}
      <strong>{p.employerName || "the Employer"}</strong> towards salary as{" "}
      <strong>{p.designation || "Driver"}</strong> for the month of{" "}
      <strong>{p.month || "—"}</strong>
      {p.paymentMode ? (
        <>
          , paid via <strong>{p.paymentMode}</strong>
        </>
      ) : null}
      .
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */

export default function DriverSalaryPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const salaryAmount = str(data, "salaryAmount");
  const advanceDeducted = str(data, "advanceDeducted");
  const netPaid = num(salaryAmount) - num(advanceDeducted);

  const v: V = {
    t,
    crumpled,
    currency,
    employerName: str(data, "employerName"),
    driverName: str(data, "driverName"),
    month: str(data, "month"),
    designation: str(data, "designation"),
    paymentMode: str(data, "paymentMode"),
    receiptNo: str(data, "receiptNo"),
    date: str(data, "date"),
    salaryAmount,
    advanceDeducted,
    netPaid,
  };

  switch (template) {
    case "template-2":
      return <BorderedForm {...v} />;
    case "template-1":
    default:
      return <StandardReceipt {...v} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — Standard Receipt (~600px)                             */
/* ================================================================== */

function StandardReceipt(p: V) {
  const { t } = p;
  return (
    <div
      style={{
        ...paperStyle(t, p.crumpled),
        color: t.ink,
        width: 600,
        margin: "0 auto",
        padding: 0,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {/* accent header */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "16px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: 4 }}>DRIVER SALARY RECEIPT</div>
        <div style={{ fontSize: 12, opacity: 0.9, letterSpacing: 1 }}>Monthly Salary Acknowledgement</div>
      </div>

      <div style={{ padding: "22px 28px 28px" }}>
        {/* receipt no + date */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, fontSize: 13 }}>
          <div>
            <span style={{ color: t.muted }}>Receipt No: </span>
            <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
          </div>
          <div>
            <span style={{ color: t.muted }}>Date: </span>
            <strong style={{ color: t.ink }}>{p.date ? fmtDMonY(p.date) : "—"}</strong>
          </div>
        </div>

        {/* parties */}
        <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>Employer</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>{p.employerName || "—"}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>Driver</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>{p.driverName || "—"}</div>
            <div style={{ fontSize: 12, color: t.muted }}>{p.designation}</div>
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "4px 0 16px" }} />

        {/* amount breakdown */}
        <div style={{ background: "rgba(0,0,0,0.025)", borderRadius: 6, padding: "12px 16px", marginBottom: 18 }}>
          <AmountRow k="Salary Amount" v={money(p.salaryAmount, p.currency)} ink={t.ink} muted={t.muted} />
          <AmountRow k="Less: Advance Deducted" v={`- ${money(p.advanceDeducted, p.currency)}`} ink={t.ink} muted={t.muted} />
          <div style={{ borderTop: `1px solid ${t.muted}`, margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>Net Salary Paid</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: t.accent }}>{plain(p.netPaid, p.currency)}</span>
          </div>
        </div>

        {/* sentence */}
        <div style={{ border: `1px dashed ${t.muted}`, borderRadius: 6, padding: "14px 16px", marginBottom: 8 }}>
          <Sentence {...p} />
        </div>

        {/* stamp + signature */}
        <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
          <RevenueStamp ink={t.ink} muted={t.muted} />
          <SignatureLine name={p.driverName} ink={t.ink} muted={t.muted} accent={t.accent} />
        </div>

        <div
          style={{
            textAlign: "center",
            color: t.muted,
            fontSize: 11,
            marginTop: 22,
            borderTop: `1px solid ${t.muted}`,
            paddingTop: 10,
          }}
        >
          This receipt acknowledges receipt of monthly driver salary in full settlement.
        </div>
      </div>
    </div>
  );
}

function AmountRow({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", lineHeight: 1.9, fontSize: 13 }}>
      <span style={{ color: muted }}>{k}</span>
      <span style={{ color: ink, fontWeight: 600 }}>{v}</span>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Bordered Form                                         */
/* ================================================================== */

function FormRow({ label, value, ink, muted, last }: { label: string; value: string; ink: string; muted: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", borderBottom: last ? "none" : `1px solid ${muted}`, fontSize: 13 }}>
      <div
        style={{
          width: 180,
          padding: "9px 12px",
          color: muted,
          fontWeight: 700,
          borderRight: `1px solid ${muted}`,
          background: "rgba(0,0,0,0.02)",
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, padding: "9px 12px", color: ink }}>{value || "—"}</div>
    </div>
  );
}

function BorderedForm(p: V) {
  const { t } = p;
  return (
    <div
      style={{
        ...paperStyle(t, p.crumpled),
        color: t.ink,
        width: 640,
        margin: "0 auto",
        padding: 22,
        fontFamily: "Arial, Helvetica, sans-serif",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
      }}
    >
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3, color: t.accent }}>DRIVER SALARY RECEIPT</div>
        <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1 }}>Monthly Salary Acknowledgement</div>
      </div>

      {/* meta line */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 12 }}>
        <div>
          <span style={{ color: t.muted }}>Receipt No: </span>
          <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
        </div>
        <div>
          <span style={{ color: t.muted }}>Date: </span>
          <strong style={{ color: t.ink }}>{p.date ? fmtDMonY(p.date) : "—"}</strong>
        </div>
      </div>

      <div style={{ border: `1px solid ${t.muted}`, marginBottom: 16 }}>
        <FormRow label="Employer Name" value={p.employerName} ink={t.ink} muted={t.muted} />
        <FormRow label="Driver Name" value={p.driverName} ink={t.ink} muted={t.muted} />
        <FormRow label="Designation" value={p.designation} ink={t.ink} muted={t.muted} />
        <FormRow label="Salary Month" value={p.month} ink={t.ink} muted={t.muted} />
        <FormRow label="Salary Amount" value={money(p.salaryAmount, p.currency)} ink={t.ink} muted={t.muted} />
        <FormRow label="Advance Deducted" value={money(p.advanceDeducted, p.currency)} ink={t.ink} muted={t.muted} />
        <FormRow label="Net Salary Paid" value={plain(p.netPaid, p.currency)} ink={t.ink} muted={t.muted} />
        <FormRow label="Payment Mode" value={p.paymentMode} ink={t.ink} muted={t.muted} last />
      </div>

      <div style={{ border: `1px dashed ${t.muted}`, borderRadius: 4, padding: "12px 14px", marginBottom: 8 }}>
        <Sentence {...p} />
      </div>

      <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <RevenueStamp ink={t.ink} muted={t.muted} />
        <SignatureLine name={p.driverName} ink={t.ink} muted={t.muted} accent={t.accent} />
      </div>
    </div>
  );
}
