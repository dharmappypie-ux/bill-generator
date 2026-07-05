import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  plain,
  fmtDMonY,
  fmtDMY,
  paperStyle,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* Ola brand palette (green/teal)                                     */
/* ------------------------------------------------------------------ */
const OLA = "#0d9b6c"; // primary green
const OLA_DARK = "#0a7a55";
const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";
const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

type Shared = {
  t: ReturnType<typeof themeById>;
  currency: string;
  crumpled: boolean;
  crn: string;
  category: string;
  riderName: string;
  driverName: string;
  vehicleNo: string;
  distanceKm: string;
  rideTimeMin: string;
  date: string;
  time: string;
  pickup: string;
  drop: string;
  baseFare: string;
  rideTimeCharge: string;
  distanceCharge: string;
  accessFee: string;
  tax: string;
  paymentMethod: string;
  subtotal: number;
  total: number;
};

export default function OlaBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const baseFare = str(data, "baseFare");
  const rideTimeCharge = str(data, "rideTimeCharge");
  const distanceCharge = str(data, "distanceCharge");
  const accessFee = str(data, "accessFee");
  const tax = str(data, "tax");

  const subtotal =
    num(baseFare) + num(rideTimeCharge) + num(distanceCharge) + num(accessFee);
  const total = subtotal + num(tax);

  const shared: Shared = {
    t,
    currency,
    crumpled,
    crn: str(data, "crn"),
    category: str(data, "category"),
    riderName: str(data, "riderName"),
    driverName: str(data, "driverName"),
    vehicleNo: str(data, "vehicleNo"),
    distanceKm: str(data, "distanceKm"),
    rideTimeMin: str(data, "rideTimeMin"),
    date: str(data, "date"),
    time: str(data, "time"),
    pickup: str(data, "pickup"),
    drop: str(data, "drop"),
    baseFare,
    rideTimeCharge,
    distanceCharge,
    accessFee,
    tax,
    paymentMethod: str(data, "paymentMethod"),
    subtotal,
    total,
  };

  switch (template) {
    case "template-2":
      return <Invoice {...shared} />;
    case "template-1":
    default:
      return <RideReceipt {...shared} />;
  }
}

/* small renderers ----------------------------------------------------- */

