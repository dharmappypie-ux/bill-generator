import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  money,
  plain,
  fmtDMonY,
  fmtDMY,
  parseItems,
  paperStyle,
  type ItemRow,
} from "./shared";
import { themeById } from "@/lib/themes";

/* ------------------------------------------------------------------ */
/* shared bag                                                         */
/* ------------------------------------------------------------------ */

type Bag = {
  t: ReturnType<typeof themeById>;
  currency: string;
  crumpled: boolean;
  // seller
  sellerName: string;
  sellerGstin: string;
  sellerState: string;
  sellerAddress: string;
  // buyer
  buyerName: string;
  buyerGstin: string;
  buyerState: string;
  buyerAddress: string;
  // invoice
  invoiceNo: string;
  invoiceDate: string;
  placeOfSupply: string;
  // items / tax
  rows: ItemRow[];
  taxType: string;
  gstPct: number;
  // computed
  taxable: number;
  isSplit: boolean;
  halfPct: number; // CGST or SGST rate (gstPct / 2 when split)
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  total: number;
};

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

function rowAmount(r: ItemRow): number {
  return num(r.qty) * num(r.rate);
}

export default function GstInvoicePreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const rows = parseItems(data.items);
  const taxable = rows.reduce((s, r) => s + rowAmount(r), 0);
  const gstPct = num(str(data, "gstPct"));
  const taxType = str(data, "taxType") || "CGST+SGST";
  const isSplit = taxType !== "IGST";

  const halfPct = isSplit ? gstPct / 2 : gstPct;
  const cgst = isSplit ? (taxable * halfPct) / 100 : 0;
  const sgst = isSplit ? (taxable * halfPct) / 100 : 0;
  const igst = isSplit ? 0 : (taxable * gstPct) / 100;
  const taxTotal = cgst + sgst + igst;
  const total = taxable + taxTotal;

  const bag: Bag = {
    t,
    currency,
    crumpled,
    sellerName: str(data, "sellerName"),
    sellerGstin: str(data, "sellerGstin"),
    sellerState: str(data, "sellerState"),
    sellerAddress: str(data, "sellerAddress"),
    buyerName: str(data, "buyerName"),
    buyerGstin: str(data, "buyerGstin"),
    buyerState: str(data, "buyerState"),
    buyerAddress: str(data, "buyerAddress"),
    invoiceNo: str(data, "invoiceNo"),
    invoiceDate: str(data, "invoiceDate"),
    placeOfSupply: str(data, "placeOfSupply"),
    rows,
    taxType,
    gstPct,
    taxable,
    isSplit,
    halfPct,
    cgst,
    sgst,
    igst,
    taxTotal,
    total,
  };

  switch (template) {
    case "template-2":
      return <SimpleInvoice {...bag} />;
    case "template-1":
    default:
      return <TaxInvoice {...bag} />;
  }
}

/* ================================================================== */
/* TEMPLATE 1 — Tax Invoice (formal, fully bordered)                  */
/* ================================================================== */

