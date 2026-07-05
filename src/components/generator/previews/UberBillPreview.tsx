import { PreviewProps } from "@/types/generator";
import { str, num, money, plain, fmtDMonY, fmtDMY, paperStyle } from "./shared";
import { themeById } from "@/lib/themes";

/* Near-black Uber header bar regardless of theme accent. */
const UBER_BLACK = "#000000";
const UBER_DARK = "#0d0d0d";
const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

type Vals = {
  riderName: string;
  driverName: string;
  carModel: string;
  plateNo: string;
  tripId: string;
  rideType: string;
  pickup: string;
  drop: string;
  distanceKm: string;
  durationMin: string;
  date: string;
  time: string;
  baseFare: string;
  distanceFare: string;
  timeFare: string;
  surge: string;
  bookingFee: string;
  tax: string;
  paymentMethod: string;
};

function readVals(data: PreviewProps["data"]): Vals {
  return {
    riderName: str(data, "riderName"),
    driverName: str(data, "driverName"),
    carModel: str(data, "carModel"),
    plateNo: str(data, "plateNo"),
    tripId: str(data, "tripId"),
    rideType: str(data, "rideType"),
    pickup: str(data, "pickup"),
    drop: str(data, "drop"),
    distanceKm: str(data, "distanceKm"),
    durationMin: str(data, "durationMin"),
    date: str(data, "date"),
    time: str(data, "time"),
    baseFare: str(data, "baseFare"),
    distanceFare: str(data, "distanceFare"),
    timeFare: str(data, "timeFare"),
    surge: str(data, "surge"),
    bookingFee: str(data, "bookingFee"),
    tax: str(data, "tax"),
    paymentMethod: str(data, "paymentMethod"),
  };
}

function fareTotal(v: Vals): number {
  return (
    num(v.baseFare) +
    num(v.distanceFare) +
    num(v.timeFare) +
    num(v.surge) +
    num(v.bookingFee) +
    num(v.tax)
  );
}

/* Uber wordmark in white on the black bar. */
function UberMark({ size = 26 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 800, letterSpacing: -1, color: "#ffffff", fontFamily: SANS }}>
      Uber
    </span>
  );
}

/* Small map-style pin row: pickup (dot) -> drop (square). */
function RoutePin({
  label,
  place,
  kind,
  ink,
  muted,
}: {
  label: string;
  place: string;
  kind: "dot" | "square";
  ink: string;
  muted: string;
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 3 }}>
        <span
          style={{
            width: 10,
            height: 10,
            background: kind === "dot" ? "#1fbf5a" : UBER_BLACK,
            borderRadius: kind === "dot" ? "50%" : 1,
            display: "block",
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: muted }}>{label}</div>
        <div style={{ fontSize: 13, color: ink, fontWeight: 600, lineHeight: 1.4 }}>{place || "—"}</div>
      </div>
    </div>
  );
}

function FareRow({
  label,
  amount,
  currency,
  ink,
  muted,
  strong,
}: {
  label: string;
  amount: string;
  currency: string;
  ink: string;
  muted: string;
  strong?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
      <span style={{ color: strong ? ink : muted, fontWeight: strong ? 700 : 400 }}>{label}</span>
      <span style={{ color: ink, fontWeight: strong ? 700 : 500 }}>{money(amount, currency)}</span>
    </div>
  );
}

export default function UberBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);
  const v = readVals(data);
  const total = fareTotal(v);

  if (template === "template-2") {
    return <TripInvoice t={t} v={v} total={total} currency={currency} crumpled={crumpled} />;
  }
  return <RideReceipt t={t} v={v} total={total} currency={currency} crumpled={crumpled} />;
}

type TplProps = {
  t: ReturnType<typeof themeById>;
  v: Vals;
  total: number;
  currency: string;
  crumpled: boolean;
};

/* ================================================================== */
/* TEMPLATE 1 — Ride Receipt (black header, fare breakup, ~420px)     */
/* ================================================================== */