/** Label left, value right (two-column). */
function Row({
  label,
  value,
  ink,
  muted,
  bold,
  size = 12.5,
}: {
  label: string;
  value: string;
  ink: string;
  muted: string;
  bold?: boolean;
  size?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        lineHeight: 1.85,
        fontSize: size,
      }}
    >
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{label}</span>
      <span
        style={{
          color: ink,
          fontWeight: bold ? 700 : 400,
          textAlign: "right",
          maxWidth: "60%",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

/* Pickup / drop route, dot-and-line style */
function Route({
  pickup,
  drop,
  ink,
  muted,
}: {
  pickup: string;
  drop: string;
  ink: string;
  muted: string;
}) {
  if (!pickup && !drop) return null;
  return (
    <div style={{ display: "flex", gap: 10, margin: "4px 0 2px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 4,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            border: `2px solid ${OLA}`,
            display: "block",
          }}
        />
        <span
          style={{
            flex: 1,
            width: 2,
            background: muted,
            display: "block",
            margin: "3px 0",
            minHeight: 18,
          }}
        />
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 2,
            background: OLA_DARK,
            display: "block",
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: muted }}>PICKUP</div>
        <div style={{ fontSize: 12.5, color: ink, marginBottom: 12, lineHeight: 1.45 }}>
          {pickup || "—"}
        </div>
        <div style={{ fontSize: 11, color: muted }}>DROP</div>
        <div style={{ fontSize: 12.5, color: ink, lineHeight: 1.45 }}>{drop || "—"}</div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 1 — Ride Receipt (thermal-ish app slip, ~420px)           */
/* ================================================================== */

function RideReceipt(p: Shared) {
  const { t } = p;
  const dateTime = [fmtDMonY(p.date), p.time].filter(Boolean).join(", ");

  return (
    <div
      style={{
        width: 420,
        margin: "0 auto",
        background: "#ffffff",
        color: t.ink,
        fontFamily: MONO,
        fontSize: 13,
        padding: 0,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* green banner header */}
      <div
        style={{
          background: OLA,
          color: "#ffffff",
          padding: "20px 26px 18px",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 1 }}>
          Ola
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12, opacity: 0.92, marginTop: 2 }}>
          Ride Receipt
        </div>
      </div>

      <div style={{ padding: "20px 26px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: t.muted }}>TOTAL FARE</div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 30,
              color: OLA_DARK,
              lineHeight: 1.1,
            }}
          >
            {plain(p.total, p.currency)}
          </div>
          {dateTime ? (
            <div style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }}>{dateTime}</div>
          ) : null}
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "12px 0" }} />

        <Route pickup={p.pickup} drop={p.drop} ink={t.ink} muted={t.muted} />

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "12px 0" }} />

        <Row label="CRN" value={p.crn} ink={t.ink} muted={t.muted} />
        <Row label="Category" value={p.category} ink={t.ink} muted={t.muted} />
        <Row label="Rider" value={p.riderName} ink={t.ink} muted={t.muted} />
        <Row label="Driver" value={p.driverName} ink={t.ink} muted={t.muted} />
        <Row label="Vehicle" value={p.vehicleNo} ink={t.ink} muted={t.muted} />
        <Row
          label="Distance"
          value={p.distanceKm ? `${p.distanceKm} km` : ""}
          ink={t.ink}
          muted={t.muted}
        />
        <Row
          label="Ride Time"
          value={p.rideTimeMin ? `${p.rideTimeMin} min` : ""}
          ink={t.ink}
          muted={t.muted}
        />

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "12px 0" }} />

        <div style={{ fontSize: 11, color: t.muted, marginBottom: 4, letterSpacing: 1 }}>
          FARE BREAKDOWN
        </div>
        <Row label="Base Fare" value={plain(num(p.baseFare), p.currency)} ink={t.ink} muted={t.muted} />
        <Row
          label="Ride Time Charge"
          value={plain(num(p.rideTimeCharge), p.currency)}
          ink={t.ink}
          muted={t.muted}
        />
        <Row
          label="Distance Charge"
          value={plain(num(p.distanceCharge), p.currency)}
          ink={t.ink}
          muted={t.muted}
        />
        <Row label="Access Fee" value={plain(num(p.accessFee), p.currency)} ink={t.ink} muted={t.muted} />
        <Row label="GST (5%)" value={plain(num(p.tax), p.currency)} ink={t.ink} muted={t.muted} />

        <div style={{ borderTop: `1px solid ${t.ink}`, margin: "10px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 16,
            color: OLA_DARK,
          }}
        >
          <span>TOTAL</span>
          <span>{plain(p.total, p.currency)}</span>
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "12px 0" }} />
        <Row label="Paid via" value={p.paymentMethod} ink={t.ink} muted={t.muted} bold />

        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 11.5,
            color: t.muted,
            lineHeight: 1.6,
          }}
        >
          Thank you for riding with Ola!
          <br />
          For support, visit help.olacabs.com
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Tax Invoice (GST, ~640px)                             */
/* ================================================================== */

