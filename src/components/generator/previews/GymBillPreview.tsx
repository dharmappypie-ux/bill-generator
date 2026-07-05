import { PreviewProps } from "@/types/generator";
import { str, num, plain, fmtDMonY, fmtDMY, paperStyle, KV, Divider } from "./shared";
import { themeById } from "@/lib/themes";

/* ================================================================== */
/* shared model                                                       */
/* ================================================================== */

type GV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  gymName: string;
  gymAddress: string;
  gymGstin: string;
  gymPhone: string;
  memberName: string;
  memberId: string;
  membershipType: string;
  validFrom: string;
  validTo: string;
  receiptNo: string;
  date: string;
  paymentMethod: string;
  note: string;
  amount: number;
  tax: number;
  total: number;
};

export default function GymBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const amount = num(str(data, "amount"));
  const tax = num(str(data, "tax"));
  const total = amount + tax;

  const v: GV = {
    t,
    crumpled,
    currency,
    gymName: str(data, "gymName"),
    gymAddress: str(data, "gymAddress"),
    gymGstin: str(data, "gymGstin"),
    gymPhone: str(data, "gymPhone"),
    memberName: str(data, "memberName"),
    memberId: str(data, "memberId"),
    membershipType: str(data, "membershipType"),
    validFrom: str(data, "validFrom"),
    validTo: str(data, "validTo"),
    receiptNo: str(data, "receiptNo"),
    date: str(data, "date"),
    paymentMethod: str(data, "paymentMethod"),
    note: str(data, "note"),
    amount,
    tax,
    total,
  };

  switch (template) {
    case "template-2":
      return <Invoice {...v} />;
    case "template-1":
    default:
      return <Receipt {...v} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — Receipt                                               */
/* Centered fee receipt: banner header, member block, payment block,  */
/* highlighted total, footer note.                                    */
/* ================================================================== */

function Receipt(p: GV) {
  const { t } = p;
  const validity = [p.validFrom && fmtDMonY(p.validFrom), p.validTo && fmtDMonY(p.validTo)]
    .filter(Boolean)
    .join("  →  ");

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 8,
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* banner header */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            <i className="fas fa-dumbbell" aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 0.5 }}>{p.gymName || "Gym Name"}</div>
            {p.gymAddress ? <div style={{ fontSize: 11.5, opacity: 0.9, lineHeight: 1.4, maxWidth: 320 }}>{p.gymAddress}</div> : null}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 11.5, opacity: 0.95, lineHeight: 1.6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, opacity: 1 }}>FEE RECEIPT</div>
          {p.gymGstin ? <div>GSTIN: {p.gymGstin}</div> : null}
          {p.gymPhone ? <div>{p.gymPhone}</div> : null}
        </div>
      </div>

      <div style={{ padding: "22px 28px 26px" }}>
        {/* receipt meta */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 14 }}>
          <div>
            <span style={{ color: t.muted }}>Receipt No: </span>
            <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
          </div>
          <div>
            <span style={{ color: t.muted }}>Date: </span>
            <strong style={{ color: t.ink }}>{p.date ? fmtDMonY(p.date) : "—"}</strong>
          </div>
        </div>

        <Divider color={t.muted} />

        {/* member details */}
        <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Member Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28 }}>
          <KV k="Member Name" v={p.memberName} ink={t.ink} muted={t.muted} bold />
          <KV k="Member ID" v={p.memberId} ink={t.ink} muted={t.muted} />
          <KV k="Membership" v={p.membershipType} ink={t.ink} muted={t.muted} />
          <KV k="Payment Method" v={p.paymentMethod} ink={t.ink} muted={t.muted} />
        </div>
        {validity ? (
          <div style={{ marginTop: 6 }}>
            <KV k="Valid Period" v={validity} ink={t.ink} muted={t.muted} />
          </div>
        ) : null}

        <Divider color={t.muted} />

        {/* charge line */}
        <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
          Payment Summary
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, lineHeight: 1.9 }}>
          <span style={{ color: t.ink }}>
            {p.membershipType ? `${p.membershipType} Membership Fee` : "Membership Fee"}
          </span>
          <span style={{ color: t.ink }}>{plain(p.amount, p.currency)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, lineHeight: 1.9, color: t.muted }}>
          <span>GST (18%)</span>
          <span>{plain(p.tax, p.currency)}</span>
        </div>

        {/* total band */}
        <div
          style={{
            marginTop: 12,
            background: t.accent,
            color: "#ffffff",
            borderRadius: 8,
            padding: "12px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, letterSpacing: 1, fontWeight: 600 }}>TOTAL PAID</span>
          <span style={{ fontSize: 21, fontWeight: 800 }}>{plain(p.total, p.currency)}</span>
        </div>

        {/* footer note */}
        <div style={{ borderTop: `1px solid ${t.muted}`, marginTop: 20, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
          <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.5, maxWidth: 360 }}>
            {p.note || "Thank you for your membership."}
          </div>
          <div style={{ textAlign: "center", minWidth: 150 }}>
            <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5, fontSize: 11.5, color: t.muted }}>
              Authorised Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Invoice                                               */