function RideReceipt({ t, v, total, currency, crumpled }: TplProps) {
  return (
    <div
      style={{
        width: 420,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        boxShadow: "0 12px 30px rgba(0,0,0,0.20)",
        borderRadius: 6,
        overflow: "hidden",
        ...paperStyle(t, crumpled),
      }}
    >
      {/* Black header */}
      <div style={{ background: UBER_BLACK, padding: "22px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <UberMark size={28} />
          <span style={{ fontSize: 11, color: "#bdbdbd", letterSpacing: 1, textTransform: "uppercase" }}>
            Receipt
          </span>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, color: "#9a9a9a" }}>Total</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>
            {plain(total, currency)}
          </div>
          <div style={{ fontSize: 12, color: "#bdbdbd", marginTop: 4 }}>
            {[fmtDMonY(v.date), v.time].filter(Boolean).join("  •  ")}
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 24px 24px" }}>
        {/* Driver / car strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 14,
            marginBottom: 6,
            borderBottom: `1px solid ${t.muted}33`,
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{v.driverName || "—"}</div>
            <div style={{ fontSize: 12, color: t.muted }}>{v.carModel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>
              {v.rideType || "Ride"}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: t.ink,
                border: `1px solid ${t.ink}`,
                borderRadius: 3,
                padding: "2px 6px",
                marginTop: 4,
                display: "inline-block",
                letterSpacing: 1,
              }}
            >
              {v.plateNo || "—"}
            </div>
          </div>
        </div>

        {/* Route */}
        <RoutePin label="Pickup" place={v.pickup} kind="dot" ink={t.ink} muted={t.muted} />
        <div style={{ marginLeft: 4, borderLeft: `2px dashed ${t.muted}66`, height: 10 }} />
        <RoutePin label="Dropoff" place={v.drop} kind="square" ink={t.ink} muted={t.muted} />

        {/* Trip stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            textAlign: "center",
            background: `${t.muted}14`,
            borderRadius: 6,
            padding: "12px 8px",
            margin: "14px 0",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.ink }}>{v.distanceKm || "0"}</div>
            <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>km</div>
          </div>
          <div style={{ width: 1, background: `${t.muted}40` }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.ink }}>{v.durationMin || "0"}</div>
            <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>min</div>
          </div>
        </div>

        {/* Fare breakup */}
        <div style={{ fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
          Fare breakup
        </div>
        <FareRow label="Base fare" amount={v.baseFare} currency={currency} ink={t.ink} muted={t.muted} />
        <FareRow label="Distance" amount={v.distanceFare} currency={currency} ink={t.ink} muted={t.muted} />
        <FareRow label="Time" amount={v.timeFare} currency={currency} ink={t.ink} muted={t.muted} />
        <FareRow label="Surge" amount={v.surge} currency={currency} ink={t.ink} muted={t.muted} />
        <FareRow label="Booking fee" amount={v.bookingFee} currency={currency} ink={t.ink} muted={t.muted} />
        <FareRow label="Taxes (GST)" amount={v.tax} currency={currency} ink={t.ink} muted={t.muted} />

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "8px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: UBER_BLACK,
            color: "#ffffff",
            padding: "10px 14px",
            borderRadius: 5,
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          <span>Total</span>
          <span>{plain(total, currency)}</span>
        </div>

        {/* Payment */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12 }}>
          <span style={{ color: t.muted }}>Paid with</span>
          <span style={{ color: t.ink, fontWeight: 600 }}>{v.paymentMethod || "—"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11 }}>
          <span style={{ color: t.muted }}>Trip ID</span>
          <span style={{ color: t.muted, fontFamily: "'Courier New', monospace" }}>{v.tripId || "—"}</span>
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: t.muted, lineHeight: 1.6 }}>
          Thanks for riding, {v.riderName || "rider"}.
          <br />
          This is a system generated receipt.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Trip Invoice (formal, ~640px)                         */
/* ================================================================== */