function TaxInvoice(p: Bag) {
  const { t } = p;
  const cellBorder = `1px solid ${t.muted}`;

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12,
        padding: 0,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${t.accent}`,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* title bar */}
      <div
        style={{
          textAlign: "center",
          borderBottom: `2px solid ${t.accent}`,
          padding: "12px 16px 10px",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: t.accent }}>
          TAX INVOICE
        </div>
        <div style={{ fontSize: 10, color: t.muted, letterSpacing: 2, textTransform: "uppercase" }}>
          Original for Recipient
        </div>
      </div>

      {/* seller / invoice meta */}
      <div style={{ display: "flex", borderBottom: cellBorder }}>
        <div style={{ flex: 1.4, padding: "12px 14px", borderRight: cellBorder }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: t.ink }}>
            {p.sellerName || "Seller Name"}
          </div>
          {p.sellerAddress ? (
            <div style={{ color: t.muted, lineHeight: 1.5, marginTop: 3 }}>{p.sellerAddress}</div>
          ) : null}
          <MetaLine k="GSTIN" v={p.sellerGstin} ink={t.ink} muted={t.muted} />
          <MetaLine k="State" v={p.sellerState} ink={t.ink} muted={t.muted} />
        </div>
        <div style={{ flex: 1, padding: "12px 14px", lineHeight: 1.85 }}>
          <MetaLine k="Invoice No." v={p.invoiceNo} ink={t.ink} muted={t.muted} bold />
          <MetaLine k="Invoice Date" v={fmtDMonY(p.invoiceDate)} ink={t.ink} muted={t.muted} />
          <MetaLine k="Place of Supply" v={p.placeOfSupply} ink={t.ink} muted={t.muted} />
          <MetaLine k="Reverse Charge" v="No" ink={t.ink} muted={t.muted} />
        </div>
      </div>

      {/* bill-to */}
      <div style={{ padding: "10px 14px", borderBottom: cellBorder }}>
        <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>
          Bill To
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: t.ink, marginTop: 2 }}>
          {p.buyerName || "Buyer Name"}
        </div>
        {p.buyerAddress ? (
          <div style={{ color: t.muted, lineHeight: 1.5 }}>{p.buyerAddress}</div>
        ) : null}
        <div style={{ display: "flex", gap: 28, marginTop: 4 }}>
          <span>
            <span style={{ color: t.muted }}>GSTIN: </span>
            <span style={{ color: t.ink }}>{p.buyerGstin || "—"}</span>
          </span>
          <span>
            <span style={{ color: t.muted }}>State: </span>
            <span style={{ color: t.ink }}>{p.buyerState || "—"}</span>
          </span>
        </div>
      </div>

      {/* items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: t.accent, color: "#ffffff" }}>
            <Th w="34" align="center">#</Th>
            <Th align="left">Description</Th>
            <Th w="70" align="center">HSN/SAC</Th>
            <Th w="48" align="center">Qty</Th>
            <Th w="92" align="right">Rate</Th>
            <Th w="104" align="right">Amount</Th>
          </tr>
        </thead>
        <tbody>
          {p.rows.length ? (
            p.rows.map((r, i) => (
              <tr key={i}>
                <Td align="center" border={cellBorder}>{i + 1}</Td>
                <Td align="left" border={cellBorder}>{r.desc || "—"}</Td>
                <Td align="center" border={cellBorder}>{r.hsn || "—"}</Td>
                <Td align="center" border={cellBorder}>{num(r.qty).toLocaleString("en-IN")}</Td>
                <Td align="right" border={cellBorder}>{money(r.rate, p.currency)}</Td>
                <Td align="right" border={cellBorder}>{plain(rowAmount(r), p.currency)}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td align="center" border={cellBorder} colSpan={6}>
                <span style={{ color: t.muted }}>No items added</span>
              </Td>
            </tr>
          )}
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", borderTop: cellBorder }}>
        <div style={{ flex: 1, padding: "10px 14px", borderRight: cellBorder, color: t.muted, fontSize: 11 }}>
          <div style={{ color: t.ink, fontWeight: 700, marginBottom: 4 }}>
            {p.taxType === "IGST" ? "Inter-state supply (IGST)" : "Intra-state supply (CGST + SGST)"}
          </div>
          GST charged @ {p.gstPct % 1 === 0 ? p.gstPct : p.gstPct.toFixed(2)}% on the taxable value.
          This is a computer-generated invoice. E. &amp; O.E.
        </div>
        <div style={{ width: 280 }}>
          <SumRow label="Taxable Value" value={plain(p.taxable, p.currency)} ink={t.ink} muted={t.muted} />
          {p.isSplit ? (
            <>
              <SumRow
                label={`CGST @ ${fmtPct(p.halfPct)}%`}
                value={plain(p.cgst, p.currency)}
                ink={t.ink}
                muted={t.muted}
              />
              <SumRow
                label={`SGST @ ${fmtPct(p.halfPct)}%`}
                value={plain(p.sgst, p.currency)}
                ink={t.ink}
                muted={t.muted}
              />
            </>
          ) : (
            <SumRow
              label={`IGST @ ${fmtPct(p.gstPct)}%`}
              value={plain(p.igst, p.currency)}
              ink={t.ink}
              muted={t.muted}
            />
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: t.accent,
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            <span>GRAND TOTAL</span>
            <span>{plain(p.total, p.currency)}</span>
          </div>
        </div>
      </div>

      {/* signature footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "18px 14px 16px",
          borderTop: cellBorder,
        }}
      >
        <div style={{ color: t.muted, fontSize: 10, maxWidth: 320, lineHeight: 1.5 }}>
          Certified that the particulars given above are true and correct. Goods once sold will not be
          taken back.
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              borderTop: `1px solid ${t.ink}`,
              width: 170,
              paddingTop: 4,
              color: t.muted,
              fontSize: 11,
            }}
          >
            For {p.sellerName || "the Seller"}
            <div style={{ fontSize: 10 }}>Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 2 — Simple Invoice (clean, minimal rules)                 */
/* ================================================================== */

function SimpleInvoice(p: Bag) {
  const { t } = p;

  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        padding: 30,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.ink }}>
            {p.sellerName || "Seller Name"}
          </div>
          {p.sellerAddress ? (
            <div style={{ color: t.muted, lineHeight: 1.5, marginTop: 3, maxWidth: 320 }}>
              {p.sellerAddress}
            </div>
          ) : null}
          {p.sellerGstin ? (
            <div style={{ marginTop: 4, color: t.ink }}>
              <span style={{ color: t.muted }}>GSTIN: </span>
              {p.sellerGstin}
            </div>
          ) : null}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2, color: t.accent }}>INVOICE</div>
          {p.invoiceNo ? (
            <div style={{ color: t.ink, marginTop: 2 }}>
              <span style={{ color: t.muted }}>No: </span>
              {p.invoiceNo}
            </div>
          ) : null}
          {p.invoiceDate ? (
            <div style={{ color: t.ink }}>
              <span style={{ color: t.muted }}>Date: </span>
              {fmtDMY(p.invoiceDate)}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ borderTop: `2px solid ${t.accent}`, margin: "16px 0" }} />

      {/* bill-to + place of supply */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 24 }}>
        <div>
          <div style={{ fontSize: 10, color: t.muted, textTransform: "uppercase", letterSpacing: 1 }}>
            Billed To
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.ink, marginTop: 2 }}>
            {p.buyerName || "Buyer Name"}
          </div>
          {p.buyerAddress ? (
            <div style={{ color: t.muted, lineHeight: 1.5, maxWidth: 300 }}>{p.buyerAddress}</div>
          ) : null}
          {p.buyerGstin ? (
            <div style={{ color: t.ink, marginTop: 2 }}>
              <span style={{ color: t.muted }}>GSTIN: </span>
              {p.buyerGstin}
            </div>
          ) : null}
        </div>
        <div style={{ textAlign: "right", lineHeight: 1.7 }}>
          {p.placeOfSupply ? (
            <div>
              <span style={{ color: t.muted }}>Place of Supply: </span>
              <span style={{ color: t.ink }}>{p.placeOfSupply}</span>
            </div>
          ) : null}
          {p.buyerState ? (
            <div>
              <span style={{ color: t.muted }}>State: </span>
              <span style={{ color: t.ink }}>{p.buyerState}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* items */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ color: t.accent, borderBottom: `2px solid ${t.accent}` }}>
            <th style={{ textAlign: "left", padding: "8px 6px" }}>Description</th>
            <th style={{ textAlign: "center", padding: "8px 6px", width: 80 }}>HSN/SAC</th>
            <th style={{ textAlign: "center", padding: "8px 6px", width: 50 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "8px 6px", width: 96 }}>Rate</th>
            <th style={{ textAlign: "right", padding: "8px 6px", width: 104 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {p.rows.length ? (
            p.rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.muted}` }}>
                <td style={{ padding: "8px 6px", color: t.ink }}>{r.desc || "—"}</td>
                <td style={{ padding: "8px 6px", textAlign: "center", color: t.ink }}>{r.hsn || "—"}</td>
                <td style={{ padding: "8px 6px", textAlign: "center", color: t.ink }}>
                  {num(r.qty).toLocaleString("en-IN")}
                </td>
                <td style={{ padding: "8px 6px", textAlign: "right", color: t.ink }}>
                  {money(r.rate, p.currency)}
                </td>
                <td style={{ padding: "8px 6px", textAlign: "right", color: t.ink }}>
                  {plain(rowAmount(r), p.currency)}
                </td>
              </tr>
            ))
          ) : (
            <tr style={{ borderBottom: `1px solid ${t.muted}` }}>
              <td style={{ padding: "10px 6px", color: t.muted, textAlign: "center" }} colSpan={5}>
                No items added
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div style={{ width: 270 }}>
          <SumRow label="Taxable Value" value={plain(p.taxable, p.currency)} ink={t.ink} muted={t.muted} pad="5px 6px" />
          {p.isSplit ? (
            <>
              <SumRow
                label={`CGST @ ${fmtPct(p.halfPct)}%`}
                value={plain(p.cgst, p.currency)}
                ink={t.ink}
                muted={t.muted}
                pad="5px 6px"
              />
              <SumRow
                label={`SGST @ ${fmtPct(p.halfPct)}%`}
                value={plain(p.sgst, p.currency)}
                ink={t.ink}
                muted={t.muted}
                pad="5px 6px"
              />
            </>
          ) : (
            <SumRow
              label={`IGST @ ${fmtPct(p.gstPct)}%`}
              value={plain(p.igst, p.currency)}
              ink={t.ink}
              muted={t.muted}
              pad="5px 6px"
            />
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "9px 6px",
              borderTop: `2px solid ${t.accent}`,
              marginTop: 4,
              fontWeight: 800,
              fontSize: 15,
              color: t.accent,
            }}
          >
            <span>Total</span>
            <span>{plain(p.total, p.currency)}</span>
          </div>
        </div>
      </div>

      {/* footer note */}
      <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 24, paddingTop: 10 }}>
        <div style={{ color: t.muted, fontSize: 11, lineHeight: 1.5 }}>
          Thank you for your business. Please make payment by the due date. This is a computer-generated
          invoice and does not require a signature.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* small helpers                                                      */
