import { PreviewProps } from "@/types/generator";
import { themeById } from "@/lib/themes";
import {
  str,
  num,
  plain,
  fmtDMonY,
  fmtDMY,
  parseItems,
  paperStyle,
} from "./shared";

/* ================================================================== */
/* shared model                                                       */
/* ================================================================== */

type Line = { desc: string; qty: number; rate: number; amt: number };

type HV = {
  t: ReturnType<typeof themeById>;
  crumpled: boolean;
  currency: string;
  hotelName: string;
  address: string;
  gstin: string;
  folioNo: string;
  guestName: string;
  roomNo: string;
  roomType: string;
  nights: number;
  checkIn: string;
  checkOut: string;
  paymentMethod: string;
  cgstPct: number;
  sgstPct: number;
  lines: Line[];
  subtotal: number;
  cgst: number;
  sgst: number;
  total: number;
};

const FONT = "'Product Sans', 'Montserrat', Arial, sans-serif";

export default function HotelBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const rows = parseItems(data.items);
  const lines: Line[] = rows.map((r) => {
    const qty = num(r.qty);
    const rate = num(r.rate);
    return { desc: r.desc || "", qty, rate, amt: qty * rate };
  });

  const subtotal = lines.reduce((s, l) => s + l.amt, 0);
  const cgstPct = num(str(data, "cgstPct"));
  const sgstPct = num(str(data, "sgstPct"));
  const cgst = (subtotal * cgstPct) / 100;
  const sgst = (subtotal * sgstPct) / 100;
  const total = subtotal + cgst + sgst;

  const v: HV = {
    t,
    crumpled,
    currency,
    hotelName: str(data, "hotelName"),
    address: str(data, "address"),
    gstin: str(data, "gstin"),
    folioNo: str(data, "folioNo"),
    guestName: str(data, "guestName"),
    roomNo: str(data, "roomNo"),
    roomType: str(data, "roomType"),
    nights: num(str(data, "nights")),
    checkIn: str(data, "checkIn"),
    checkOut: str(data, "checkOut"),
    paymentMethod: str(data, "paymentMethod"),
    cgstPct,
    sgstPct,
    lines,
    subtotal,
    cgst,
    sgst,
    total,
  };

  switch (template) {
    case "template-2":
      return <Folio {...v} />;
    case "template-1":
    default:
      return <TaxInvoice {...v} />;
  }
}

function stay(checkIn: string, checkOut: string): string {
  const a = checkIn ? fmtDMonY(checkIn) : "";
  const b = checkOut ? fmtDMonY(checkOut) : "";
  if (a && b) return `${a} → ${b}`;
  return a || b || "—";
}

/* ================================================================== */
/* TEMPLATE 1 — Tax Invoice (~640px)                                  */
/* ================================================================== */

