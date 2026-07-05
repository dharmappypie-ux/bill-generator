import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  plain,
  fmtDMonY,
  fmtDMY,
  parseItems,
  paperStyle,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared bag                                                         */
/* ------------------------------------------------------------------ */

type Line = { name: string; qty: number; rate: number; amount: number };

type Bag = {
  t: ReturnType<typeof themeById>;
  currency: string;
  crumpled: boolean;
  sellerName: string;
  sellerGstin: string;
  sellerAddress: string;
  buyerName: string;
  buyerAddress: string;
  orderId: string;
  invoiceNo: string;
  orderDate: string;
  paymentMethod: string;
  taxPct: string;
  // raw money inputs
  shipping: string;
  discount: string;
  // computed
  lines: Line[];
  subtotal: number;
  discountAmt: number;
  shippingAmt: number;
  taxAmt: number;
  total: number;
};

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

export default function EcommerceInvoicePreview(props: PreviewProps) {
  const { config, data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  // resolve the items field name from the config (it is "items" here).
  const itemsField =
    config.fields.find((f) => f.type === "items")?.name ?? "items";

  const lines: Line[] = parseItems(data[itemsField]).map((row) => {
    const qty = num(row.qty);
    const rate = num(row.rate);
    return { name: row.name ?? "", qty, rate, amount: qty * rate };
  });

  const subtotal = lines.reduce((acc, l) => acc + l.amount, 0);
  const discountAmt = num(str(data, "discount"));
  const shippingAmt = num(str(data, "shipping"));
  const taxable = Math.max(subtotal - discountAmt, 0);
  const taxPct = str(data, "taxPct");
  const taxAmt = (taxable * num(taxPct)) / 100;
  const total = taxable + shippingAmt + taxAmt;

  const bag: Bag = {
    t,
    currency,
    crumpled,
    sellerName: str(data, "sellerName"),
    sellerGstin: str(data, "sellerGstin"),
    sellerAddress: str(data, "sellerAddress"),
    buyerName: str(data, "buyerName"),
    buyerAddress: str(data, "buyerAddress"),
    orderId: str(data, "orderId"),
    invoiceNo: str(data, "invoiceNo"),
    orderDate: str(data, "orderDate"),
    paymentMethod: str(data, "paymentMethod"),
    taxPct,
    shipping: str(data, "shipping"),
    discount: str(data, "discount"),
    lines,
    subtotal,
    discountAmt,
    shippingAmt,
    taxAmt,
    total,
  };

  switch (template) {
    case "template-2":
      return <OrderReceipt {...bag} />;
    case "template-1":
    default:
      return <TaxInvoice {...bag} />;
  }
}

/* ================================================================== */
/* shared totals rows                                                 */
/* ================================================================== */

function SummaryRow({
  label,
  value,
  ink,
  muted,
  negative,
}: {
  label: string;
  value: string;
  ink: string;
  muted: string;
  negative?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 12px", color: muted }}>
      <span>{label}</span>
      <span style={{ color: negative ? "#9a3412" : ink }}>{value}</span>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 1 — Tax Invoice (~640px, GST table)                       */
/* ================================================================== */

function TaxInvoice(p: Bag) {
  const { t } = p;
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
        border: `1px solid ${t.muted}`,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `2px solid ${t.accent}`,
          paddingBottom: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: t.ink }}>
            {p.sellerName || "Seller Name"}
          </div>
          {p.sellerAddress ? (
            <div style={{ color: t.muted, lineHeight: 1.5, marginTop: 2 }}>{p.sellerAddress}</div>
          ) : null}
          {p.sellerGstin ? (
            <div style={{ color: t.ink, marginTop: 4 }}>
              <span style={{ color: t.muted }}>GSTIN: </span>
              {p.sellerGstin}
            </div>
          ) : null}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: t.accent }}>
            TAX INVOICE
          </div>
          <div style={{ fontSize: 10, color: t.muted, letterSpacing: 1, textTransform: "uppercase" }}>
            Original for Recipient
          </div>
        </div>
      </div>

      {/* bill-to + meta */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 14 }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
            Billing / Shipping Address
          </div>
          <div style={{ fontWeight: 700, color: t.ink }}>{p.buyerName || "—"}</div>
          {p.buyerAddress ? (
            <div style={{ color: t.muted, lineHeight: 1.5 }}>{p.buyerAddress}</div>
          ) : null}
        </div>
        <div style={{ textAlign: "right", color: t.ink, lineHeight: 1.7, whiteSpace: "nowrap" }}>
          {p.invoiceNo ? (
            <div>
              <span style={{ color: t.muted }}>Invoice No: </span>
              {p.invoiceNo}
            </div>
          ) : null}
          {p.orderId ? (
            <div>
              <span style={{ color: t.muted }}>Order ID: </span>
              {p.orderId}
            </div>
          ) : null}
          {p.orderDate ? (
            <div>
              <span style={{ color: t.muted }}>Order Date: </span>
              {fmtDMonY(p.orderDate)}
            </div>
          ) : null}
        </div>
      </div>

      {/* items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ textAlign: "center", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 34 }}>#</th>
            <th style={{ textAlign: "left", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Item Description</th>
            <th style={{ textAlign: "center", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 50 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 100 }}>Unit Price</th>
            <th style={{ textAlign: "right", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 110 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {p.lines.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: "14px 8px", border: `1px solid ${t.muted}`, textAlign: "center", color: t.muted }}>
                No items added
              </td>
            </tr>
          ) : (
            p.lines.map((l, i) => (
              <tr key={i}>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "center" }}>{i + 1}</td>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink }}>{l.name || "—"}</td>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "center" }}>{l.qty}</td>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "right" }}>{plain(l.rate, p.currency)}</td>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "right" }}>{plain(l.amount, p.currency)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 14, gap: 24 }}>
        <div style={{ maxWidth: 300, color: t.muted, fontSize: 11, lineHeight: 1.6 }}>
          {p.paymentMethod ? (
            <div style={{ color: t.ink, fontWeight: 700, marginBottom: 6 }}>
              Payment Mode: <span style={{ fontWeight: 400 }}>{p.paymentMethod}</span>
            </div>
          ) : null}
          <div>Whether tax is payable under reverse charge: No</div>
        </div>

        <div style={{ width: 290 }}>
          <SummaryRow label="Subtotal" value={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
          {p.discountAmt > 0 ? (
            <SummaryRow label="Discount" value={`- ${plain(p.discountAmt, p.currency)}`} ink={t.ink} muted={t.muted} negative />
          ) : null}
          <SummaryRow label="Shipping" value={plain(p.shippingAmt, p.currency)} ink={t.ink} muted={t.muted} />
          <SummaryRow
            label={`GST${p.taxPct ? ` @ ${p.taxPct}%` : ""}`}
            value={plain(p.taxAmt, p.currency)}
            ink={t.ink}
            muted={t.muted}
          />
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
        </div>
      </div>

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 30 }}>
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 330, lineHeight: 1.5 }}>
          This is a computer generated invoice and does not require a physical signature. Goods once
          sold are subject to the marketplace return policy. E. &amp; O.E.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 170, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            For {p.sellerName || "the Seller"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Order Receipt (compact confirmation card)             */
/* ================================================================== */

function OrderReceipt(p: Bag) {
  const { t } = p;
  const itemCount = p.lines.reduce((acc, l) => acc + l.qty, 0);

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
      {/* banner */}
      <div style={{ background: t.accent, color: "#ffffff", padding: "18px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 2, textTransform: "uppercase" }}>
              Order Confirmed
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.3 }}>
              {p.sellerName || "Online Store"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1 }}>
              Order ID
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>{p.orderId || "—"}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
        {/* meta row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px 16px",
            paddingBottom: 14,
            borderBottom: `1px dashed ${t.muted}`,
            marginBottom: 14,
          }}
        >
          <Meta k="Customer" v={p.buyerName} ink={t.ink} muted={t.muted} />
          <Meta k="Order Date" v={fmtDMY(p.orderDate)} ink={t.ink} muted={t.muted} />
          <Meta k="Invoice No." v={p.invoiceNo} ink={t.ink} muted={t.muted} />
          <Meta k="Payment" v={p.paymentMethod} ink={t.ink} muted={t.muted} />
          <Meta k="Items" v={itemCount ? String(itemCount) : "—"} ink={t.ink} muted={t.muted} />
          {p.sellerGstin ? <Meta k="Seller GSTIN" v={p.sellerGstin} ink={t.ink} muted={t.muted} /> : <span />}
        </div>

        {/* shipping address */}
        {p.buyerAddress ? (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
              Deliver To
            </div>
            <div style={{ color: t.ink, lineHeight: 1.5 }}>{p.buyerAddress}</div>
          </div>
        ) : null}

        {/* line items as rows */}
        <div style={{ borderTop: `1px dashed ${t.muted}`, paddingTop: 10 }}>
          {p.lines.length === 0 ? (
            <div style={{ color: t.muted, textAlign: "center", padding: "10px 0" }}>No items added</div>
          ) : (
            p.lines.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  padding: "7px 0",
                  borderBottom: i === p.lines.length - 1 ? "none" : `1px solid rgba(0,0,0,0.06)`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ color: t.ink, fontWeight: 600 }}>{l.name || "—"}</div>
                  <div style={{ color: t.muted, fontSize: 11 }}>
                    {l.qty} × {plain(l.rate, p.currency)}
                  </div>
                </div>
                <div style={{ color: t.ink, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {plain(l.amount, p.currency)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* totals */}
        <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 12, paddingTop: 10 }}>
          <SummaryRow label="Subtotal" value={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
          {p.discountAmt > 0 ? (
            <SummaryRow label="Discount" value={`- ${plain(p.discountAmt, p.currency)}`} ink={t.ink} muted={t.muted} negative />
          ) : null}
          <SummaryRow label="Shipping" value={plain(p.shippingAmt, p.currency)} ink={t.ink} muted={t.muted} />
          <SummaryRow
            label={`GST${p.taxPct ? ` @ ${p.taxPct}%` : ""}`}
            value={plain(p.taxAmt, p.currency)}
            ink={t.ink}
            muted={t.muted}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: "10px 12px",
              marginTop: 6,
              border: `2px solid ${t.accent}`,
              borderRadius: 6,
            }}
          >
            <span style={{ fontWeight: 800, color: t.accent, fontSize: 14 }}>Total Paid</span>
            <span style={{ fontWeight: 800, color: t.accent, fontSize: 18 }}>{plain(p.total, p.currency)}</span>
          </div>
        </div>

        <div style={{ textAlign: "center", color: t.muted, fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
          Thank you for shopping with {p.sellerName || "us"}! This receipt confirms your order
          {p.orderId ? ` ${p.orderId}` : ""}.
        </div>
      </div>
    </div>
  );
}

function Meta({ k, v, ink, muted }: { k: string; v: string; ink: string; muted: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: ink, wordBreak: "break-word" }}>{v || "—"}</div>
    </div>
  );
}