/* Tax-invoice layout: bill-to / membership panels, a real items      */
/* table, right-aligned totals block.                                 */
/* ================================================================== */

function Invoice(p: GV) {
  const { t } = p;
  const cell: React.CSSProperties = { padding: "10px 12px", fontSize: 12.5, borderBottom: `1px solid ${t.muted}` };
  const validity = [p.validFrom && fmtDMY(p.validFrom), p.validTo && fmtDMY(p.validTo)].filter(Boolean).join("  to  ");

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, sans-serif",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
        padding: 26,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: t.accent,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            <i className="fas fa-dumbbell" aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: t.accent }}>{p.gymName || "Gym Name"}</div>
            {p.gymAddress ? <div style={{ fontSize: 11.5, color: t.muted, lineHeight: 1.45, maxWidth: 300 }}>{p.gymAddress}</div> : null}
            <div style={{ fontSize: 11.5, color: t.muted }}>
              {p.gymGstin ? <span>GSTIN: {p.gymGstin}</span> : null}
              {p.gymGstin && p.gymPhone ? <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span> : null}
              {p.gymPhone ? <span>{p.gymPhone}</span> : null}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: t.accent }}>INVOICE</div>
          <div style={{ fontSize: 12, color: t.muted, lineHeight: 1.7, marginTop: 2 }}>
            <div>
              <span style={{ color: t.muted }}>No: </span>
              <strong style={{ color: t.ink }}>{p.receiptNo || "—"}</strong>
            </div>
            <div>
              <span style={{ color: t.muted }}>Date: </span>
              <strong style={{ color: t.ink }}>{p.date ? fmtDMY(p.date) : "—"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* bill-to / membership panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div style={{ border: `1px solid ${t.muted}`, borderRadius: 6, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Billed To
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: t.ink }}>{p.memberName || "—"}</div>
          {p.memberId ? <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>Member ID: {p.memberId}</div> : null}
        </div>
        <div style={{ border: `1px solid ${t.muted}`, borderRadius: 6, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Membership
          </div>
          <KV k="Plan" v={p.membershipType} ink={t.ink} muted={t.muted} bold size={12.5} />
          {validity ? <KV k="Valid" v={validity} ink={t.ink} muted={t.muted} size={12.5} /> : null}
          <KV k="Method" v={p.paymentMethod} ink={t.ink} muted={t.muted} size={12.5} />
        </div>
      </div>

      {/* items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ ...cell, textAlign: "left", borderBottom: "none", fontWeight: 700 }}>Description</th>
            <th style={{ ...cell, textAlign: "center", borderBottom: "none", fontWeight: 700, width: 60 }}>Qty</th>
            <th style={{ ...cell, textAlign: "right", borderBottom: "none", fontWeight: 700, width: 130 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...cell, color: t.ink }}>
              <div style={{ fontWeight: 600 }}>
                {p.membershipType ? `${p.membershipType} Gym Membership` : "Gym Membership"}
              </div>
              {validity ? <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>Period: {validity}</div> : null}
            </td>
            <td style={{ ...cell, textAlign: "center", color: t.ink }}>1</td>
            <td style={{ ...cell, textAlign: "right", color: t.ink }}>{plain(p.amount, p.currency)}</td>
          </tr>
        </tbody>
      </table>

      {/* totals block (right-aligned) */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: t.ink }}>
            <span style={{ color: t.muted }}>Subtotal</span>
            <span>{plain(p.amount, p.currency)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: t.ink }}>
            <span style={{ color: t.muted }}>GST (18%)</span>
            <span>{plain(p.tax, p.currency)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              borderTop: `2px solid ${t.accent}`,
              paddingTop: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: t.accent, letterSpacing: 1 }}>TOTAL</span>
            <span style={{ fontSize: 19, fontWeight: 800, color: t.accent }}>{plain(p.total, p.currency)}</span>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 18, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.5, maxWidth: 360 }}>
          {p.note || "Thank you for your membership."}
          <div style={{ marginTop: 4 }}>This is a computer-generated invoice.</div>
        </div>
        <div style={{ textAlign: "center", minWidth: 150 }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 5, fontSize: 11.5, color: t.muted }}>
            For {p.gymName || "the Gym"}
          </div>
        </div>
      </div>
    </div>
  );
}
