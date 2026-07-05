import { PreviewProps } from "@/types/generator";
import { str, num, money, plain, fmtDMonY, fmtDMY, parseItems, paperStyle } from "./shared";
import { themeById } from "@/lib/themes";

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";
const MONO = "'Courier New', Courier, monospace";

type Vals = {
  businessName: string;
  address: string;
  phone: string;
  billNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  discount: string;
  taxPct: string;
  paymentMethod: string;
};

type Line = { name: string; qty: number; rate: number; amount: number };

function readVals(data: PreviewProps["data"]): Vals {
  return {
    businessName: str(data, "businessName"),
    address: str(data, "address"),
    phone: str(data, "phone"),
    billNo: str(data, "billNo"),
    date: str(data, "date"),
    customerName: str(data, "customerName"),
    customerPhone: str(data, "customerPhone"),
    discount: str(data, "discount"),
    taxPct: str(data, "taxPct"),
    paymentMethod: str(data, "paymentMethod"),
  };
}

function readLines(data: PreviewProps["data"]): Line[] {
  return parseItems(data.items).map((r) => {
    const qty = num(r.qty);
    const rate = num(r.rate);
    return { name: r.name || "", qty, rate, amount: qty * rate };
  });
}

type Totals = {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  grand: number;
  qtyTotal: number;
};

function computeTotals(lines: Line[], v: Vals): Totals {
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const discount = num(v.discount);
  const taxable = Math.max(subtotal - discount, 0);
  const tax = (taxable * num(v.taxPct)) / 100;
  const grand = taxable + tax;
  const qtyTotal = lines.reduce((s, l) => s + l.qty, 0);
  return { subtotal, discount, taxable, tax, grand, qtyTotal };
}

export default function GeneralBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);
  const v = readVals(data);
  const lines = readLines(data);
  const totals = computeTotals(lines, v);

  if (template === "template-2") {
    return <ThermalSlip t={t} v={v} lines={lines} totals={totals} currency={currency} crumpled={crumpled} />;
  }
  return <BillSheet t={t} v={v} lines={lines} totals={totals} currency={currency} crumpled={crumpled} />;
}

type TplProps = {
  t: ReturnType<typeof themeById>;
  v: Vals;
  lines: Line[];
  totals: Totals;
  currency: string;
  crumpled: boolean;
};

/* ================================================================== */
/* TEMPLATE 1 — Bill (formal A-style sheet, ~600px)                   */
/* ================================================================== */

