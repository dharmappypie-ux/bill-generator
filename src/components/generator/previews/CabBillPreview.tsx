import { PreviewProps } from "@/types/generator";
import { str, num, money, plain, fmtDMonY, fmtDMY, paperStyle } from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* fonts                                                              */
/* ------------------------------------------------------------------ */
const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";
const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

/* ------------------------------------------------------------------ */
/* shared fare math                                                   */
/* ------------------------------------------------------------------ */
type Fare = {
  base: number;
  distanceKm: number;
  perKmRate: number;
  distanceFare: number;
  waiting: number;
  tax: number;
  total: number;
};

function computeFare(data: PreviewProps["data"]): Fare {
  const base = num(str(data, "baseFare"));
  const distanceKm = num(str(data, "distanceKm"));
  const perKmRate = num(str(data, "perKmRate"));
  const distanceFare = distanceKm * perKmRate;
  const waiting = num(str(data, "waitingCharge"));
  const tax = num(str(data, "tax"));
  const total = base + distanceFare + waiting + tax;
  return { base, distanceKm, perKmRate, distanceFare, waiting, tax, total };
}

/* ================================================================== */
/* component                                                          */
/* ================================================================== */
export default function CabBillPreview(props: PreviewProps) {
  switch (props.template) {
    case "template-2":
      return <TaxInvoice {...props} />;
    case "template-1":
    default:
      return <ThermalSlip {...props} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — Thermal Slip (monospace ~360px)                       */
/* ================================================================== */
function ThermalSlip(props: PreviewProps) {
  const { data, theme, crumpled, currency } = props;
  const t = themeById(theme);

  const companyName = str(data, "companyName");
  const driverName = str(data, "driverName");
  const vehicleNo = str(data, "vehicleNo");
  const pickup = str(data, "pickup");
  const drop = str(data, "drop");
  const distanceKm = str(data, "distanceKm");
  const durationMin = str(data, "durationMin");
  const date = str(data, "date");
  const time = str(data, "time");
  const paymentMethod = str(data, "paymentMethod");
  const invoiceNo = str(data, "invoiceNo");
  const f = computeFare(data);

  const rule = (ch: string) => (
    <div style={{ color: t.muted, overflow: "hidden", whiteSpace: "nowrap", margin: "8px 0", letterSpacing: 1 }}>
      {ch.repeat(40)}
    </div>
  );

  const L = (k: string, v: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, lineHeight: 1.8 }}>
      <span style={{ color: t.muted, whiteSpace: "nowrap" }}>{k}</span>
      <span style={{ color: t.ink, textAlign: "right", maxWidth: "60%", wordBreak: "break-word" }}>{v || "-"}</span>
    </div>
  );

  return (
    <div
      style={{
        width: 360,
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
        <div style={{ fontSize: 22, marginBottom: 2 }} aria-hidden>
          {"🚕"}
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
          {(companyName || "CITY CABS").toUpperCase()}
        </div>
        <div style={{ color: t.muted, fontSize: 11, marginTop: 2 }}>Local Taxi Trip Receipt</div>
      </div>

      {rule("=")}
      <div style={{ textAlign: "center", fontWeight: 800, letterSpacing: 3 }}>TRIP RECEIPT</div>
      {rule("=")}

      {/* trip meta */}
      {L("Invoice No:", invoiceNo)}
      {L("Date:", fmtDMonY(date))}
      {L("Time:", time)}
      {L("Driver:", driverName)}
      {L("Vehicle:", vehicleNo)}

      {rule("-")}

      {/* route */}
      <div style={{ lineHeight: 1.75 }}>
        <div style={{ color: t.muted }}>FROM:</div>
        <div style={{ color: t.ink, marginBottom: 6 }}>{pickup || "-"}</div>
        <div style={{ color: t.muted }}>TO:</div>
        <div style={{ color: t.ink }}>{drop || "-"}</div>
      </div>

      {rule("-")}

      {L("Distance:", distanceKm ? `${distanceKm} km` : "")}
      {L("Duration:", durationMin ? `${durationMin} min` : "")}

      {rule("-")}

      {/* fare breakup */}
      <div style={{ textAlign: "center", fontWeight: 800, letterSpacing: 2, marginBottom: 2 }}>FARE BREAKUP</div>
      {L("Base Fare:", money(f.base, currency))}
      {L(
        distanceKm && f.perKmRate ? `Distance (${distanceKm}km x ${plain(f.perKmRate, currency)}):` : "Distance Fare:",
        plain(f.distanceFare, currency)
      )}
      {L("Waiting Charge:", money(f.waiting, currency))}
      {L("Tax (GST):", money(f.tax, currency))}

      {rule("=")}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
        <span>TOTAL</span>
        <span>{plain(f.total, currency)}</span>
      </div>
      {rule("=")}

      {L("Paid via:", paymentMethod)}

      {/* footer */}
      <div style={{ textAlign: "center", marginTop: 22, lineHeight: 1.7, fontWeight: 700 }}>
        <div>THANK YOU FOR RIDING WITH US</div>
        <div style={{ color: t.muted, fontSize: 11 }}>HAVE A SAFE JOURNEY !</div>
        <div style={{ color: t.muted, fontSize: 11, marginTop: 6 }}>*** CUSTOMER COPY ***</div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Tax Invoice (table ~640px)                            */
/* ================================================================== */
function TaxInvoice(props: PreviewProps) {
  const { data, theme, crumpled, currency } = props;
  const t = themeById(theme);

  const companyName = str(data, "companyName");
  const driverName = str(data, "driverName");
  const vehicleNo = str(data, "vehicleNo");
  const pickup = str(data, "pickup");
  const drop = str(data, "drop");
  const distanceKm = str(data, "distanceKm");
  const durationMin = str(data, "durationMin");
  const date = str(data, "date");
  const time = str(data, "time");
  const paymentMethod = str(data, "paymentMethod");
  const invoiceNo = str(data, "invoiceNo");
  const f = computeFare(data);

  const th: React.CSSProperties = {
    padding: "7px 10px",
    border: "1px solid rgba(0,0,0,0.15)",
    fontWeight: 700,
  };
  const td: React.CSSProperties = {
    padding: "8px 10px",
    border: `1px solid ${t.muted}`,
    color: t.ink,
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
      {/* title bar */}
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: t.accent }}>TAX INVOICE</div>
      </div>

      {/* operator + meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: t.ink }}>{companyName || "City Cabs"}</div>
          <div style={{ color: t.muted, marginTop: 2 }}>Radio Taxi &amp; Cab Services</div>
          {driverName ? <div style={{ color: t.muted }}>Driver: {driverName}</div> : null}
          {vehicleNo ? <div style={{ color: t.muted }}>Vehicle: {vehicleNo}</div> : null}
          <div style={{ color: t.muted }}>GSTIN: 29ABCDE1234F1Z5</div>
        </div>
        <div style={{ textAlign: "right", color: t.ink, lineHeight: 1.7 }}>
          <META k="Invoice No:" v={invoiceNo} />
          <META k="Date:" v={fmtDMY(date)} />
          <META k="Time:" v={time} />
          <META k="Payment:" v={paymentMethod} />
        </div>
      </div>

      {/* trip route box */}
      <div style={{ border: `1px solid ${t.muted}`, padding: "10px 12px", marginBottom: 14, lineHeight: 1.7 }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <span style={{ color: t.muted, fontWeight: 700 }}>Pickup: </span>
            <span style={{ color: t.ink }}>{pickup || "-"}</span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <span style={{ color: t.muted, fontWeight: 700 }}>Drop: </span>
            <span style={{ color: t.ink }}>{drop || "-"}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 6 }}>
          <div>
            <span style={{ color: t.muted, fontWeight: 700 }}>Distance: </span>
            <span style={{ color: t.ink }}>{distanceKm ? `${distanceKm} km` : "-"}</span>
          </div>
          <div>
            <span style={{ color: t.muted, fontWeight: 700 }}>Duration: </span>
            <span style={{ color: t.ink }}>{durationMin ? `${durationMin} min` : "-"}</span>
          </div>
        </div>
      </div>

      {/* fare line-item table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ ...th, textAlign: "left" }}>#</th>
            <th style={{ ...th, textAlign: "left" }}>Particulars</th>
            <th style={{ ...th, textAlign: "center" }}>Qty / Detail</th>
            <th style={{ ...th, textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...td, textAlign: "center" }}>1</td>
            <td style={td}>Base Fare</td>
            <td style={{ ...td, textAlign: "center" }}>Flag-down</td>
            <td style={{ ...td, textAlign: "right" }}>{money(f.base, currency)}</td>
          </tr>
          <tr>
            <td style={{ ...td, textAlign: "center" }}>2</td>
            <td style={td}>Distance Fare</td>
            <td style={{ ...td, textAlign: "center" }}>
              {distanceKm || "0"} km {f.perKmRate ? `x ${plain(f.perKmRate, currency)}` : ""}
            </td>
            <td style={{ ...td, textAlign: "right" }}>{plain(f.distanceFare, currency)}</td>
          </tr>
          <tr>
            <td style={{ ...td, textAlign: "center" }}>3</td>
            <td style={td}>Waiting Charge</td>
            <td style={{ ...td, textAlign: "center" }}>{durationMin ? `${durationMin} min` : "-"}</td>
            <td style={{ ...td, textAlign: "right" }}>{money(f.waiting, currency)}</td>
          </tr>
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div style={{ width: 300 }}>
          <TotRow k="Subtotal" v={plain(f.base + f.distanceFare + f.waiting, currency)} />
          <TotRow k="Tax (GST 5%)" v={money(f.tax, currency)} />
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
            <span>TOTAL FARE</span>
            <span>{plain(f.total, currency)}</span>
          </div>
          <div style={{ textAlign: "right", color: t.muted, fontSize: 10, marginTop: 4 }}>(incl. all taxes)</div>
        </div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 340, lineHeight: 1.5 }}>
          Fare computed as Base Fare + (Distance x Rate/km) + Waiting Charge + applicable tax. E. &amp; O.E. This is a
          system generated tax invoice and does not require a physical signature.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 160, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            For {companyName || "City Cabs"}
          </div>
        </div>
      </div>
    </div>
  );
}
