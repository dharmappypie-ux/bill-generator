import { PreviewProps } from "@/types/generator";
import { themeById } from "@/lib/themes";
import { formatMoney, symbolFor } from "@/lib/currencies";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function str(data: PreviewProps["data"], key: string): string {
  const v = data[key];
  if (v === undefined || v === null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "";
  return String(v);
}

function bool(data: PreviewProps["data"], key: string): boolean {
  return data[key] === true || data[key] === "true";
}

function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/** litres = amount / rate, guarded against divide-by-zero */
function computeVolume(amount: string, rate: string): string {
  const r = num(rate);
  const a = num(amount);
  if (r <= 0 || a <= 0) return "";
  return (a / r).toFixed(2);
}

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDMonY(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]} ${MONTHS[+m[2]] || m[2]} ${m[1]}` : iso;
}
function fmtDMY(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : iso;
}

/** Money with the currency symbol; returns just the symbol when empty. */
function money(v: string, sym: string): string {
  if (!v) return sym;
  const n = parseFloat(v);
  if (!Number.isFinite(n)) return `${sym}${v}`;
  return `${sym}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Receipt "paper". When the Crumpled-paper effect is on we print the receipt on
 * the selected crumpled-paper photo (Theme N); otherwise a clean white sheet.
 * Spread AFTER the base style so it wins the `background`/`backgroundImage`.
 */
function paperStyle(t: ReturnType<typeof themeById>, crumpled: boolean): React.CSSProperties {
  if (crumpled) {
    return {
      background: "none",
      backgroundImage: `url('${t.image}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#f4efe6",
      boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
    };
  }
  return { background: "#ffffff" };
}

/* ------------------------------------------------------------------ */
/* brand-specific copy (welcome line + footer), keyed by logo id      */
/* ------------------------------------------------------------------ */

type Brand = { name: string; welcome: string; footer: string[]; app: string; tagline: string };
const BRANDS: Record<string, Brand> = {
  iocl: {
    name: "IndianOil",
    welcome: "WELCOME!!!",
    footer: [
      "SAVE FUEL YAANI SAVE MONEY !!",
      "THANKS FOR FUELLING WITH US.",
      "YOU CAN NOW CALL US ON 1800",
      "226344 (TOLL-FREE) FOR",
      "QUERIES/COMPLAINTS.",
    ],
    app: 'DOWNLOAD "INDIANOIL ONE" APP',
    tagline: "Mission LiFE... Environment Protection",
  },
  bpcl: {
    name: "Bharat Petroleum",
    welcome: "WELCOME TO Bharat Petroleum",
    footer: ['DOWNLOAD "HELLO BPCL"', "APP FOR SEAMLESS FUELING", "THANK YOU FOR VISIT"],
    app: 'DOWNLOAD "HELLO BPCL" APP',
    tagline: "Pure for Sure",
  },
  hpcl: {
    name: "HP",
    welcome: "WELCOME TO HP",
    footer: ["THANK YOU FOR FUELLING WITH HP", "HAPPY JOURNEY !", "FOR QUERIES CALL 1800 2333 555"],
    app: 'DOWNLOAD "HP PAY" APP',
    tagline: "Energising Lives",
  },
  essar: {
    name: "Nayara Energy",
    welcome: "WELCOME",
    footer: ["THANK YOU FOR FUELLING WITH US", "VISIT AGAIN !"],
    app: "DOWNLOAD THE NAYARA APP",
    tagline: "Driven by Energy",
  },
};
function brandOf(logo: string): Brand {
  return (
    BRANDS[logo] ?? {
      name: "FUEL STATION",
      welcome: "WELCOME",
      footer: ["THANK YOU - VISIT AGAIN"],
      app: "",
      tagline: "",
    }
  );
}

/** Brand logo (guarded). `mono` renders grayscale for thermal receipts. */
function BrandLogo({ logo, width = 104, mono = false }: { logo: string; width?: number; mono?: boolean }) {
  if (!logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brands/${logo}.svg`}
      alt={logo}
      style={{
        width,
        height: "auto",
        display: "block",
        margin: "0 auto",
        ...(mono ? { filter: "grayscale(1) contrast(1.05)" } : {}),
      }}
    />
  );
}