function TripInvoice({ t, v, total, currency, crumpled }: TplProps) {
  const fareItems: { label: string; amt: string }[] = [
    { label: "Base Fare", amt: v.baseFare },
    { label: "Distance Charge", amt: v.distanceFare },
    { label: "Time Charge", amt: v.timeFare },
    { label: "Surge / Peak Pricing", amt: v.surge },
    { label: "Booking Fee", amt: v.bookingFee },
  ];
  const subTotal = fareItems.reduce((s, it) => s + num(it.amt), 0);

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        borderRadius: 6,
        overflow: "hidden",
        ...paperStyle(t, crumpled),
      }}
    >
      {/* Black header bar */}
      <div
        style={{
          background: UBER_DARK,
          color: "#ffffff",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <UberMark size={30} />
          <div style={{ fontSize: 12, color: "#9a9a9a", marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>
            Trip Invoice
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "#cfcfcf", lineHeight: 1.7 }}>
          <div>
            <span style={{ color: "#8f8f8f" }}>Invoice No: </span>
            {v.tripId || "—"}
          </div>
          <div>
            <span style={{ color: "#8f8f8f" }}>Date: </span>
            {fmtDMY(v.date)}
          </div>
          {v.time ? (
            <div>
              <span style={{ color: "#8f8f8f" }}>Time: </span>
              {v.time}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ padding: "22px 28px 26px" }}>
        {/* Parties */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Billed To
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{v.riderName || "—"}</div>
            <div style={{ color: t.muted, marginTop: 2 }}>Trip ID: {v.tripId || "—"}</div>
            <div style={{ color: t.muted }}>Payment: {v.paymentMethod || "—"}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Driver
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{v.driverName || "—"}</div>
            <div style={{ color: t.muted, marginTop: 2 }}>{v.carModel}</div>
            <div style={{ color: t.muted }}>{v.plateNo}</div>
          </div>
        </div>

        {/* Route + stats box */}
        <div
          style={{
            border: `1px solid ${t.muted}40`,
            borderRadius: 6,
            padding: "14px 16px",
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div style={{ flex: 1 }}>
            <RoutePin label="Pickup" place={v.pickup} kind="dot" ink={t.ink} muted={t.muted} />
            <RoutePin label="Dropoff" place={v.drop} kind="square" ink={t.ink} muted={t.muted} />
          </div>
          <div
            style={{
              borderLeft: `1px solid ${t.muted}33`,
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              minWidth: 120,
            }}
          >
            <div>
              <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>Ride Type</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{v.rideType || "—"}</div>
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <div>
                <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>Distance</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{v.distanceKm || "0"} km</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>Duration</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>{v.durationMin || "0"} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fare table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: UBER_DARK, color: "#ffffff" }}>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>Charge Description</th>
              <th style={{ textAlign: "right", padding: "8px 12px", width: 160 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {fareItems.map((it, i) => (
              <tr key={it.label} style={{ background: i % 2 ? `${t.muted}10` : "transparent" }}>
                <td style={{ padding: "8px 12px", color: t.ink, borderBottom: `1px solid ${t.muted}26` }}>
                  {it.label}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    color: t.ink,
                    textAlign: "right",
                    borderBottom: `1px solid ${t.muted}26`,
                  }}
                >
                  {money(it.amt, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <div style={{ width: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", color: t.muted }}>
              <span>Subtotal</span>
              <span style={{ color: t.ink }}>{plain(subTotal, currency)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", color: t.muted }}>
              <span>Taxes (GST)</span>
              <span style={{ color: t.ink }}>{money(v.tax, currency)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "11px 14px",
                background: UBER_BLACK,
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                borderRadius: 5,
                marginTop: 6,
              }}
            >
              <span>Total Paid</span>
              <span>{plain(total, currency)}</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "20px 0 12px" }} />
        <div style={{ color: t.muted, fontSize: 10.5, lineHeight: 1.6 }}>
          This is a system generated trip invoice and does not require a signature. Fares are inclusive of applicable
          taxes. For support visit help.uber.com.
        </div>
      </div>
    </div>
  );
}
