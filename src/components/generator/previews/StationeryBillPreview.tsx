import type { CSSProperties } from "react";
import { PreviewProps } from "@/types/generator";
import { themeById } from "@/lib/themes";
import { str, num, money, plain, fmtDMonY, fmtDMY, parseItems, paperStyle } from "./shared";

/* ------------------------------------------------------------------ */
/* shared view-model                                                  */
/* ------------------------------------------------------------------ */

type Row = { name: string; qty: number; rate: number; amount: number };

type SV = {
  t: ReturnType<typeof themeById>;
  currency: string;
  shopName: string;
  address: string;
  gstin: string;
  billNo: string;
  date: string;
  rows: Row[];
  totalQty: number;
  subtotal: number;
  gstPct: number;
  gst: number;
  cgst: number;
  sgst: number;
  total: number;
  paymentMethod: string;
};

export default function StationeryBillPreview(props: PreviewProps) {
  const { data, theme, template, currency } = props;
  const t = themeById(theme);

  const rows: Row[] = parseItems(data.items).map((r) => {
    const qty = num(r.qty);
    const rate = num(r.rate);
    return { name: r.name ?? "", qty, rate, amount: qty * rate };
  });

  const subtotal = rows.reduce((s, r) => s + r.amount, 0);
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const gstPct = num(str(data, "gstPct"));
  const gst = +(subtotal * (gstPct / 100)).toFixed(2);
  const cgst = +(gst / 2).toFixed(2);
  const sgst = +(gst - cgst).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  const v: SV = {
    t,
    currency,
    shopName: str(data, "shopName"),
    address: str(data, "address"),
    gstin: str(data, "gstin"),
    billNo: str(data, "billNo"),
    date: str(data, "date"),
    rows,
    totalQty,
    subtotal,
    gstPct,
    gst,
    cgst,
    sgst,
    total,
    paymentMethod: str(data, "paymentMethod"),
  };

  switch (template) {
    case "template-2":
      return <GstInvoice {...v} />;
    case "template-1":
    default:
      return <CashBill {...v} />;
  }
}

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

/* ================================================================== */
/* TEMPLATE 1 — Cash Bill (clean retail counter bill, ~640px)         */
/* ================================================================== */