/* small line renderers ------------------------------------------------ */

/** Left-aligned "LABEL: value" line (thermal). */
function LineL({ label, value, color }: { label: string; value: string; color: string }) {
  return <div style={{ color, lineHeight: 1.75 }}>{value ? `${label} ${value}` : `${label} `}</div>;
}

/** Label left, value right-aligned (two-column thermal). */
function LineR({ label, value, ink, muted }: { label: string; value: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, lineHeight: 1.7 }}>
      <span style={{ color: muted, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ color: ink, textAlign: "right", maxWidth: "58%" }}>{value}</span>
    </div>
  );
}

const Gap = ({ h = 14 }: { h?: number }) => <div style={{ height: h }} />;

function ThermalFooter({ lines, color }: { lines: string[]; color: string }) {
  return (
    <div style={{ textAlign: "center", marginTop: 26, lineHeight: 1.65, fontWeight: 700, color }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}

/* ================================================================== */
/* component                                                          */
/* ================================================================== */

export default function FuelBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const logo = str(data, "logo");
  const stationName = str(data, "stationName");
  const stationAddress = str(data, "stationAddress");
  const rate = str(data, "rate");
  const amount = str(data, "amount");
  const date = str(data, "date");
  const time = str(data, "time");
  const bayNo = str(data, "bayNo");
  const nozzleNo = str(data, "nozzleNo");
  const mobile = str(data, "mobile");
  const density = str(data, "density");
  const dealerName = str(data, "dealerName");
  const telNo = str(data, "telNo");
  const fipNo = str(data, "fipNo");
  const fccId = str(data, "fccId");
  const transactionId = str(data, "transactionId");
  const attendantId = str(data, "attendantId");
  const customerName = str(data, "customerName");
  const vehicleNo = str(data, "vehicleNo");
  const vehicleType = str(data, "vehicleType");
  const receiptType = str(data, "receiptType");
  const txnStart = str(data, "txnStart");
  const txnEnd = str(data, "txnEnd");
  const presetType = str(data, "presetType");
  const paymentMethod = str(data, "paymentMethod");
  const invoiceNo = str(data, "invoiceNo");
  const showBankImage = bool(data, "showBankImage");

  const volume = computeVolume(amount, rate);
  const sym = symbolFor(currency);
  const b = brandOf(logo);

  const shared: Shared = {
    t, currency, crumpled, logo, b, sym, stationName, stationAddress, rate, amount, date, time,
    bayNo, nozzleNo, mobile, density, dealerName, telNo, fipNo, fccId, transactionId, attendantId,
    customerName, vehicleNo, vehicleType, receiptType, txnStart, txnEnd, presetType, paymentMethod,
    invoiceNo, showBankImage, volume,
  };

  switch (template) {
    case "template-2":
      return <CompactSlip {...shared} />;
    case "template-3":
      return <WelcomeRight {...shared} />;
    case "template-4":
      return <OriginalModern {...shared} />;
    case "template-5":
      return <DotMatrix {...shared} />;
    case "template-6":
      return <TaxInvoice {...shared} />;
    case "template-1":
    default:
      return <ClassicReceipt {...shared} />;
  }
}

type Shared = {
  t: ReturnType<typeof themeById>;
  currency: string;
  crumpled: boolean;
  logo: string;
  b: Brand;
  sym: string;
  stationName: string;
  stationAddress: string;
  rate: string;
  amount: string;
  date: string;
  time: string;
  bayNo: string;
  nozzleNo: string;
  mobile: string;
  density: string;
  dealerName: string;
  telNo: string;
  fipNo: string;
  fccId: string;
  transactionId: string;
  attendantId: string;
  customerName: string;
  vehicleNo: string;
  vehicleType: string;
  receiptType: string;
  txnStart: string;
  txnEnd: string;
  presetType: string;
  paymentMethod: string;
  invoiceNo: string;
  showBankImage: boolean;
  volume: string;
};

const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";

/* ================================================================== */
/* TEMPLATE 1 — Classic thermal "WELCOME!!!" (IndianOil style)        */
/* ================================================================== */

function ClassicReceipt(p: Shared) {
  const { t, b } = p;
  return (
    <div
      style={{
        width: 400,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 13,
        padding: "26px 30px 24px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {p.logo ? <BrandLogo logo={p.logo} width={84} mono /> : null}
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 15, marginTop: 6 }}>{b.name}</div>
      {p.stationName ? <div style={{ textAlign: "center", fontSize: 11, color: t.muted }}>{p.stationName}</div> : null}
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 17, letterSpacing: 2, margin: "18px 0" }}>
        {b.welcome}
      </div>
      <Gap h={18} />

      <LineL label="Tel. No.:" value={p.telNo} color={t.ink} />
      <LineL label="Receipt Number:" value={p.invoiceNo} color={t.ink} />
      <LineL label="FCC ID:" value={p.fccId} color={t.ink} />
      <LineL label="FIP No.:" value={p.fipNo} color={t.ink} />
      <LineL label="Nozzle No.:" value={p.nozzleNo} color={t.ink} />
      <Gap />

      <LineL label="PRODUCT:" value={p.vehicleType} color={t.ink} />
      <LineL label="RATE/LTR:" value={money(p.rate, p.sym)} color={t.ink} />
      <LineL label="AMOUNT:" value={money(p.amount, p.sym)} color={t.ink} />
      <LineL label="VOLUME(LTR.):" value={`${p.volume} lt`.trim()} color={t.ink} />
      <Gap />

      <LineL label="VEH TYPE:" value={p.receiptType} color={t.ink} />
      <LineL label="VEH NO:" value={p.vehicleNo} color={t.ink} />
      <LineL label="CUSTOMER NAME:" value={p.customerName} color={t.ink} />
      <Gap />

      <LineL label="Date:" value={fmtDMonY(p.date)} color={t.ink} />
      <LineL label="Time:" value={p.time} color={t.ink} />
      <LineL label="MODE:" value={p.paymentMethod} color={t.ink} />
      <LineL label="LST No.:" value={p.fipNo ? `LST/${p.fipNo}` : ""} color={t.ink} />
      <LineL label="VAT No.:" value={p.fccId ? `VAT/${p.fccId.slice(-6)}` : ""} color={t.ink} />
      <LineL label="ATTENDENT ID:" value={p.attendantId || "Not Available"} color={t.ink} />

      <ThermalFooter lines={b.footer} color={t.ink} />
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Compact thermal "WELCOME!!!" (subset)                 */
/* ================================================================== */

function CompactSlip(p: Shared) {
  const { t, b } = p;
  return (
    <div
      style={{
        width: 360,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 13,
        padding: "24px 26px 22px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {p.logo ? <BrandLogo logo={p.logo} width={78} mono /> : null}
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 14, marginTop: 6 }}>{b.name}</div>
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 16, letterSpacing: 2, margin: "16px 0" }}>
        {b.welcome}
      </div>
      <Gap h={16} />

      <LineL label="Receipt Number:" value={p.invoiceNo} color={t.ink} />
      <Gap />
      <LineL label="PRODUCT:" value={p.vehicleType} color={t.ink} />
      <LineL label="RATE/LTR:" value={money(p.rate, p.sym)} color={t.ink} />
      <LineL label="AMOUNT:" value={money(p.amount, p.sym)} color={t.ink} />
      <LineL label="VOLUME(LTR.):" value={`${p.volume} lt`.trim()} color={t.ink} />
      <Gap />
      <LineL label="VEH TYPE:" value={p.receiptType} color={t.ink} />
      <LineL label="VEH NO:" value={p.vehicleNo} color={t.ink} />
      <LineL label="CUSTOMER NAME:" value={p.customerName} color={t.ink} />
      <Gap />
      <LineL label="Date:" value={fmtDMonY(p.date)} color={t.ink} />
      <LineL label="Time:" value={p.time} color={t.ink} />
      <LineL label="MODE:" value={p.paymentMethod} color={t.ink} />

      <ThermalFooter lines={b.footer} color={t.ink} />
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 3 — "WELCOME TO <brand>" right-aligned two-column          */
/* ================================================================== */

function WelcomeRight(p: Shared) {
  const { t, b } = p;
  const txSt = [fmtDMY(p.date), p.txnStart].filter(Boolean).join(" ");
  const txEnd = [fmtDMY(p.date), p.txnEnd].filter(Boolean).join(" ");
  const amt = p.amount ? num(p.amount).toFixed(2) : ".00";
  return (
    <div
      style={{
        width: 380,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 13,
        padding: "24px 26px 22px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {p.logo ? <BrandLogo logo={p.logo} width={80} mono /> : null}
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 14, marginTop: 6 }}>{b.name}</div>
      <div style={{ textAlign: "center", fontWeight: 800, fontSize: 15, margin: "14px 0 18px" }}>
        WELCOME TO {b.name}
      </div>

      <LineR label="Date:" value={fmtDMY(p.date)} ink={t.ink} muted={t.muted} />
      <LineR label="Time:" value={p.time} ink={t.ink} muted={t.muted} />
      <LineR label="BayNo:" value={p.bayNo} ink={t.ink} muted={t.muted} />
      <LineR label="NozzleNo:" value={p.nozzleNo} ink={t.ink} muted={t.muted} />
      <LineR label="Product:" value={p.vehicleType} ink={t.ink} muted={t.muted} />
      <LineR label="PayMode:" value={p.paymentMethod} ink={t.ink} muted={t.muted} />
      <LineR label="Txn Id:" value={p.transactionId} ink={t.ink} muted={t.muted} />
      <LineR label="Attendant:" value={p.attendantId} ink={t.ink} muted={t.muted} />
      <LineR label="TxSt:" value={txSt} ink={t.ink} muted={t.muted} />
      <LineR label="TxEnd:" value={txEnd} ink={t.ink} muted={t.muted} />
      <LineR label="Rate/Ltr.:" value={p.rate ? money(p.rate, p.sym) : ""} ink={t.ink} muted={t.muted} />
      <LineR label="Volume(Ltr.):" value={`${p.volume} lt`.trim()} ink={t.ink} muted={t.muted} />
      <LineR label="Amount(Rs.):" value={amt} ink={t.ink} muted={t.muted} />
      <LineR label="PresetType:" value={p.presetType} ink={t.ink} muted={t.muted} />
      <LineR label="PresetValue:" value={amt} ink={t.ink} muted={t.muted} />
      <LineR label="VechNo:" value={p.vehicleNo} ink={t.ink} muted={t.muted} />
      <LineR label="MobileNo:" value={p.mobile} ink={t.ink} muted={t.muted} />

      <div style={{ textAlign: "center", marginTop: 18, lineHeight: 1.6, fontWeight: 700 }}>
        {b.app ? <div>{b.app}</div> : null}
        <div>THANK YOU FOR VISIT</div>
        {p.telNo ? <div>TEL: {p.telNo}</div> : null}
      </div>
      {b.tagline ? <div style={{ marginTop: 12, lineHeight: 1.5 }}>{b.tagline}</div> : null}
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 4 — "ORIGINAL" clean bold sans-serif invoice              */
/* ================================================================== */

function OriginalModern(p: Shared) {
  const { t } = p;
  const big = (label: string, value: string) => (
    <div style={{ display: "flex", gap: 14, lineHeight: 1, padding: "9px 0" }}>
      <div style={{ width: "44%", fontWeight: 800, color: t.ink, fontSize: 17 }}>{label}</div>
      <div style={{ flex: 1, color: t.ink, fontSize: 17 }}>{value}</div>
    </div>
  );
  return (
    <div
      style={{
        width: 480,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, Helvetica, sans-serif",
        padding: "28px 30px 26px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {p.logo ? <BrandLogo logo={p.logo} width={96} /> : null}
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 22, letterSpacing: 1, margin: "14px 0 18px" }}>
        ORIGINAL
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>
        <span>{p.date ? `${fmtDMonY(p.date)} :` : ""}</span>
        <span>{p.time}</span>
      </div>

      {big("INVOICE NO:", p.invoiceNo)}
      {big("VEHICLE NO:", p.vehicleNo)}
      {big("NOZZLE NO:", p.nozzleNo)}
      {big("PRODUCT:", p.vehicleType)}
      {big("DENSITY:", `${p.density} Kg/m3`.trim())}
      {big("RATE:", `${p.rate} INR/Ltr`.trim())}
      {big("VOLUME:", `${p.volume} Ltr`.trim())}
      {big("AMOUNT:", `${p.amount} INR`.trim())}

      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 17, marginTop: 24 }}>Thank you Visit Again !</div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 5 — Dot-Matrix (perforated)                               */
/* ================================================================== */

function Perfs({ side, paper }: { side: "left" | "right"; paper: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width: 14,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: paper,
            border: "1px solid rgba(0,0,0,0.35)",
          }}
        />
      ))}
    </div>
  );
}