/* ------------------------------------------------------------------ */

function fmtPct(n: number): string {
  return n % 1 === 0 ? String(n) : n.toFixed(2);
}

function MetaLine({
  k,
  v,
  ink,
  muted,
  bold,
}: {
  k: string;
  v: string;
  ink: string;
  muted: string;
  bold?: boolean;
}) {
  if (!v) return null;
  return (
    <div style={{ marginTop: 2 }}>
      <span style={{ color: muted }}>{k}: </span>
      <span style={{ color: ink, fontWeight: bold ? 700 : 400 }}>{v}</span>
    </div>
  );
}

function Th({
  children,
  w,
  align,
}: {
  children: React.ReactNode;
  w?: string;
  align: "left" | "center" | "right";
}) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "7px 8px",
        border: "1px solid rgba(0,0,0,0.15)",
        width: w ? `${w}px` : undefined,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  border,
  colSpan,
}: {
  children: React.ReactNode;
  align: "left" | "center" | "right";
  border: string;
  colSpan?: number;
}) {
  return (
    <td style={{ padding: "7px 8px", border, textAlign: align }} colSpan={colSpan}>
      {children}
    </td>
  );
}

function SumRow({
  label,
  value,
  ink,
  muted,
  pad = "5px 14px",
}: {
  label: string;
  value: string;
  ink: string;
  muted: string;
  pad?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: pad, color: muted }}>
      <span>{label}</span>
      <span style={{ color: ink }}>{value}</span>
    </div>
  );
}
