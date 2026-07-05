import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  money,
  plain,
  fmtDMonY,
  fmtDMY,
  paperStyle,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared bag                                                         */
/* ------------------------------------------------------------------ */

type Bag = {
  t: ReturnType<typeof themeById>;
  currency: string;
  crumpled: boolean;
  airline: string;
  pnr: string;
  flightNo: string;
  fromCity: string;
  toCity: string;
  travelDate: string;
  departTime: string;
  travelClass: string;
  seatNo: string;
  passengerName: string;
  baseFare: string;
  taxes: string;
  convenienceFee: string;
  ticketNo: string;
  paymentMethod: string;
  agencyName: string;
  agencyAddress: string;
  gstin: string;
  invoiceNo: string;
  bookingDate: string;
  // computed
  subtotal: number;
  total: number;
};

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

/** Split "Delhi (DEL)" -> { name: "Delhi", code: "DEL" }. */
function splitCity(v: string): { name: string; code: string } {
  const m = v.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (m) return { name: m[1].trim(), code: m[2].trim().toUpperCase() };
  return { name: v.trim(), code: "" };
}

export default function FlightBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const baseFare = str(data, "baseFare");
  const taxes = str(data, "taxes");
  const convenienceFee = str(data, "convenienceFee");
  const subtotal = num(baseFare);
  const total = num(baseFare) + num(taxes) + num(convenienceFee);

  const bag: Bag = {
    t,
    currency,
    crumpled,
    airline: str(data, "airline"),
    pnr: str(data, "pnr"),
    flightNo: str(data, "flightNo"),
    fromCity: str(data, "fromCity"),
    toCity: str(data, "toCity"),
    travelDate: str(data, "travelDate"),
    departTime: str(data, "departTime"),
    travelClass: str(data, "travelClass"),
    seatNo: str(data, "seatNo"),
    passengerName: str(data, "passengerName"),
    baseFare,
    taxes,
    convenienceFee,
    ticketNo: str(data, "ticketNo"),
    paymentMethod: str(data, "paymentMethod"),
    agencyName: str(data, "agencyName"),
    agencyAddress: str(data, "agencyAddress"),
    gstin: str(data, "gstin"),
    invoiceNo: str(data, "invoiceNo"),
    bookingDate: str(data, "bookingDate"),
    subtotal,
    total,
  };

  switch (template) {
    case "template-2":
      return <TaxInvoice {...bag} />;
    case "template-1":
    default:
      return <ETicket {...bag} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — E-Ticket (boarding-pass style with dashed stub)       */
/* ================================================================== */

function ETicket(p: Bag) {
  const { t } = p;
  const from = splitCity(p.fromCity);
  const to = splitCity(p.toCity);

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 13,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        borderRadius: 10,
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header band */}
      <div
        style={{
          background: t.accent,
          color: "#ffffff",
          padding: "16px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0.5 }}>
            {p.airline || "Airline"}
          </div>
          <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 2, textTransform: "uppercase" }}>
            Electronic Ticket / Boarding Pass
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>PNR</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 3 }}>{p.pnr || "—"}</div>
        </div>
      </div>

      {/* route */}
      <div style={{ padding: "22px 24px 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ textAlign: "center", minWidth: 130 }}>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: t.accent, letterSpacing: 1 }}>
            {from.code || "—"}
          </div>
          <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>{from.name}</div>
        </div>

        <div style={{ flex: 1, padding: "0 14px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.muted }}>
            <span style={{ flex: 1, borderTop: `2px dashed ${t.muted}` }} />
            <span style={{ fontSize: 22, color: t.accent }}>&#9992;</span>
            <span style={{ flex: 1, borderTop: `2px dashed ${t.muted}` }} />
          </div>
          <div style={{ fontSize: 11, color: t.muted, marginTop: 6 }}>
            {p.flightNo ? `Flight ${p.flightNo}` : ""}
          </div>
        </div>

        <div style={{ textAlign: "center", minWidth: 130 }}>
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: t.accent, letterSpacing: 1 }}>
            {to.code || "—"}
          </div>
          <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>{to.name}</div>
        </div>
      </div>

      {/* detail grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px 18px",
          padding: "20px 24px 22px",
        }}
      >
        <Cell k="Passenger" v={p.passengerName} ink={t.ink} muted={t.muted} span={2} />
        <Cell k="Class" v={p.travelClass} ink={t.ink} muted={t.muted} />
        <Cell k="Seat" v={p.seatNo} ink={t.ink} muted={t.muted} />
        <Cell k="Date" v={fmtDMonY(p.travelDate)} ink={t.ink} muted={t.muted} />
        <Cell k="Departure" v={p.departTime} ink={t.ink} muted={t.muted} />
        <Cell k="Flight" v={p.flightNo} ink={t.ink} muted={t.muted} />
        <Cell k="Ticket No." v={p.ticketNo} ink={t.ink} muted={t.muted} />
      </div>

      {/* dashed perforation */}
      <div style={{ position: "relative", height: 0, borderTop: `2px dashed ${t.muted}`, margin: "0 0" }}>
        <span style={notch("left", t)} />
        <span style={notch("right", t)} />
      </div>

      {/* stub */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px 18px",
          background: "rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", gap: 28 }}>
          <StubCell k="PNR" v={p.pnr} ink={t.ink} muted={t.muted} />
          <StubCell k="Seat" v={p.seatNo} ink={t.ink} muted={t.muted} />
          <StubCell k="Class" v={p.travelClass} ink={t.ink} muted={t.muted} />
          <StubCell k="Flight" v={p.flightNo} ink={t.ink} muted={t.muted} />
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>
            Amount Paid
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.accent }}>{plain(p.total, p.currency)}</div>
        </div>
      </div>

      {/* faux barcode */}
      <div style={{ padding: "0 24px 18px" }}>
        <Barcode ink={t.ink} />
        <div style={{ textAlign: "center", fontSize: 10, color: t.muted, marginTop: 6, letterSpacing: 1 }}>
          {p.ticketNo || p.pnr || "BOARDING PASS"} &middot; {p.passengerName || ""}
        </div>
      </div>
    </div>
  );
}