function CashBill(p: SV) {
  const { t } = p;
  const f = (n: number) => plain(n, p.currency);

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 13,
        padding: "30px 34px 26px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        border: "1px solid rgba(0,0,0,0.08)",
        ...paperStyle(t, false),
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center", borderBottom: `2px solid ${t.accent}`, paddingBottom: 14 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 0.5, color: t.accent }}>
          {p.shopName || "Stationery Shop"}
        </div>
        {p.address ? (
          <div style={{ color: t.muted, marginTop: 5, lineHeight: 1.5, maxWidth: 480, margin: "5px auto 0" }}>
            {p.address}
          </div>
        ) : null}
        {p.gstin ? (
          <div style={{ color: t.ink, marginTop: 6, fontSize: 12 }}>
            GSTIN: <strong>{p.gstin}</strong>
          </div>
        ) : null}
      </div>

      {/* CASH BILL banner */}
      <div style={{ textAlign: "center", margin: "12px 0 4px" }}>
        <span
          style={{
            display: "inline-block",
            border: `1px solid ${t.muted}`,
            borderRadius: 4,
            padding: "3px 18px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            color: t.ink,
          }}
        >
          CASH BILL
        </span>
      </div>

      {/* meta row */}
      <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0 16px", fontSize: 12.5 }}>
        <div>
          <span style={{ color: t.muted }}>Bill No: </span>
          <strong>{p.billNo || "—"}</strong>
        </div>
        <div>
          <span style={{ color: t.muted }}>Date: </span>
          <strong>{p.date ? fmtDMonY(p.date) : "—"}</strong>
        </div>
      </div>

      {/* items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={cellH(48, "center")}>S.No</th>
            <th style={cellH(undefined, "left")}>Particulars</th>
            <th style={cellH(70, "center")}>Qty</th>
            <th style={cellH(110, "right")}>Rate</th>
            <th style={cellH(120, "right")}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {p.rows.length ? (
            p.rows.map((r, i) => (
              <tr key={i}>
                <td style={cell(t.muted, "center")}>{i + 1}</td>
                <td style={cell(t.muted, "left", t.ink)}>{r.name || "—"}</td>
                <td style={cell(t.muted, "center", t.ink)}>{r.qty}</td>
                <td style={cell(t.muted, "right", t.ink)}>{f(r.rate)}</td>
                <td style={cell(t.muted, "right", t.ink)}>{f(r.amount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={cell(t.muted, "center")} colSpan={5}>
                No items added
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* totals + payment */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, gap: 24 }}>
        <div style={{ alignSelf: "flex-end", fontSize: 12.5 }}>
          <div style={{ color: t.muted }}>
            Total Items: <strong style={{ color: t.ink }}>{p.rows.length}</strong> &nbsp;|&nbsp; Total Qty:{" "}
            <strong style={{ color: t.ink }}>{p.totalQty}</strong>
          </div>
          <div style={{ color: t.muted, marginTop: 6 }}>
            Payment Mode: <strong style={{ color: t.ink }}>{p.paymentMethod || "—"}</strong>
          </div>
        </div>
        <div style={{ width: 280 }}>
          <Row3 label="Sub Total" value={f(p.subtotal)} ink={t.ink} muted={t.muted} />
          <Row3 label={`GST @ ${p.gstPct}%`} value={f(p.gst)} ink={t.ink} muted={t.muted} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: t.accent,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 15,
              borderRadius: 5,
              marginTop: 8,
            }}
          >
            <span>Grand Total</span>
            <span>{money(p.total, p.currency)}</span>
          </div>
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          borderTop: `1px dashed ${t.muted}`,
          marginTop: 24,
          paddingTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          color: t.muted,
          fontSize: 11,
        }}
      >
        <div style={{ lineHeight: 1.6 }}>
          Goods once sold will not be taken back.
          <br />
          Thank you, please visit again!
        </div>
        <div style={{ textAlign: "center", color: t.ink }}>
          <div style={{ borderTop: `1px solid ${t.muted}`, width: 150, paddingTop: 4 }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — GST Tax Invoice (formal, boxed, CGST/SGST, ~640px)    */
/* ================================================================== */

function GstInvoice(p: SV) {
  const { t } = p;
  const f = (n: number) => plain(n, p.currency);
  const half = +(p.gstPct / 2).toFixed(2);

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        padding: 0,
        boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        border: `1px solid ${t.ink}`,
        overflow: "hidden",
        ...paperStyle(t, false),
      }}
    >
      {/* title strip */}
      <div
        style={{
          textAlign: "center",
          background: t.accent,
          color: "#ffffff",
          padding: "7px 0",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 3,
        }}
      >
        TAX INVOICE
      </div>

      {/* shop header */}
      <div style={{ padding: "16px 22px 12px", borderBottom: `1px solid ${t.ink}`, textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.accent }}>{p.shopName || "Stationery Shop"}</div>
        {p.address ? (
          <div style={{ color: t.muted, marginTop: 4, lineHeight: 1.5, maxWidth: 460, margin: "4px auto 0" }}>
            {p.address}
          </div>
        ) : null}
        {p.gstin ? (
          <div style={{ color: t.ink, marginTop: 6, fontSize: 12 }}>
            GSTIN / UIN: <strong>{p.gstin}</strong>
          </div>
        ) : null}
      </div>

      {/* invoice meta (boxed) */}
      <div style={{ display: "flex", borderBottom: `1px solid ${t.ink}` }}>
        <div style={{ flex: 1, padding: "9px 22px", borderRight: `1px solid ${t.ink}` }}>
          <span style={{ color: t.muted }}>Invoice No.</span>
          <div style={{ fontWeight: 700, marginTop: 2 }}>{p.billNo || "—"}</div>
        </div>
        <div style={{ flex: 1, padding: "9px 22px", borderRight: `1px solid ${t.ink}` }}>
          <span style={{ color: t.muted }}>Invoice Date</span>
          <div style={{ fontWeight: 700, marginTop: 2 }}>{p.date ? fmtDMY(p.date) : "—"}</div>
        </div>
        <div style={{ flex: 1, padding: "9px 22px" }}>
          <span style={{ color: t.muted }}>Payment</span>
          <div style={{ fontWeight: 700, marginTop: 2 }}>{p.paymentMethod || "—"}</div>
        </div>
      </div>

      {/* items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={cellH(40, "center")}>#</th>
            <th style={cellH(undefined, "left")}>Description of Goods</th>
            <th style={cellH(60, "center")}>Qty</th>
            <th style={cellH(100, "right")}>Rate</th>
            <th style={cellH(110, "right")}>Taxable Value</th>
          </tr>
        </thead>
        <tbody>
          {p.rows.length ? (
            p.rows.map((r, i) => (
              <tr key={i}>
                <td style={cell(t.ink, "center")}>{i + 1}</td>
                <td style={cell(t.ink, "left")}>{r.name || "—"}</td>
                <td style={cell(t.ink, "center")}>{r.qty}</td>
                <td style={cell(t.ink, "right")}>{f(r.rate)}</td>
                <td style={cell(t.ink, "right")}>{f(r.amount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={cell(t.ink, "center")} colSpan={5}>
                No items added
              </td>
            </tr>
          )}
          <tr>
            <td style={{ ...cell(t.ink, "right"), fontWeight: 700 }} colSpan={2}>
              Total
            </td>
            <td style={{ ...cell(t.ink, "center"), fontWeight: 700 }}>{p.totalQty}</td>
            <td style={cell(t.ink, "right")} />
            <td style={{ ...cell(t.ink, "right"), fontWeight: 700 }}>{f(p.subtotal)}</td>
          </tr>
        </tbody>
      </table>

      {/* tax summary block */}
      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${t.ink}` }}>
        <div style={{ width: 320, padding: "8px 22px 14px" }}>
          <Row3 label="Taxable Value" value={f(p.subtotal)} ink={t.ink} muted={t.muted} />
          <Row3 label={`CGST @ ${half}%`} value={f(p.cgst)} ink={t.ink} muted={t.muted} />
          <Row3 label={`SGST @ ${half}%`} value={f(p.sgst)} ink={t.ink} muted={t.muted} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0 0",
              marginTop: 6,
              borderTop: `1px solid ${t.ink}`,
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            <span>Total</span>
            <span>{money(p.total, p.currency)}</span>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${t.ink}`, padding: "12px 22px 18px" }}>
        <div style={{ color: t.muted, fontSize: 10.5, lineHeight: 1.6, maxWidth: 340 }}>
          <strong style={{ color: t.ink }}>Declaration:</strong> We declare that this invoice shows the actual price of
          the goods described and that all particulars are true and correct.
        </div>
        <div style={{ textAlign: "center", color: t.ink, alignSelf: "flex-end" }}>
          <div style={{ fontSize: 11, marginBottom: 28 }}>For {p.shopName || "Stationery Shop"}</div>
          <div style={{ borderTop: `1px solid ${t.ink}`, paddingTop: 4, fontSize: 11 }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* small helpers                                                      */
/* ------------------------------------------------------------------ */

function cellH(width: number | undefined, align: "left" | "center" | "right"): CSSProperties {
  return {
    textAlign: align,
    padding: "8px 10px",
    border: "1px solid rgba(0,0,0,0.18)",
    width,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };
}

function cell(border: string, align: "left" | "center" | "right", ink?: string): CSSProperties {
  return {
    padding: "8px 10px",
    border: `1px solid ${border}`,
    textAlign: align,
    color: ink ?? border,
  };
}

function Row3({ label, value, ink, muted }: { label: string; value: string; ink: string; muted: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: muted, fontSize: 12.5 }}>
      <span>{label}</span>
      <span style={{ color: ink }}>{value}</span>
    </div>
  );
}
