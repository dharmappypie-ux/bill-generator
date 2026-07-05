import { PreviewProps } from "@/types/generator";
import { str, num, plain, fmtDMonY, fmtDMY, parseItems, paperStyle } from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* fonts                                                              */
/* ------------------------------------------------------------------ */
const MONO = "'Courier New', 'Cousine', 'DejaVu Sans Mono', monospace";
const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

/* ------------------------------------------------------------------ */
/* shared bill math                                                   */
/* ------------------------------------------------------------------ */
type Line = { name: string; qty: number; mrp: number; rate: number; amount: number; mrpAmount: number };
type Bill = {
  lines: Line[];
  totalQty: number;
  subtotal: number; // sum(rate * qty) — what the customer pays
  mrpTotal: number; // sum(mrp * qty)
  savings: number; // sum((mrp - rate) * qty)
  grandTotal: number;
};

function computeBill(data: PreviewProps["data"]): Bill {
  const rows = parseItems(data.items);
  const lines: Line[] = rows.map((r) => {
    const qty = num(r.qty);
    const mrp = num(r.mrp);
    const rate = num(r.rate);
    return { name: r.name ?? "", qty, mrp, rate, amount: qty * rate, mrpAmount: qty * mrp };
  });

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.mrpAmount, 0);
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  // Savings only counts positive differences (a rate above MRP shouldn't reduce savings).
  const savings = lines.reduce((s, l) => s + Math.max(0, (l.mrp - l.rate) * l.qty), 0);

  return {
    lines,
    totalQty,
    subtotal,
    mrpTotal,
    savings,
    grandTotal: subtotal,
  };
}