function Cell({
  k,
  v,
  ink,
  muted,
  span = 1,
}: {
  k: string;
  v: string;
  ink: string;
  muted: string;
  span?: number;
}) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: ink, marginTop: 2 }}>{v || "—"}</div>
    </div>
  );
}

function StubCell({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: ink }}>{v || "—"}</div>
    </div>
  );
}

function notch(side: "left" | "right", t: Bag["t"]) {
  return {
    position: "absolute" as const,
    top: -11,
    [side]: -11,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: t.paper,
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
  };
}

function Barcode({ ink }: { ink: string }) {
  // deterministic bar pattern (no randomness across renders)
  const widths = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1];
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 2, height: 46 }}>
      {widths.map((w, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: w,
            background: i % 2 === 0 ? ink : "transparent",
            height: "100%",
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Tax Invoice (GST)                                     */
/* ================================================================== */

function TaxInvoice(p: Bag) {
  const { t } = p;
  const routeLabel = [p.fromCity, p.toCity].filter(Boolean).join(" → ");

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12,
        padding: 24,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
        ...paperStyle(t, p.crumpled),
      }}
    >
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: t.accent }}>TAX INVOICE</div>
        <div style={{ fontSize: 10, color: t.muted, letterSpacing: 1 }}>Air Travel Services</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ maxWidth: 340 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>{p.agencyName || p.airline}</div>
          {p.agencyAddress ? <div style={{ color: t.muted, lineHeight: 1.5 }}>{p.agencyAddress}</div> : null}
          {p.gstin ? (
            <div style={{ color: t.ink, marginTop: 4 }}>
              <span style={{ color: t.muted }}>GSTIN: </span>
              {p.gstin}
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
          {p.bookingDate ? (
            <div>
              <span style={{ color: t.muted }}>Booking Date: </span>
              {fmtDMY(p.bookingDate)}
            </div>
          ) : null}
          {p.pnr ? (
            <div>
              <span style={{ color: t.muted }}>PNR: </span>
              {p.pnr}
            </div>
          ) : null}
          {p.ticketNo ? (
            <div>
              <span style={{ color: t.muted }}>Ticket No: </span>
              {p.ticketNo}
            </div>
          ) : null}
        </div>
      </div>

      {/* passenger / journey block */}
      <div
        style={{
          border: `1px solid ${t.muted}`,
          padding: "10px 12px",
          marginBottom: 12,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px 14px",
        }}
      >
        <KvSmall k="Passenger" v={p.passengerName} ink={t.ink} muted={t.muted} />
        <KvSmall k="Airline" v={p.airline} ink={t.ink} muted={t.muted} />
        <KvSmall k="Flight" v={p.flightNo} ink={t.ink} muted={t.muted} />
        <KvSmall k="Sector" v={routeLabel} ink={t.ink} muted={t.muted} />
        <KvSmall k="Travel Date" v={fmtDMY(p.travelDate)} ink={t.ink} muted={t.muted} />
        <KvSmall k="Class" v={p.travelClass} ink={t.ink} muted={t.muted} />
      </div>

      {/* charges table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Description</th>
            <th style={{ textAlign: "center", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>SAC</th>
            <th style={{ textAlign: "right", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <ChargeRow d={`Air Fare (${p.travelClass || "Economy"})`} sac="996425" v={p.baseFare} t={t} currency={p.currency} />
          <ChargeRow d="Taxes & Fees (incl. GST)" sac="996425" v={p.taxes} t={t} currency={p.currency} />
          <ChargeRow d="Convenience Fee" sac="998551" v={p.convenienceFee} t={t} currency={p.currency} />
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div style={{ width: 280 }}>
          <TotalRow label="Base Fare" value={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
          <TotalRow label="Taxes & Fees" value={money(p.taxes, p.currency)} ink={t.ink} muted={t.muted} />
          <TotalRow label="Convenience Fee" value={money(p.convenienceFee, p.currency)} ink={t.ink} muted={t.muted} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              background: t.accent,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 14,
              borderRadius: 4,
              marginTop: 6,
            }}
          >
            <span>GRAND TOTAL</span>
            <span>{plain(p.total, p.currency)}</span>
          </div>
          {p.paymentMethod ? (
            <div style={{ textAlign: "right", color: t.muted, fontSize: 10, marginTop: 4 }}>
              Paid via {p.paymentMethod}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 340, lineHeight: 1.5 }}>
          This is a computer generated tax invoice and does not require a physical signature. Fares include
          applicable GST. E. &amp; O.E.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 160, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            For {p.agencyName || p.airline || "the Issuer"}
          </div>
        </div>
      </div>
    </div>
  );
}

function KvSmall({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: ink }}>{v || "—"}</div>
    </div>
  );
}

function ChargeRow({
  d,
  sac,
  v,
  t,
  currency,
}: {
  d: string;
  sac: string;
  v: string;
  t: Bag["t"];
  currency: string;
}) {
  return (
    <tr>
      <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink }}>{d}</td>
      <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "center" }}>{sac}</td>
      <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "right" }}>
        {money(v, currency)}
      </td>
    </tr>
  );
}

function TotalRow({ label, value, ink, muted }: { label: string; value: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px", color: muted }}>
      <span>{label}</span>
      <span style={{ color: ink }}>{value}</span>
    </div>
  );
}