function TaxInvoice(p: HV) {
  const { t } = p;

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
      <div
        style={{
          background: t.accent,
          color: "#ffffff",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            <i className="fa-solid fa-hotel" aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 0.5 }}>{p.hotelName || "Hotel Name"}</div>
            <div style={{ fontSize: 11.5, opacity: 0.85, lineHeight: 1.5, whiteSpace: "pre-line", maxWidth: 320 }}>
              {p.address || "Hotel Address"}
            </div>
            {p.gstin ? <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>GSTIN: {p.gstin}</div> : null}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2 }}>TAX INVOICE</div>
          <div style={{ fontSize: 11.5, opacity: 0.9 }}>#{p.folioNo || "—"}</div>
        </div>
      </div>

      <div style={{ padding: "24px 30px 30px" }}>
        {/* guest + stay meta */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 22 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ fontSize: 10.5, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
              Guest
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.ink }}>{p.guestName || "Guest Name"}</div>
            <div style={{ fontSize: 12.5, color: t.muted, marginTop: 4 }}>
              Room: <span style={{ color: t.ink, fontWeight: 600 }}>{p.roomNo || "—"}</span>
              {p.roomType ? <span> · {p.roomType}</span> : null}
            </div>
            <div style={{ fontSize: 12.5, color: t.muted, marginTop: 2 }}>
              Nights: <span style={{ color: t.ink, fontWeight: 600 }}>{p.nights || "—"}</span>
            </div>
          </div>
          <div style={{ minWidth: 220, fontSize: 12.5 }}>
            <MetaRow k="Invoice Date" v={fmtDMonY(new Date().toISOString().slice(0, 10))} ink={t.ink} muted={t.muted} />
            <MetaRow k="Check-In" v={p.checkIn ? fmtDMonY(p.checkIn) : "—"} ink={t.ink} muted={t.muted} />
            <MetaRow k="Check-Out" v={p.checkOut ? fmtDMonY(p.checkOut) : "—"} ink={t.ink} muted={t.muted} />
            <MetaRow k="Payment" v={p.paymentMethod || "—"} ink={t.ink} muted={t.muted} />
          </div>
        </div>

        {/* charges table */}
        <div style={{ border: `1px solid ${t.muted}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ display: "flex", background: t.accent, color: "#ffffff", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4 }}>
            <div style={{ flex: 3, padding: "10px 14px" }}>Description</div>
            <div style={{ width: 60, padding: "10px 8px", textAlign: "center" }}>Qty</div>
            <div style={{ width: 120, padding: "10px 14px", textAlign: "right" }}>Rate</div>
            <div style={{ width: 130, padding: "10px 14px", textAlign: "right" }}>Amount</div>
          </div>
          {p.lines.length === 0 ? (
            <div style={{ padding: "14px", fontSize: 12.5, color: t.muted, textAlign: "center" }}>No charges added</div>
          ) : (
            p.lines.map((l, i) => (
              <div key={i} style={{ display: "flex", borderTop: i === 0 ? "none" : `1px solid ${t.muted}`, fontSize: 13 }}>
                <div style={{ flex: 3, padding: "11px 14px", color: t.ink, fontWeight: 600 }}>{l.desc || "—"}</div>
                <div style={{ width: 60, padding: "11px 8px", textAlign: "center", color: t.ink }}>{l.qty || "—"}</div>
                <div style={{ width: 120, padding: "11px 14px", textAlign: "right", color: t.ink }}>{plain(l.rate, p.currency)}</div>
                <div style={{ width: 130, padding: "11px 14px", textAlign: "right", color: t.ink }}>{plain(l.amt, p.currency)}</div>
              </div>
            ))
          )}
        </div>

        {/* totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 300, fontSize: 13 }}>
            <TotalRow k="Subtotal" v={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
            <TotalRow k={`CGST (${p.cgstPct}%)`} v={plain(p.cgst, p.currency)} ink={t.ink} muted={t.muted} />
            <TotalRow k={`SGST (${p.sgstPct}%)`} v={plain(p.sgst, p.currency)} ink={t.ink} muted={t.muted} />
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
              <span>Grand Total</span>
              <span>{plain(p.total, p.currency)}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 24, paddingTop: 12, fontSize: 11, color: t.muted, lineHeight: 1.6 }}>
          <div>Tariff inclusive of applicable GST. Check-out time is 12:00 noon. Thank you for staying with us.</div>
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
/* TEMPLATE 2 — Folio                                                 */
/* ================================================================== */

function Folio(p: HV) {
  const { t } = p;

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: FONT,
        padding: "34px 38px 30px",
        boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 6,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* heading */}
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 14, marginBottom: 18 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: t.accent, letterSpacing: 0.5 }}>{p.hotelName || "Hotel Name"}</div>
        <div style={{ fontSize: 12, color: t.muted, marginTop: 4, whiteSpace: "pre-line", lineHeight: 1.5 }}>
          {p.address || "Hotel Address"}
        </div>
        {p.gstin ? <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>GSTIN: {p.gstin}</div> : null}
        <div
          style={{
            display: "inline-block",
            marginTop: 10,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: t.accent,
            border: `1px solid ${t.accent}`,
            borderRadius: 999,
            padding: "4px 16px",
          }}
        >
          Guest Folio
        </div>
      </div>

      {/* guest registration grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 28px", fontSize: 12.5, marginBottom: 18 }}>
        <FItem k="Guest Name" v={p.guestName || "—"} ink={t.ink} muted={t.muted} />
        <FItem k="Folio No." v={p.folioNo || "—"} ink={t.ink} muted={t.muted} />
        <FItem k="Room No." v={p.roomNo || "—"} ink={t.ink} muted={t.muted} />
        <FItem k="Room Type" v={p.roomType || "—"} ink={t.ink} muted={t.muted} />
        <FItem k="Stay" v={stay(p.checkIn, p.checkOut)} ink={t.ink} muted={t.muted} />
        <FItem k="Nights" v={p.nights ? String(p.nights) : "—"} ink={t.ink} muted={t.muted} />
      </div>

      {/* charges ledger */}
      <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
        Charge Ledger
      </div>
      <div style={{ borderTop: `2px dashed ${t.muted}`, borderBottom: `2px dashed ${t.muted}`, padding: "4px 0" }}>
        {/* column heads */}
        <div style={{ display: "flex", padding: "7px 2px", fontSize: 11, color: t.muted, letterSpacing: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
          <div style={{ flex: 3 }}>Particulars</div>
          <div style={{ width: 50, textAlign: "center" }}>Qty</div>
          <div style={{ width: 110, textAlign: "right" }}>Rate</div>
          <div style={{ width: 120, textAlign: "right" }}>Amount</div>
        </div>
        {p.lines.length === 0 ? (
          <div style={{ padding: "10px 2px", fontSize: 12.5, color: t.muted }}>No charges added</div>
        ) : (
          p.lines.map((l, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "8px 2px",
                fontSize: 13,
                borderTop: `1px dotted ${t.muted}`,
                color: t.ink,
              }}
            >
              <div style={{ flex: 3 }}>{l.desc || "—"}</div>
              <div style={{ width: 50, textAlign: "center" }}>{l.qty || "—"}</div>
              <div style={{ width: 110, textAlign: "right" }}>{plain(l.rate, p.currency)}</div>
              <div style={{ width: 120, textAlign: "right" }}>{plain(l.amt, p.currency)}</div>
            </div>
          ))
        )}
      </div>

      {/* totals + payment */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 18, alignItems: "flex-start" }}>
        <div style={{ fontSize: 12, color: t.muted, maxWidth: 260, lineHeight: 1.7 }}>
          <div style={{ fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Settlement</div>
          <div>
            Mode: <span style={{ color: t.ink, fontWeight: 600 }}>{p.paymentMethod || "—"}</span>
          </div>
          <div style={{ marginTop: 2 }}>Settled on {p.checkOut ? fmtDMY(p.checkOut) : fmtDMY(new Date().toISOString().slice(0, 10))}</div>
        </div>
        <div style={{ width: 280, fontSize: 13 }}>
          <LedgerRow k="Subtotal" v={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
          <LedgerRow k={`CGST (${p.cgstPct}%)`} v={plain(p.cgst, p.currency)} ink={t.ink} muted={t.muted} />
          <LedgerRow k={`SGST (${p.sgstPct}%)`} v={plain(p.sgst, p.currency)} ink={t.ink} muted={t.muted} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              paddingTop: 10,
              borderTop: `2px solid ${t.accent}`,
              fontSize: 16,
              fontWeight: 800,
              color: t.accent,
            }}
          >
            <span>Balance Due</span>
            <span>{plain(p.total, p.currency)}</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", color: t.muted, fontSize: 10.5, marginTop: 22, borderTop: `1px solid ${t.muted}`, paddingTop: 10, lineHeight: 1.6 }}>
        I agree that my liability for this bill is not waived and agree to be held personally liable in the event that the indicated person or company fails to pay. This is a computer-generated folio.
      </div>
    </div>
  );
}

function FItem({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div>
      <div style={{ color: muted, fontSize: 10.5, letterSpacing: 0.5, textTransform: "uppercase" }}>{k}</div>
      <div style={{ color: ink, fontWeight: 600, fontSize: 13, marginTop: 1, whiteSpace: "pre-line" }}>{v}</div>
    </div>
  );
}

function LedgerRow({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", color: muted }}>
      <span>{k}</span>
      <span style={{ color: ink }}>{v}</span>
    </div>
  );
}