/* ================================================================== */
/* component                                                          */
/* ================================================================== */
export default function MartBillPreview(props: PreviewProps) {
  switch (props.template) {
    case "template-2":
      return <DetailedBill {...props} />;
    case "template-1":
    default:
      return <PosReceipt {...props} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — POS Receipt (monospace ~360px)                        */
/* ================================================================== */
function PosReceipt(props: PreviewProps) {
  const { data, theme, crumpled, currency } = props;
  const t = themeById(theme);

  const storeName = str(data, "storeName");
  const address = str(data, "address");
  const gstin = str(data, "gstin");
  const billNo = str(data, "billNo");
  const cashier = str(data, "cashier");
  const date = str(data, "date");
  const time = str(data, "time");
  const paymentMethod = str(data, "paymentMethod");
  const b = computeBill(data);

  const rule = (ch: string) => (
    <div
      style={{
        color: t.muted,
        overflow: "hidden",
        whiteSpace: "nowrap",
        margin: "8px 0",
        letterSpacing: 1,
      }}
    >
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
          {"🛒"}
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
          {(storeName || "MORE SUPERMARKET").toUpperCase()}
        </div>
        {address ? (
          <div style={{ color: t.muted, fontSize: 11, marginTop: 3, lineHeight: 1.4, whiteSpace: "pre-line" }}>
            {address}
          </div>
        ) : null}
        {gstin ? <div style={{ color: t.muted, fontSize: 11, marginTop: 2 }}>GSTIN: {gstin}</div> : null}
      </div>

      {rule("=")}
      <div style={{ textAlign: "center", fontWeight: 800, letterSpacing: 3 }}>RETAIL INVOICE</div>
      {rule("=")}

      {/* bill meta */}
      {L("Bill No:", billNo)}
      {L("Date:", fmtDMonY(date))}
      {L("Time:", time)}
      {L("Cashier:", cashier)}

      {rule("-")}

      {/* items header */}
      <div style={{ display: "flex", fontWeight: 800, color: t.ink }}>
        <span style={{ flex: 3 }}>ITEM</span>
        <span style={{ flex: 1, textAlign: "center" }}>QTY</span>
        <span style={{ flex: 1.4, textAlign: "right" }}>RATE</span>
        <span style={{ flex: 1.6, textAlign: "right" }}>AMT</span>
      </div>
      {rule("-")}

      {/* items */}
      {b.lines.length === 0 ? (
        <div style={{ color: t.muted, textAlign: "center", padding: "6px 0" }}>No products added</div>
      ) : (
        b.lines.map((l, i) => {
          const saved = Math.max(0, (l.mrp - l.rate) * l.qty);
          return (
            <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ color: t.ink, wordBreak: "break-word" }}>{l.name || `Item ${i + 1}`}</div>
              <div style={{ display: "flex", color: t.ink }}>
                <span style={{ flex: 3 }} />
                <span style={{ flex: 1, textAlign: "center" }}>{l.qty}</span>
                <span style={{ flex: 1.4, textAlign: "right" }}>{plain(l.rate, currency)}</span>
                <span style={{ flex: 1.6, textAlign: "right" }}>{plain(l.amount, currency)}</span>
              </div>
              {l.mrp > l.rate ? (
                <div style={{ display: "flex", color: t.muted, fontSize: 10.5 }}>
                  <span style={{ flex: 3 }}>MRP {plain(l.mrp, currency)} (save {plain(saved, currency)})</span>
                  <span style={{ flex: 4, textAlign: "right" }} />
                </div>
              ) : null}
            </div>
          );
        })
      )}

      {rule("-")}

      {/* totals */}
      {L(`Items: ${b.lines.length}`, `Qty: ${b.totalQty}`)}
      {b.savings > 0 ? L("MRP Total:", plain(b.mrpTotal, currency)) : null}
      {L("Sub Total:", plain(b.subtotal, currency))}

      {rule("=")}
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
        <span>NET PAYABLE</span>
        <span>{plain(b.grandTotal, currency)}</span>
      </div>
      {rule("=")}

      {/* you saved banner */}
      {b.savings > 0 ? (
        <div
          style={{
            textAlign: "center",
            border: `1px dashed ${t.ink}`,
            padding: "6px 8px",
            margin: "10px 0",
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          YOU SAVED {plain(b.savings, currency)}
        </div>
      ) : null}

      {L("Paid via:", paymentMethod)}

      {/* footer */}
      <div style={{ textAlign: "center", marginTop: 20, lineHeight: 1.7, fontWeight: 700 }}>
        <div>THANK YOU FOR SHOPPING</div>
        <div style={{ color: t.muted, fontSize: 11 }}>** NO EXCHANGE WITHOUT BILL **</div>
        <div style={{ color: t.muted, fontSize: 11, marginTop: 6 }}>*** CUSTOMER COPY ***</div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Detailed Bill (table ~640px)                          */
/* ================================================================== */
function DetailedBill(props: PreviewProps) {
  const { data, theme, crumpled, currency } = props;
  const t = themeById(theme);

  const storeName = str(data, "storeName");
  const address = str(data, "address");
  const gstin = str(data, "gstin");
  const billNo = str(data, "billNo");
  const cashier = str(data, "cashier");
  const date = str(data, "date");
  const time = str(data, "time");
  const paymentMethod = str(data, "paymentMethod");
  const b = computeBill(data);

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
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: t.accent }}>RETAIL INVOICE</div>
      </div>

      {/* store + meta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: t.ink }}>{storeName || "More Supermarket"}</div>
          {address ? (
            <div style={{ color: t.muted, marginTop: 2, lineHeight: 1.5, whiteSpace: "pre-line" }}>{address}</div>
          ) : null}
          <div style={{ color: t.muted, marginTop: 2 }}>GSTIN: {gstin || "09AABCM1234L1ZP"}</div>
        </div>
        <div style={{ textAlign: "right", color: t.ink, lineHeight: 1.7 }}>
          <META k="Bill No:" v={billNo} />
          <META k="Date:" v={fmtDMY(date)} />
          <META k="Time:" v={time} />
          <META k="Cashier:" v={cashier} />
          <META k="Payment:" v={paymentMethod} />
        </div>
      </div>

      {/* item line-item table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <th style={{ ...th, textAlign: "left", width: 36 }}>#</th>
            <th style={{ ...th, textAlign: "left" }}>Product Description</th>
            <th style={{ ...th, textAlign: "center", width: 56 }}>Qty</th>
            <th style={{ ...th, textAlign: "right", width: 96 }}>MRP</th>
            <th style={{ ...th, textAlign: "right", width: 96 }}>Rate</th>
            <th style={{ ...th, textAlign: "right", width: 110 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {b.lines.length === 0 ? (
            <tr>
              <td style={{ ...td, textAlign: "center", color: t.muted }} colSpan={6}>
                No products added
              </td>
            </tr>
          ) : (
            b.lines.map((l, i) => (
              <tr key={i}>
                <td style={{ ...td, textAlign: "center" }}>{i + 1}</td>
                <td style={td}>{l.name || `Item ${i + 1}`}</td>
                <td style={{ ...td, textAlign: "center" }}>{l.qty}</td>
                <td style={{ ...td, textAlign: "right", color: t.muted }}>{plain(l.mrp, currency)}</td>
                <td style={{ ...td, textAlign: "right" }}>{plain(l.rate, currency)}</td>
                <td style={{ ...td, textAlign: "right" }}>{plain(l.amount, currency)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div style={{ width: 320 }}>
          <TotRow k={`Total Items / Qty`} v={`${b.lines.length} / ${b.totalQty}`} />
          {b.savings > 0 ? <TotRow k="Total MRP" v={plain(b.mrpTotal, currency)} /> : null}
          <TotRow k="Sub Total" v={plain(b.subtotal, currency)} />
          {b.savings > 0 ? <TotRow k="Discount on MRP" v={`- ${plain(b.savings, currency)}`} /> : null}
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
            <span>NET PAYABLE</span>
            <span>{plain(b.grandTotal, currency)}</span>
          </div>
          <div style={{ textAlign: "right", color: t.muted, fontSize: 10, marginTop: 4 }}>(rounded, incl. all taxes)</div>
        </div>
      </div>

      {/* you saved banner */}
      {b.savings > 0 ? (
        <div
          style={{
            marginTop: 16,
            border: `1.5px dashed ${t.accent}`,
            borderRadius: 6,
            padding: "10px 14px",
            textAlign: "center",
            color: t.accent,
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: 0.5,
          }}
        >
          🎉 You saved {plain(b.savings, currency)} on this bill!
        </div>
      ) : null}

      {/* footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28 }}>
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 360, lineHeight: 1.5 }}>
          Goods once sold are subject to the store return policy. No exchange without the original bill. E. &amp; O.E.
          This is a system generated retail invoice and does not require a physical signature.
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 170, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            For {storeName || "More Supermarket"}
          </div>
        </div>
      </div>
    </div>
  );
}