function DM({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", letterSpacing: 0.5 }}>
      <span style={{ color: muted }}>{k.toUpperCase()}</span>
      <span style={{ color: ink }}>{(v || "").toUpperCase()}</span>
    </div>
  );
}

function DotMatrix(p: Shared) {
  const { t, b } = p;
  return (
    <div
      style={{
        position: "relative",
        width: 380,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 12.5,
        padding: "20px 32px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
        lineHeight: 1.6,
        ...paperStyle(t, p.crumpled),
      }}
    >
      <Perfs side="left" paper={t.paper} />
      <Perfs side="right" paper={t.paper} />

      {p.logo ? <BrandLogo logo={p.logo} width={76} mono /> : null}
      <div style={{ textAlign: "center", fontWeight: 800, letterSpacing: 2, marginTop: 6 }}>{b.name.toUpperCase()}</div>
      <div style={{ textAlign: "center", color: t.muted, overflow: "hidden", margin: "8px 0" }}>{"=".repeat(40)}</div>
      <div style={{ textAlign: "center", fontWeight: 800, letterSpacing: 3 }}>FUEL SALE SLIP</div>
      <div style={{ textAlign: "center", color: t.muted, overflow: "hidden", margin: "8px 0" }}>{"=".repeat(40)}</div>

      <DM k="Date" v={fmtDMY(p.date)} ink={t.ink} muted={t.muted} />
      <DM k="Time" v={p.time} ink={t.ink} muted={t.muted} />
      <DM k="Bay/Nzl" v={[p.bayNo, p.nozzleNo].filter(Boolean).join("/")} ink={t.ink} muted={t.muted} />
      <DM k="FIP No" v={p.fipNo} ink={t.ink} muted={t.muted} />
      <DM k="FCC Id" v={p.fccId} ink={t.ink} muted={t.muted} />
      <DM k="Attendant" v={p.attendantId} ink={t.ink} muted={t.muted} />
      <DM k="Txn Id" v={p.transactionId} ink={t.ink} muted={t.muted} />
      <div style={{ textAlign: "center", color: t.muted, overflow: "hidden", margin: "8px 0" }}>{"-".repeat(40)}</div>
      <DM k="Product" v={p.vehicleType} ink={t.ink} muted={t.muted} />
      <DM k="Rate/L" v={p.rate ? money(p.rate, p.sym) : ""} ink={t.ink} muted={t.muted} />
      <DM k="Volume" v={`${p.volume} L`.trim()} ink={t.ink} muted={t.muted} />
      <DM k="Density" v={p.density} ink={t.ink} muted={t.muted} />
      <div style={{ textAlign: "center", color: t.muted, overflow: "hidden", margin: "8px 0" }}>{"-".repeat(40)}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}>
        <span>AMOUNT</span>
        <span>{money(p.amount, p.sym)}</span>
      </div>
      <div style={{ textAlign: "center", color: t.muted, overflow: "hidden", margin: "8px 0" }}>{"-".repeat(40)}</div>
      <DM k="Vehicle" v={p.vehicleNo} ink={t.ink} muted={t.muted} />
      <DM k="Payment" v={p.paymentMethod} ink={t.ink} muted={t.muted} />

      <div style={{ textAlign: "center", color: t.muted, overflow: "hidden", margin: "8px 0" }}>{"=".repeat(40)}</div>
      <div style={{ textAlign: "center", letterSpacing: 1 }}>*** CUSTOMER COPY ***</div>
      <div style={{ textAlign: "center", fontSize: 11 }}>{b.footer[0]}</div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 6 — Tax Invoice (GST)                                     */
/* ================================================================== */

function TaxInvoice(p: Shared) {
  const { t, b } = p;
  const gross = num(p.amount);
  const base = gross / 1.18;
  const cgst = base * 0.09;
  const sgst = base * 0.09;
  const f = (n: number) => formatMoney(n, p.currency);

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        background: t.paper,
        color: t.ink,
        fontFamily: "'Product Sans', Montserrat, Arial, Helvetica, sans-serif",
        fontSize: 12,
        padding: 24,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
        ...paperStyle(t, p.crumpled),
      }}
    >
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: t.accent }}>TAX INVOICE</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <BrandLogo logo={p.logo} width={84} />
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: p.logo ? 6 : 0, color: t.ink }}>
            {p.stationName || b.name}
          </div>
          {p.stationAddress ? <div style={{ color: t.muted }}>{p.stationAddress}</div> : null}
          {p.dealerName ? <div style={{ color: t.muted }}>Dealer: {p.dealerName}</div> : null}
          {p.telNo ? <div style={{ color: t.muted }}>Tel: {p.telNo}</div> : null}
        </div>
        <div style={{ textAlign: "right", color: t.ink }}>
          {p.invoiceNo ? <div><span style={{ color: t.muted }}>Invoice No: </span>{p.invoiceNo}</div> : null}
          {p.date ? <div><span style={{ color: t.muted }}>Date: </span>{fmtDMY(p.date)}</div> : null}
          {p.time ? <div><span style={{ color: t.muted }}>Time: </span>{p.time}</div> : null}
          {p.transactionId ? <div><span style={{ color: t.muted }}>Txn: </span>{p.transactionId}</div> : null}
        </div>
      </div>

      {p.customerName || p.vehicleNo ? (
        <div style={{ border: `1px solid ${t.muted}`, padding: "8px 10px", marginBottom: 12, fontSize: 12 }}>
          <span style={{ color: t.muted, fontWeight: 700 }}>Bill To: </span>
          <span style={{ color: t.ink }}>{[p.customerName, p.vehicleNo, p.vehicleType].filter(Boolean).join("  |  ")}</span>
        </div>
      ) : null}

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Description</th>
            <th style={{ textAlign: "center", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>HSN</th>
            <th style={{ textAlign: "right", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Qty (L)</th>
            <th style={{ textAlign: "right", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Rate</th>
            <th style={{ textAlign: "right", padding: "6px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Taxable</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink }}>Motor Fuel</td>
            <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "center" }}>27101990</td>
            <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "right" }}>{p.volume || "0.00"}</td>
            <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "right" }}>{money(p.rate, p.sym)}</td>
            <td style={{ padding: "8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "right" }}>{f(base)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div style={{ width: 280 }}>
          <Row label="Taxable Value" value={f(base)} ink={t.ink} muted={t.muted} />
          <Row label="CGST @ 9%" value={f(cgst)} ink={t.ink} muted={t.muted} />
          <Row label="SGST @ 9%" value={f(sgst)} ink={t.ink} muted={t.muted} />
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
            <span>{money(p.amount, p.sym)}</span>
          </div>
          <div style={{ textAlign: "right", color: t.muted, fontSize: 10, marginTop: 4 }}>(incl. all taxes)</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 320 }}>
          Whether tax is payable under reverse charge: No. E. &amp; O.E. This is a system generated tax invoice.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 150, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            Authorised Signatory
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, ink, muted }: { label: string; value: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px", color: muted }}>
      <span>{label}</span>
      <span style={{ color: ink }}>{value}</span>
    </div>
  );
}