function BillSheet({ t, v, lines, totals, currency, crumpled }: TplProps) {
  return (
    <div
      style={{
        width: 600,
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
      {/* Accent header */}
      <div
        style={{
          background: t.accent,
          color: "#ffffff",
          padding: "22px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>{v.businessName || "Business Name"}</div>
          {v.address ? (
            <div style={{ fontSize: 11.5, color: "#d8d8da", marginTop: 6, lineHeight: 1.5, maxWidth: 320, whiteSpace: "pre-line" }}>
              {v.address}
            </div>
          ) : null}
          {v.phone ? (
            <div style={{ fontSize: 11.5, color: "#d8d8da", marginTop: 4 }}>Ph: {v.phone}</div>
          ) : null}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#c9c9cc" }}>Bill</div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>{v.billNo || "—"}</div>
          <div style={{ fontSize: 11.5, color: "#d8d8da", marginTop: 4 }}>{fmtDMonY(v.date)}</div>
        </div>
      </div>

      <div style={{ padding: "22px 28px 26px" }}>
        {/* Bill To */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Bill To
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.ink }}>{v.customerName || "—"}</div>
          {v.customerPhone ? (
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>{v.customerPhone}</div>
          ) : null}
        </div>

        {/* Items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: t.accent, color: "#ffffff" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", width: 36 }}>#</th>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>Item</th>
              <th style={{ textAlign: "center", padding: "8px 12px", width: 56 }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px 12px", width: 110 }}>Rate</th>
              <th style={{ textAlign: "right", padding: "8px 12px", width: 120 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "14px 12px", textAlign: "center", color: t.muted, borderBottom: `1px solid ${t.muted}26` }}>
                  No items added
                </td>
              </tr>
            ) : (
              lines.map((l, i) => (
                <tr key={i} style={{ background: i % 2 ? `${t.muted}10` : "transparent" }}>
                  <td style={{ padding: "8px 12px", color: t.muted, borderBottom: `1px solid ${t.muted}26` }}>{i + 1}</td>
                  <td style={{ padding: "8px 12px", color: t.ink, borderBottom: `1px solid ${t.muted}26` }}>{l.name || "—"}</td>
                  <td style={{ padding: "8px 12px", color: t.ink, textAlign: "center", borderBottom: `1px solid ${t.muted}26` }}>{l.qty}</td>
                  <td style={{ padding: "8px 12px", color: t.ink, textAlign: "right", borderBottom: `1px solid ${t.muted}26` }}>{plain(l.rate, currency)}</td>
                  <td style={{ padding: "8px 12px", color: t.ink, textAlign: "right", fontWeight: 600, borderBottom: `1px solid ${t.muted}26` }}>{plain(l.amount, currency)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ width: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", color: t.muted }}>
              <span>Subtotal</span>
              <span style={{ color: t.ink }}>{plain(totals.subtotal, currency)}</span>
            </div>
            {totals.discount > 0 ? (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", color: t.muted }}>
                <span>Discount</span>
                <span style={{ color: t.ink }}>- {plain(totals.discount, currency)}</span>
              </div>
            ) : null}
            {num(v.taxPct) > 0 ? (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", color: t.muted }}>
                <span>Tax ({num(v.taxPct)}%)</span>
                <span style={{ color: t.ink }}>{plain(totals.tax, currency)}</span>
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "11px 14px",
                background: t.accent,
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                borderRadius: 5,
                marginTop: 6,
              }}
            >
              <span>Grand Total</span>
              <span>{plain(totals.grand, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 12 }}>
          <span style={{ color: t.muted }}>Payment Method</span>
          <span style={{ color: t.ink, fontWeight: 600 }}>{v.paymentMethod || "—"}</span>
        </div>

        <div style={{ borderTop: `1px dashed ${t.muted}`, margin: "18px 0 12px" }} />
        <div style={{ textAlign: "center", color: t.muted, fontSize: 11, lineHeight: 1.6 }}>
          Thank you for your business!
          <br />
          This is a computer generated bill and does not require a signature.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Thermal (POS-style slip, ~360px monospace)            */
/* ================================================================== */

function ThermalSlip({ t, v, lines, totals, currency, crumpled }: TplProps) {
  const dash = `1px dashed ${t.ink}`;

  return (
    <div
      style={{
        width: 360,
        margin: "0 auto",
        color: t.ink,
        fontFamily: MONO,
        fontSize: 12.5,
        lineHeight: 1.55,
        padding: "22px 20px 26px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        ...paperStyle(t, crumpled),
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
          {v.businessName || "Business Name"}
        </div>
        {v.address ? (
          <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.45, whiteSpace: "pre-line" }}>{v.address}</div>
        ) : null}
        {v.phone ? <div style={{ fontSize: 11, marginTop: 2 }}>Ph: {v.phone}</div> : null}
      </div>

      <div style={{ borderTop: dash, margin: "10px 0" }} />

      {/* Meta */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Bill No:</span>
        <span>{v.billNo || "—"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Date:</span>
        <span>{fmtDMY(v.date)}</span>
      </div>
      {v.customerName ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Customer:</span>
          <span>{v.customerName}</span>
        </div>
      ) : null}
      {v.customerPhone ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Phone:</span>
          <span>{v.customerPhone}</span>
        </div>
      ) : null}

      <div style={{ borderTop: dash, margin: "10px 0" }} />

      {/* Column header */}
      <div style={{ display: "flex", fontWeight: 700 }}>
        <span style={{ flex: 1 }}>Item</span>
        <span style={{ width: 34, textAlign: "center" }}>Qty</span>
        <span style={{ width: 64, textAlign: "right" }}>Rate</span>
        <span style={{ width: 74, textAlign: "right" }}>Amt</span>
      </div>
      <div style={{ borderTop: dash, margin: "6px 0" }} />

      {/* Items */}
      {lines.length === 0 ? (
        <div style={{ textAlign: "center", padding: "8px 0" }}>-- no items --</div>
      ) : (
        lines.map((l, i) => (
          <div key={i} style={{ display: "flex", padding: "1px 0" }}>
            <span style={{ flex: 1, paddingRight: 6, overflowWrap: "anywhere" }}>{l.name || "—"}</span>
            <span style={{ width: 34, textAlign: "center" }}>{l.qty}</span>
            <span style={{ width: 64, textAlign: "right" }}>{l.rate.toFixed(2)}</span>
            <span style={{ width: 74, textAlign: "right" }}>{l.amount.toFixed(2)}</span>
          </div>
        ))
      )}

      <div style={{ borderTop: dash, margin: "10px 0" }} />

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Items / Qty</span>
        <span>
          {lines.length} / {totals.qtyTotal}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Subtotal</span>
        <span>{money(totals.subtotal, currency)}</span>
      </div>
      {totals.discount > 0 ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Discount</span>
          <span>- {money(totals.discount, currency)}</span>
        </div>
      ) : null}
      {num(v.taxPct) > 0 ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax ({num(v.taxPct)}%)</span>
          <span>{money(totals.tax, currency)}</span>
        </div>
      ) : null}

      <div style={{ borderTop: dash, margin: "8px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
        <span>TOTAL</span>
        <span>{money(totals.grand, currency)}</span>
      </div>
      <div style={{ borderTop: dash, margin: "10px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Paid via</span>
        <span>{v.paymentMethod || "—"}</span>
      </div>

      <div style={{ textAlign: "center", marginTop: 12, fontSize: 11.5, lineHeight: 1.6 }}>
        *** THANK YOU ***
        <br />
        Visit Again!
      </div>
    </div>
  );
}
