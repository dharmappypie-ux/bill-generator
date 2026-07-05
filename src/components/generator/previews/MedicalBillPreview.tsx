import { PreviewProps } from "@/types/generator";
import { str, num, plain, fmtDMonY, fmtDMY, parseItems, paperStyle } from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* fonts                                                              */
/* ------------------------------------------------------------------ */
const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";
const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

/** Selectable pharmacy logo icon (falls back to a caduceus glyph). */
function PharmaLogo({ logo, size = 34, accent }: { logo: string; size?: number; accent: string }) {
  if (!logo) {
    return (
      <span aria-hidden style={{ fontSize: size * 0.62, color: accent }}>
        {"⚕️"}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/pharma/${logo}.svg`} alt="pharmacy logo" style={{ width: size, height: size, display: "block" }} />
  );
}

/* ------------------------------------------------------------------ */
/* shared bill math                                                   */
/* ------------------------------------------------------------------ */
type Line = { name: string; batch: string; qty: number; rate: number; amount: number };
type Bill = {
  lines: Line[];
  totalQty: number;
  subtotal: number;
  discountPct: number;
  discount: number;
  taxable: number;
  gstPct: number;
  gst: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
  rounded: number;
  roundOff: number;
};

function computeBill(data: PreviewProps["data"]): Bill {
  const rows = parseItems(data.items);
  const lines: Line[] = rows.map((r) => {
    const qty = num(r.qty);
    const rate = num(r.rate);
    return { name: r.name ?? "", batch: r.batch ?? "", qty, rate, amount: qty * rate };
  });

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);

  const discountPct = num(str(data, "discount"));
  const gstPct = num(str(data, "gstPct"));

  const discount = (subtotal * discountPct) / 100;
  const taxable = subtotal - discount;
  const gst = (taxable * gstPct) / 100;
  // pharmacy GST is shown split as CGST + SGST
  const cgst = gst / 2;
  const sgst = gst / 2;

  const grandTotal = taxable + gst;
  const rounded = Math.round(grandTotal);
  const roundOff = rounded - grandTotal;

  return {
    lines,
    totalQty,
    subtotal,
    discountPct,
    discount,
    taxable,
    gstPct,
    gst,
    cgst,
    sgst,
    grandTotal,
    rounded,
    roundOff,
  };
}

/* ================================================================== */
/* component                                                          */
/* ================================================================== */
export default function MedicalBillPreview(props: PreviewProps) {
  switch (props.template) {
    case "template-2":
      return <Receipt {...props} />;
    case "template-1":
    default:
      return <PharmacyBill {...props} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — Pharmacy Bill (table ~640px)                          */
/* ================================================================== */
function PharmacyBill(props: PreviewProps) {
  const { data, theme, crumpled, currency } = props;
  const t = themeById(theme);

  const logo = str(data, "logo");
  const pharmacyName = str(data, "pharmacyName");
  const address = str(data, "address");
  const gstin = str(data, "gstin");
  const dlNo = str(data, "dlNo");
  const billNo = str(data, "billNo");
  const date = str(data, "date");
  const patientName = str(data, "patientName");
  const doctorName = str(data, "doctorName");
  const paymentMethod = str(data, "paymentMethod");
  const b = computeBill(data);

  const th: React.CSSProperties = {
    padding: "7px 9px",
    border: "1px solid rgba(0,0,0,0.15)",
    fontWeight: 700,
  };
  const td: React.CSSProperties = {
    padding: "8px 9px",
    border: `1px solid ${t.muted}`,
    color: t.ink,
    verticalAlign: "top",
  };

  const META = ({ k, v }: { k: string; v: string }) =>
    v ? (
      <div>
        <span style={{ color: t.muted }}>{k} </span>
        {v}
      </div>
    ) : null;

  const TotRow = ({ k, v, strong }: { k: string; v: string; strong?: boolean }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 12px",
        color: strong ? t.ink : t.muted,
        fontWeight: strong ? 700 : 400,
      }}
    >
      <span>{k}</span>
      <span style={{ color: t.ink }}>{v}</span>
    </div>
  );

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12,
        padding: 26,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
        ...paperStyle(t, crumpled),
      }}
    >
      {/* header — pharmacy name / address / licences */}
      <div style={{ borderBottom: `2px solid ${t.accent}`, paddingBottom: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
          <div style={{ maxWidth: 380 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <PharmaLogo logo={logo} size={38} accent={t.accent} />
              <span style={{ fontWeight: 800, fontSize: 20, color: t.accent, lineHeight: 1.15 }}>
                {pharmacyName || "Apollo Medical & General Store"}
              </span>
            </div>
            {address ? (
              <div style={{ color: t.muted, marginTop: 4, lineHeight: 1.5, whiteSpace: "pre-line" }}>{address}</div>
            ) : null}
          </div>
          <div style={{ textAlign: "right", color: t.ink, lineHeight: 1.6 }}>
            <META k="GSTIN:" v={gstin} />
            <META k="D.L. No:" v={dlNo} />
          </div>
        </div>
      </div>

      {/* invoice title */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <span
          style={{
            display: "inline-block",
            border: `1px solid ${t.accent}`,
            color: t.accent,
            fontWeight: 800,
            letterSpacing: 3,
            padding: "4px 18px",
            fontSize: 13,
          }}
        >
          MEDICAL BILL
        </span>
      </div>

      {/* patient + bill meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          marginBottom: 14,
          lineHeight: 1.7,
        }}
      >
        <div style={{ maxWidth: 330 }}>
          <META k="Patient:" v={patientName} />
          <META k="Doctor:" v={doctorName} />
        </div>
        <div style={{ textAlign: "right" }}>
          <META k="Bill No:" v={billNo} />
          <META k="Date:" v={fmtDMonY(date)} />
          <META k="Payment:" v={paymentMethod} />
        </div>
      </div>

      {/* medicine line-item table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ ...th, textAlign: "left", width: 32 }}>#</th>
            <th style={{ ...th, textAlign: "left" }}>Medicine / Particulars</th>
            <th style={{ ...th, textAlign: "left", width: 86 }}>Batch</th>
            <th style={{ ...th, textAlign: "center", width: 50 }}>Qty</th>
            <th style={{ ...th, textAlign: "right", width: 96 }}>Rate</th>
            <th style={{ ...th, textAlign: "right", width: 108 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {b.lines.length === 0 ? (
            <tr>
              <td style={{ ...td, textAlign: "center", color: t.muted }} colSpan={6}>
                No medicines added
              </td>
            </tr>
          ) : (
            b.lines.map((l, i) => (
              <tr key={i}>
                <td style={{ ...td, textAlign: "center" }}>{i + 1}</td>
                <td style={td}>{l.name || `Item ${i + 1}`}</td>
                <td style={{ ...td, color: t.muted }}>{l.batch || "—"}</td>
                <td style={{ ...td, textAlign: "center" }}>{l.qty}</td>
                <td style={{ ...td, textAlign: "right" }}>{plain(l.rate, currency)}</td>
                <td style={{ ...td, textAlign: "right" }}>{plain(l.amount, currency)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div style={{ width: 330 }}>
          <TotRow k={`Subtotal (${b.totalQty} item${b.totalQty === 1 ? "" : "s"})`} v={plain(b.subtotal, currency)} />
          {b.discountPct ? (
            <TotRow k={`Discount @ ${b.discountPct}%`} v={`- ${plain(b.discount, currency)}`} />
          ) : null}
          {b.gstPct ? <TotRow k="Taxable Value" v={plain(b.taxable, currency)} /> : null}
          {b.gstPct ? <TotRow k={`CGST @ ${b.gstPct / 2}%`} v={plain(b.cgst, currency)} /> : null}
          {b.gstPct ? <TotRow k={`SGST @ ${b.gstPct / 2}%`} v={plain(b.sgst, currency)} /> : null}
          {b.roundOff ? (
            <TotRow k="Round Off" v={`${b.roundOff > 0 ? "+ " : "- "}${plain(Math.abs(b.roundOff), currency)}`} />
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: t.accent,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 15,
              borderRadius: 4,
              marginTop: 6,
            }}
          >
            <span>GRAND TOTAL</span>
            <span>{plain(b.rounded, currency)}</span>
          </div>
          <div style={{ textAlign: "right", color: t.muted, fontSize: 10, marginTop: 4 }}>(incl. GST)</div>
        </div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26 }}>
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 360, lineHeight: 1.5 }}>
          Drugs sold are as per the prescription. Medicines once sold will not be taken back or exchanged. Please keep
          medicines out of reach of children. E. &amp; O.E. This is a system generated bill.
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: `1px solid ${t.ink}`,
              width: 170,
              paddingTop: 4,
              color: t.muted,
              fontSize: 11,
            }}
          >
            For {pharmacyName || "Apollo Medical"} (Pharmacist)
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Receipt (monospace ~380px)                            */
/* ================================================================== */
function Receipt(props: PreviewProps) {
  const { data, theme, crumpled, currency } = props;
  const t = themeById(theme);

  const logo = str(data, "logo");
  const pharmacyName = str(data, "pharmacyName");
  const address = str(data, "address");
  const gstin = str(data, "gstin");
  const dlNo = str(data, "dlNo");
  const billNo = str(data, "billNo");
  const date = str(data, "date");
  const patientName = str(data, "patientName");
  const doctorName = str(data, "doctorName");
  const paymentMethod = str(data, "paymentMethod");
  const b = computeBill(data);

  const rule = (ch: string) => (
    <div
      style={{
        color: t.muted,
        overflow: "hidden",
        whiteSpace: "nowrap",
        margin: "8px 0",
        letterSpacing: 1,
      }}
    >
      {ch.repeat(42)}
    </div>
  );

  const L = (k: string, v: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, lineHeight: 1.8 }}>
      <span style={{ color: t.muted, whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: t.ink, textAlign: "right", maxWidth: "62%", wordBreak: "break-word" }}>{v || "-"}</span>
    </div>
  );

  return (
    <div
      style={{
        width: 380,
        margin: "0 auto",
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 12.5,
        padding: "24px 26px 22px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
        ...paperStyle(t, crumpled),
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <PharmaLogo logo={logo} size={34} accent={t.accent} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>
          {(pharmacyName || "APOLLO MEDICAL").toUpperCase()}
        </div>
        {address ? (
          <div style={{ color: t.muted, fontSize: 11, marginTop: 3, lineHeight: 1.4, whiteSpace: "pre-line" }}>
            {address}
          </div>
        ) : null}
        {gstin ? <div style={{ color: t.muted, fontSize: 11, marginTop: 2 }}>GSTIN: {gstin}</div> : null}
        {dlNo ? <div style={{ color: t.muted, fontSize: 11 }}>D.L. No: {dlNo}</div> : null}
      </div>

      {rule("=")}
      <div style={{ textAlign: "center", fontWeight: 800, letterSpacing: 3 }}>CASH / CREDIT MEMO</div>
      {rule("=")}

      {/* bill meta */}
      {L("Bill No:", billNo)}
      {L("Date:", fmtDMY(date))}
      {L("Patient:", patientName)}
      {L("Doctor:", doctorName)}

      {rule("-")}

      {/* items header */}
      <div style={{ display: "flex", fontWeight: 800, color: t.ink }}>
        <span style={{ flex: 3 }}>MEDICINE</span>
        <span style={{ flex: 1, textAlign: "center" }}>QTY</span>
        <span style={{ flex: 1.5, textAlign: "right" }}>RATE</span>
        <span style={{ flex: 1.6, textAlign: "right" }}>AMT</span>
      </div>
      {rule("-")}

      {/* items */}
      {b.lines.length === 0 ? (
        <div style={{ color: t.muted, textAlign: "center", padding: "6px 0" }}>No medicines added</div>
      ) : (
        b.lines.map((l, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <div style={{ color: t.ink, wordBreak: "break-word" }}>{l.name || `Item ${i + 1}`}</div>
            {l.batch ? <div style={{ color: t.muted, fontSize: 11 }}>B.No: {l.batch}</div> : null}
            <div style={{ display: "flex", color: t.ink }}>
              <span style={{ flex: 3 }} />
              <span style={{ flex: 1, textAlign: "center" }}>{l.qty}</span>
              <span style={{ flex: 1.5, textAlign: "right" }}>{plain(l.rate, currency)}</span>
              <span style={{ flex: 1.6, textAlign: "right" }}>{plain(l.amount, currency)}</span>
            </div>
          </div>
        ))
      )}

      {rule("-")}

      {/* totals */}
      {L(`Subtotal (${b.totalQty} item${b.totalQty === 1 ? "" : "s"}):`, plain(b.subtotal, currency))}
      {b.discountPct ? L(`Discount @${b.discountPct}%:`, `-${plain(b.discount, currency)}`) : null}
      {b.gstPct ? L(`CGST @${b.gstPct / 2}%:`, plain(b.cgst, currency)) : null}
      {b.gstPct ? L(`SGST @${b.gstPct / 2}%:`, plain(b.sgst, currency)) : null}
      {b.roundOff ? L("Round Off:", `${b.roundOff > 0 ? "+" : "-"}${plain(Math.abs(b.roundOff), currency)}`) : null}

      {rule("=")}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
        <span>TOTAL</span>
        <span>{plain(b.rounded, currency)}</span>
      </div>
      {rule("=")}

      {L("Paid via:", paymentMethod)}

      {/* footer */}
      <div style={{ textAlign: "center", marginTop: 20, lineHeight: 1.7, fontWeight: 700 }}>
        <div>GET WELL SOON !</div>
        <div style={{ color: t.muted, fontSize: 11 }}>** MEDICINES ONCE SOLD NOT RETURNABLE **</div>
        <div style={{ color: t.muted, fontSize: 11, marginTop: 6 }}>*** THANK YOU, VISIT AGAIN ***</div>
      </div>
    </div>
  );
}
