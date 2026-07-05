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

type Line = { title: string; qty: number; rate: number; amount: number };

type Bag = {
  t: ReturnType<typeof themeById>;
  currency: string;
  crumpled: boolean;
  storeName: string;
  address: string;
  gstin: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  paymentMethod: string;
  gstPct: string;
  // computed
  lines: Line[];
  subtotal: number;
  discountAmt: number;
  taxAmt: number;
  total: number;
  bookCount: number;
};

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

export default function BookInvoicePreview(props: PreviewProps) {
  const { config, data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  // resolve the items field name from the config (it is "items" here).
  const itemsField =
    config.fields.find((f) => f.type === "items")?.name ?? "items";

  const lines: Line[] = parseItems(data[itemsField]).map((row) => {
    const qty = num(row.qty);
    const rate = num(row.rate);
    return { title: row.title ?? "", qty, rate, amount: qty * rate };
  });

  const subtotal = lines.reduce((acc, l) => acc + l.amount, 0);
  const discountAmt = num(str(data, "discount"));
  const taxable = Math.max(subtotal - discountAmt, 0);
  const gstPct = str(data, "gstPct");
  const taxAmt = (taxable * num(gstPct)) / 100;
  const total = taxable + taxAmt;
  const bookCount = lines.reduce((acc, l) => acc + l.qty, 0);

  const bag: Bag = {
    t,
    currency,
    crumpled,
    storeName: str(data, "storeName"),
    address: str(data, "address"),
    gstin: str(data, "gstin"),
    invoiceNo: str(data, "invoiceNo"),
    date: str(data, "date"),
    customerName: str(data, "customerName"),
    paymentMethod: str(data, "paymentMethod"),
    gstPct,
    lines,
    subtotal,
    discountAmt,
    taxAmt,
    total,
    bookCount,
  };

  switch (template) {
    case "template-2":
      return <Receipt {...bag} />;
    case "template-1":
    default:
      return <Invoice {...bag} />;
  }
}

/* ================================================================== */
/* shared totals row                                                  */
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
/* TEMPLATE 1 — Invoice (~640px, ruled GST table)                     */
/* ================================================================== */

function Invoice(p: Bag) {
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
        <div style={{ display: "flex", gap: 12, maxWidth: 380 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: t.accent,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-book" />
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: t.ink }}>
              {p.storeName || "Bookstore Name"}
            </div>
            {p.address ? (
              <div style={{ color: t.muted, lineHeight: 1.5, marginTop: 2 }}>{p.address}</div>
            ) : null}
            {p.gstin ? (
              <div style={{ color: t.ink, marginTop: 4 }}>
                <span style={{ color: t.muted }}>GSTIN: </span>
                {p.gstin}
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: t.accent }}>
            INVOICE
          </div>
          <div style={{ fontSize: 10, color: t.muted, letterSpacing: 1, textTransform: "uppercase" }}>
            Books &amp; Stationery
          </div>
        </div>
      </div>

      {/* bill-to + meta */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 14 }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
            Billed To
          </div>
          <div style={{ fontWeight: 700, color: t.ink }}>{p.customerName || "—"}</div>
        </div>
        <div style={{ textAlign: "right", color: t.ink, lineHeight: 1.7, whiteSpace: "nowrap" }}>
          {p.invoiceNo ? (
            <div>
              <span style={{ color: t.muted }}>Invoice No: </span>
              {p.invoiceNo}
            </div>
          ) : null}
          {p.date ? (
            <div>
              <span style={{ color: t.muted }}>Date: </span>
              {fmtDMonY(p.date)}
            </div>
          ) : null}
        </div>
      </div>

      {/* items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ textAlign: "center", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 34 }}>#</th>
            <th style={{ textAlign: "left", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)" }}>Book Title</th>
            <th style={{ textAlign: "center", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 50 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 100 }}>Price</th>
            <th style={{ textAlign: "right", padding: "7px 8px", border: "1px solid rgba(0,0,0,0.15)", width: 110 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {p.lines.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: "14px 8px", border: `1px solid ${t.muted}`, textAlign: "center", color: t.muted }}>
                No books added
              </td>
            </tr>
          ) : (
            p.lines.map((l, i) => (
              <tr key={i}>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink, textAlign: "center" }}>{i + 1}</td>
                <td style={{ padding: "7px 8px", border: `1px solid ${t.muted}`, color: t.ink }}>{l.title || "—"}</td>
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
          <div>Total books: {p.bookCount || 0}</div>
        </div>

        <div style={{ width: 290 }}>
          <SummaryRow label="Subtotal" value={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
          {p.discountAmt > 0 ? (
            <SummaryRow label="Discount" value={`- ${plain(p.discountAmt, p.currency)}`} ink={t.ink} muted={t.muted} negative />
          ) : null}
          <SummaryRow
            label={`GST${p.gstPct ? ` @ ${p.gstPct}%` : ""}`}
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
          This is a computer generated invoice. Books once sold are not returnable unless damaged.
          Thank you for reading with us. E. &amp; O.E.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 170, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            For {p.storeName || "the Store"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Receipt (compact stacked card)                        */
/* ================================================================== */

function Receipt(p: Bag) {
  const { t } = p;

  return (
    <div
      style={{
        width: 480,
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
      <div style={{ background: t.accent, color: "#ffffff", padding: "18px 22px", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.3 }}>
          {p.storeName || "Bookstore"}
        </div>
        {p.address ? (
          <div style={{ fontSize: 11, opacity: 0.85, lineHeight: 1.5, marginTop: 3 }}>{p.address}</div>
        ) : null}
        <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: 2, textTransform: "uppercase", marginTop: 6 }}>
          Sales Receipt
        </div>
      </div>

      <div style={{ padding: "18px 22px 22px" }}>
        {/* meta row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 16px",
            paddingBottom: 12,
            borderBottom: `1px dashed ${t.muted}`,
            marginBottom: 12,
          }}
        >
          <Meta k="Receipt No." v={p.invoiceNo} ink={t.ink} muted={t.muted} />
          <Meta k="Date" v={fmtDMY(p.date)} ink={t.ink} muted={t.muted} />
          <Meta k="Customer" v={p.customerName} ink={t.ink} muted={t.muted} />
          <Meta k="Payment" v={p.paymentMethod} ink={t.ink} muted={t.muted} />
          {p.gstin ? <Meta k="GSTIN" v={p.gstin} ink={t.ink} muted={t.muted} /> : <span />}
        </div>

        {/* column header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: t.muted,
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
            paddingBottom: 6,
            borderBottom: `1px solid rgba(0,0,0,0.08)`,
          }}
        >
          <span>Book</span>
          <span>Amount</span>
        </div>

        {/* line items as rows */}
        <div>
          {p.lines.length === 0 ? (
            <div style={{ color: t.muted, textAlign: "center", padding: "12px 0" }}>No books added</div>
          ) : (
            p.lines.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: i === p.lines.length - 1 ? "none" : `1px dotted rgba(0,0,0,0.12)`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ color: t.ink, fontWeight: 600 }}>{l.title || "—"}</div>
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
        <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 10, paddingTop: 10 }}>
          <SummaryRow label="Subtotal" value={plain(p.subtotal, p.currency)} ink={t.ink} muted={t.muted} />
          {p.discountAmt > 0 ? (
            <SummaryRow label="Discount" value={`- ${plain(p.discountAmt, p.currency)}`} ink={t.ink} muted={t.muted} negative />
          ) : null}
          <SummaryRow
            label={`GST${p.gstPct ? ` @ ${p.gstPct}%` : ""}`}
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

        <div style={{ textAlign: "center", color: t.muted, fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>
          {p.bookCount || 0} book{p.bookCount === 1 ? "" : "s"} purchased. Happy reading, and thank you
          for shopping with {p.storeName || "us"}!
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