function Invoice(p: Shared) {
  const { t } = p;

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        background: "#ffffff",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        padding: 0,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        overflow: "hidden",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div
        style={{
          background: OLA,
          color: "#ffffff",
          padding: "20px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 1, lineHeight: 1 }}>Ola</div>
          <div style={{ fontSize: 11.5, opacity: 0.92, marginTop: 4 }}>
            ANI Technologies Pvt. Ltd.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>TAX INVOICE</div>
          <div style={{ fontSize: 11.5, opacity: 0.92, marginTop: 4 }}>GSTIN: 29AABCA1234M1Z5</div>
        </div>
      </div>

      <div style={{ padding: "22px 28px 26px" }}>
        {/* meta two-column */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, marginBottom: 4 }}>
              BILL TO
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.ink }}>
              {p.riderName || "—"}
            </div>
            <div style={{ color: t.muted, marginTop: 2 }}>Payment: {p.paymentMethod || "—"}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            {p.crn ? (
              <div>
                <span style={{ color: t.muted }}>Invoice / CRN: </span>
                <span style={{ color: t.ink, fontWeight: 700 }}>{p.crn}</span>
              </div>
            ) : null}
            {p.date ? (
              <div>
                <span style={{ color: t.muted }}>Date: </span>
                <span style={{ color: t.ink }}>{fmtDMY(p.date)}</span>
              </div>
            ) : null}
            {p.time ? (
              <div>
                <span style={{ color: t.muted }}>Time: </span>
                <span style={{ color: t.ink }}>{p.time}</span>
              </div>
            ) : null}
            {p.category ? (
              <div>
                <span style={{ color: t.muted }}>Category: </span>
                <span style={{ color: t.ink }}>{p.category}</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* trip box */}
        <div
          style={{
            border: `1px solid ${t.muted}`,
            borderRadius: 6,
            padding: "12px 14px",
            marginBottom: 18,
            display: "flex",
            gap: 28,
          }}
        >
          <div style={{ flex: 1 }}>
            <Route pickup={p.pickup} drop={p.drop} ink={t.ink} muted={t.muted} />
          </div>
          <div style={{ width: 200 }}>
            <Row label="Driver" value={p.driverName} ink={t.ink} muted={t.muted} />
            <Row label="Vehicle" value={p.vehicleNo} ink={t.ink} muted={t.muted} />
            <Row
              label="Distance"
              value={p.distanceKm ? `${p.distanceKm} km` : ""}
              ink={t.ink}
              muted={t.muted}
            />
            <Row
              label="Duration"
              value={p.rideTimeMin ? `${p.rideTimeMin} min` : ""}
              ink={t.ink}
              muted={t.muted}
            />
          </div>
        </div>

        {/* fare table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: OLA, color: "#ffffff" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", border: "1px solid rgba(0,0,0,0.12)" }}>
                Fare Component
              </th>
              <th style={{ textAlign: "right", padding: "8px 12px", border: "1px solid rgba(0,0,0,0.12)" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Base Fare", num(p.baseFare)],
              ["Ride Time Charge", num(p.rideTimeCharge)],
              ["Distance Charge", num(p.distanceCharge)],
              ["Access / Convenience Fee", num(p.accessFee)],
            ].map(([label, val], i) => (
              <tr key={i}>
                <td style={{ padding: "8px 12px", border: `1px solid ${t.muted}`, color: t.ink }}>
                  {label as string}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    border: `1px solid ${t.muted}`,
                    color: t.ink,
                    textAlign: "right",
                  }}
                >
                  {plain(val as number, p.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* totals block */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 300 }}>
            <Row label="Subtotal" value={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
            <Row label="GST (5%)" value={plain(num(p.tax), p.currency)} ink={t.ink} muted={t.muted} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "11px 14px",
                background: OLA,
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                borderRadius: 5,
                marginTop: 8,
              }}
            >
              <span>TOTAL PAID</span>
              <span>{plain(p.total, p.currency)}</span>
            </div>
            <div style={{ textAlign: "right", color: t.muted, fontSize: 10.5, marginTop: 4 }}>
              (inclusive of all taxes)
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 28,
          }}
        >
          <div style={{ color: t.muted, fontSize: 10.5, maxWidth: 360, lineHeight: 1.5 }}>
            This is a computer-generated tax invoice and does not require a signature. SAC: 996412
            (Passenger transport). E. &amp; O.E.
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                borderTop: `1px solid ${t.ink}`,
                width: 160,
                paddingTop: 4,
                color: t.muted,
                fontSize: 11,
              }}
            >
              For ANI Technologies Pvt. Ltd.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
