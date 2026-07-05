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
  // business
  logo: string;
  invoiceType: string;
  title: string;
  hasGst: boolean;
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
  dueDate: string;
  placeOfSupply: string;
  // items / tax
  rows: ItemRow[];
  taxType: string;
  gstPct: number;
  // notes
  notes: string;
  terms: string;
  // computed
  taxable: number;
  isSplit: boolean;
  halfPct: number; // CGST or SGST rate (gstPct / 2 when split)
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  total: number;
  amountPaid: number;
  balance: number;
  showPayment: boolean;
};

const SANS = "'Product Sans', Montserrat, Arial, Helvetica, sans-serif";

// Per-template signature accent colors (single monochrome theme, so we bake
// a distinct accent into each new design for visual variety).
const C_INDIGO = "#4F46E5";
const C_TEAL = "#0F766E";
const C_SLATE = "#1E3A5F";

function rowAmount(r: ItemRow): number {
  return num(r.qty) * num(r.rate);
}

function titleFor(invoiceType: string): string {
  switch (invoiceType) {
    case "Bill of Supply":
      return "BILL OF SUPPLY";
    case "Proforma Invoice":
      return "PROFORMA INVOICE";
    case "Invoice":
      return "INVOICE";
    case "Tax Invoice":
    default:
      return "TAX INVOICE";
  }
}

function logoSrc(logo: string): string {
  if (!logo) return "";
  if (logo.startsWith("data:")) return logo;
  return `/invoice-logos/${logo}.svg`;
}

export default function GstInvoicePreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const invoiceType = str(data, "invoiceType") || "Tax Invoice";
  // Bill of Supply and plain (non-GST) Invoice carry no tax breakup.
  const hasGst = invoiceType === "Tax Invoice" || invoiceType === "Proforma Invoice";

  const rows = parseItems(data.items);
  const taxable = rows.reduce((s, r) => s + rowAmount(r), 0);
  const gstPct = hasGst ? num(str(data, "gstPct")) : 0;
  const taxType = str(data, "taxType") || "CGST+SGST";
  const isSplit = taxType !== "IGST";

  const halfPct = isSplit ? gstPct / 2 : gstPct;
  const cgst = hasGst && isSplit ? (taxable * halfPct) / 100 : 0;
  const sgst = hasGst && isSplit ? (taxable * halfPct) / 100 : 0;
  const igst = hasGst && !isSplit ? (taxable * gstPct) / 100 : 0;
  const taxTotal = cgst + sgst + igst;
  const total = taxable + taxTotal;

  const amountPaid = num(str(data, "amountPaid"));
  const balance = total - amountPaid;
  const showPayment = amountPaid > 0;

  const bag: Bag = {
    t,
    currency,
    crumpled,
    logo: str(data, "logo"),
    invoiceType,
    title: titleFor(invoiceType),
    hasGst,
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
    dueDate: str(data, "dueDate"),
    placeOfSupply: str(data, "placeOfSupply"),
    rows,
    taxType,
    gstPct,
    notes: str(data, "notes"),
    terms: str(data, "terms"),
    taxable,
    isSplit,
    halfPct,
    cgst,
    sgst,
    igst,
    taxTotal,
    total,
    amountPaid,
    balance,
    showPayment,
  };

  switch (template) {
    case "template-2":
      return <SimpleInvoice {...bag} />;
    case "template-3":
      return <ColoredHeaderInvoice {...bag} />;
    case "template-4":
      return <TwoToneInvoice {...bag} />;
    case "template-5":
      return <MinimalMonoInvoice {...bag} />;
    case "template-6":
      return <CorporateBoxedInvoice {...bag} />;
    case "template-1":
    default:
      return <TaxInvoice {...bag} />;
  }
}

/* ------------------------------------------------------------------ */
/* reusable pieces                                                    */
/* ------------------------------------------------------------------ */

function Logo({ logo, h = 44 }: { logo: string; h?: number }) {
  const src = logoSrc(logo);
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Business logo" style={{ height: h, width: "auto", display: "block", objectFit: "contain" }} />
  );
}

/** Tax + grand-total + amount-paid/balance rows, shared by the newer designs. */
function Totals({ p, accent, width }: { p: Bag; accent: string; width: number }) {
  const { t } = p;
  return (
    <div style={{ width }}>
      <SumRow label="Taxable Value" value={plain(p.taxable, p.currency)} ink={t.ink} muted={t.muted} pad="5px 12px" />
      {p.hasGst ? (
        p.isSplit ? (
          <>
            <SumRow label={`CGST @ ${fmtPct(p.halfPct)}%`} value={plain(p.cgst, p.currency)} ink={t.ink} muted={t.muted} pad="5px 12px" />
            <SumRow label={`SGST @ ${fmtPct(p.halfPct)}%`} value={plain(p.sgst, p.currency)} ink={t.ink} muted={t.muted} pad="5px 12px" />
          </>
        ) : (
          <SumRow label={`IGST @ ${fmtPct(p.gstPct)}%`} value={plain(p.igst, p.currency)} ink={t.ink} muted={t.muted} pad="5px 12px" />
        )
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 12px",
          background: accent,
          color: "#ffffff",
          fontWeight: 800,
          fontSize: 14,
          marginTop: 4,
          borderRadius: 4,
        }}
      >
        <span>{p.showPayment ? "GRAND TOTAL" : "TOTAL"}</span>
        <span>{plain(p.total, p.currency)}</span>
      </div>
      {p.showPayment ? (
        <>
          <SumRow label="Amount Paid" value={plain(p.amountPaid, p.currency)} ink={t.ink} muted={t.muted} pad="6px 12px" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 12px",
              fontWeight: 800,
              color: accent,
              borderTop: `1px solid ${t.muted}`,
            }}
          >
            <span>Balance Due</span>
            <span>{plain(p.balance, p.currency)}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Notes + Terms block. */
function NotesTerms({ p, accent }: { p: Bag; accent: string }) {
  if (!p.notes && !p.terms) return null;
  const { t } = p;
  return (
    <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
      {p.notes ? (
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Notes</div>
          <div style={{ color: t.muted, lineHeight: 1.55, marginTop: 3, whiteSpace: "pre-line" }}>{p.notes}</div>
        </div>
      ) : null}
      {p.terms ? (
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Terms &amp; Conditions</div>
          <div style={{ color: t.muted, lineHeight: 1.55, marginTop: 3, whiteSpace: "pre-line" }}>{p.terms}</div>
        </div>
      ) : null}
    </div>
  );
}

/** Simple bordered items table used by the newer designs. */
function ItemsTable({ p, accent, headInk = "#ffffff" }: { p: Bag; accent: string; headInk?: string }) {
  const { t } = p;
  const cellBorder = `1px solid ${t.muted}`;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 4 }}>
      <thead>
        <tr style={{ background: accent, color: headInk }}>
          <Th w="34" align="center">#</Th>
          <Th align="left">Description</Th>
          {p.hasGst ? <Th w="70" align="center">HSN/SAC</Th> : null}
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
              {p.hasGst ? <Td align="center" border={cellBorder}>{r.hsn || "—"}</Td> : null}
              <Td align="center" border={cellBorder}>{num(r.qty).toLocaleString("en-IN")}</Td>
              <Td align="right" border={cellBorder}>{money(r.rate, p.currency)}</Td>
              <Td align="right" border={cellBorder}>{plain(rowAmount(r), p.currency)}</Td>
            </tr>
          ))
        ) : (
          <tr>
            <Td align="center" border={cellBorder} colSpan={p.hasGst ? 6 : 5}>
              <span style={{ color: t.muted }}>No items added</span>
            </Td>
          </tr>
        )}
      </tbody>
    </table>
  );
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: `2px solid ${t.accent}`,
          padding: "12px 16px 10px",
        }}
      >
        <Logo logo={p.logo} h={42} />
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: t.accent }}>{p.title}</div>
          <div style={{ fontSize: 10, color: t.muted, letterSpacing: 2, textTransform: "uppercase" }}>
            Original for Recipient
          </div>
        </div>
        <div style={{ width: 42 }} />
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
          <MetaLine k="Due Date" v={fmtDMonY(p.dueDate)} ink={t.ink} muted={t.muted} />
          <MetaLine k="Place of Supply" v={p.placeOfSupply} ink={t.ink} muted={t.muted} />
          {p.hasGst ? <MetaLine k="Reverse Charge" v="No" ink={t.ink} muted={t.muted} /> : null}
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
            {p.hasGst ? <Th w="70" align="center">HSN/SAC</Th> : null}
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
                {p.hasGst ? <Td align="center" border={cellBorder}>{r.hsn || "—"}</Td> : null}
                <Td align="center" border={cellBorder}>{num(r.qty).toLocaleString("en-IN")}</Td>
                <Td align="right" border={cellBorder}>{money(r.rate, p.currency)}</Td>
                <Td align="right" border={cellBorder}>{plain(rowAmount(r), p.currency)}</Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td align="center" border={cellBorder} colSpan={p.hasGst ? 6 : 5}>
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
            {p.hasGst
              ? p.taxType === "IGST"
                ? "Inter-state supply (IGST)"
                : "Intra-state supply (CGST + SGST)"
              : p.invoiceType === "Bill of Supply"
                ? "Composition / exempt supply — not eligible to collect tax."
                : "This document is not a GST tax invoice."}
          </div>
          {p.hasGst
            ? `GST charged @ ${fmtPct(p.gstPct)}% on the taxable value. `
            : ""}
          This is a computer-generated invoice. E. &amp; O.E.
        </div>
        <div style={{ width: 280 }}>
          <SumRow label={p.hasGst ? "Taxable Value" : "Subtotal"} value={plain(p.taxable, p.currency)} ink={t.ink} muted={t.muted} />
          {p.hasGst ? (
            p.isSplit ? (
              <>
                <SumRow label={`CGST @ ${fmtPct(p.halfPct)}%`} value={plain(p.cgst, p.currency)} ink={t.ink} muted={t.muted} />
                <SumRow label={`SGST @ ${fmtPct(p.halfPct)}%`} value={plain(p.sgst, p.currency)} ink={t.ink} muted={t.muted} />
              </>
            ) : (
              <SumRow label={`IGST @ ${fmtPct(p.gstPct)}%`} value={plain(p.igst, p.currency)} ink={t.ink} muted={t.muted} />
            )
          ) : null}
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
          {p.showPayment ? (
            <>
              <SumRow label="Amount Paid" value={plain(p.amountPaid, p.currency)} ink={t.ink} muted={t.muted} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 14px",
                  fontWeight: 800,
                  color: t.accent,
                  borderTop: `1px solid ${t.muted}`,
                }}
              >
                <span>Balance Due</span>
                <span>{plain(p.balance, p.currency)}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* notes + terms */}
      {p.notes || p.terms ? (
        <div style={{ padding: "0 14px 4px", borderTop: cellBorder, paddingTop: 12 }}>
          <NotesTerms p={p} accent={t.accent} />
        </div>
      ) : null}

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
          Certified that the particulars given above are true and correct.
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
          <Logo logo={p.logo} h={40} />
          <div style={{ fontSize: 20, fontWeight: 800, color: t.ink, marginTop: p.logo ? 8 : 0 }}>
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
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 2, color: t.accent }}>{p.title}</div>
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
          {p.dueDate ? (
            <div style={{ color: t.ink }}>
              <span style={{ color: t.muted }}>Due: </span>
              {fmtDMY(p.dueDate)}
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
            {p.hasGst ? <th style={{ textAlign: "center", padding: "8px 6px", width: 80 }}>HSN/SAC</th> : null}
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
                {p.hasGst ? (
                  <td style={{ padding: "8px 6px", textAlign: "center", color: t.ink }}>{r.hsn || "—"}</td>
                ) : null}
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
              <td style={{ padding: "10px 6px", color: t.muted, textAlign: "center" }} colSpan={p.hasGst ? 5 : 4}>
                No items added
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <Totals p={p} accent={t.accent} width={270} />
      </div>

      {/* notes + terms */}
      <NotesTerms p={p} accent={t.accent} />

      {/* footer note */}
      <div style={{ borderTop: `1px dashed ${t.muted}`, marginTop: 20, paddingTop: 10 }}>
        <div style={{ color: t.muted, fontSize: 11, lineHeight: 1.5 }}>
          This is a computer-generated invoice and does not require a signature.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 3 — Colored Header (accent band, logo + big title)        */
/* ================================================================== */

function ColoredHeaderInvoice(p: Bag) {
  const { t } = p;
  const accent = C_INDIGO;
  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        overflow: "hidden",
        borderRadius: 8,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* header band */}
      <div style={{ background: accent, color: "#fff", padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.16)", borderRadius: 12, padding: p.logo ? 6 : 0 }}>
            <Logo logo={p.logo} h={40} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{p.sellerName || "Seller Name"}</div>
            {p.sellerGstin ? <div style={{ fontSize: 11, opacity: 0.9 }}>GSTIN: {p.sellerGstin}</div> : null}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>{p.title}</div>
          {p.invoiceNo ? <div style={{ fontSize: 12, opacity: 0.9 }}>{p.invoiceNo}</div> : null}
        </div>
      </div>

      <div style={{ padding: "20px 26px" }}>
        {/* meta row */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Bill To</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: t.ink, marginTop: 2 }}>{p.buyerName || "Buyer Name"}</div>
            {p.buyerAddress ? <div style={{ color: t.muted, lineHeight: 1.5, maxWidth: 300 }}>{p.buyerAddress}</div> : null}
            {p.buyerGstin ? <div style={{ color: t.ink, marginTop: 2 }}><span style={{ color: t.muted }}>GSTIN: </span>{p.buyerGstin}</div> : null}
          </div>
          <div style={{ textAlign: "right", lineHeight: 1.8 }}>
            {p.invoiceDate ? <div><span style={{ color: t.muted }}>Date: </span>{fmtDMY(p.invoiceDate)}</div> : null}
            {p.dueDate ? <div><span style={{ color: t.muted }}>Due: </span>{fmtDMY(p.dueDate)}</div> : null}
            {p.placeOfSupply ? <div><span style={{ color: t.muted }}>Place of Supply: </span>{p.placeOfSupply}</div> : null}
          </div>
        </div>

        <ItemsTable p={p} accent={accent} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <Totals p={p} accent={accent} width={280} />
        </div>

        <NotesTerms p={p} accent={accent} />
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 4 — Modern Two-Tone (left accent stripe)                  */
/* ================================================================== */

function TwoToneInvoice(p: Bag) {
  const { t } = p;
  const accent = C_TEAL;
  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        display: "flex",
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        overflow: "hidden",
        borderRadius: 8,
        ...paperStyle(t, p.crumpled),
      }}
    >
      {/* accent side stripe */}
      <div style={{ width: 10, background: accent }} />
      <div style={{ flex: 1, padding: "24px 26px" }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo logo={p.logo} h={46} />
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: accent }}>{p.sellerName || "Seller Name"}</div>
              {p.sellerAddress ? <div style={{ color: t.muted, lineHeight: 1.4, maxWidth: 260, marginTop: 2 }}>{p.sellerAddress}</div> : null}
              {p.sellerGstin ? <div style={{ color: t.ink, marginTop: 2 }}><span style={{ color: t.muted }}>GSTIN: </span>{p.sellerGstin}</div> : null}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: t.ink }}>{p.title}</div>
            {p.invoiceNo ? <div style={{ color: t.muted, marginTop: 2 }}>{p.invoiceNo}</div> : null}
            {p.invoiceDate ? <div style={{ color: t.muted }}>{fmtDMY(p.invoiceDate)}</div> : null}
            {p.dueDate ? <div style={{ color: t.muted }}>Due {fmtDMY(p.dueDate)}</div> : null}
          </div>
        </div>

        <div style={{ background: `${accent}14`, borderLeft: `3px solid ${accent}`, padding: "10px 14px", margin: "16px 0", borderRadius: 4 }}>
          <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.ink }}>{p.buyerName || "Buyer Name"}</div>
          {p.buyerAddress ? <div style={{ color: t.muted, lineHeight: 1.5 }}>{p.buyerAddress}</div> : null}
          <div style={{ display: "flex", gap: 24, marginTop: 2 }}>
            {p.buyerGstin ? <span><span style={{ color: t.muted }}>GSTIN: </span>{p.buyerGstin}</span> : null}
            {p.placeOfSupply ? <span><span style={{ color: t.muted }}>Place of Supply: </span>{p.placeOfSupply}</span> : null}
          </div>
        </div>

        <ItemsTable p={p} accent={accent} />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <Totals p={p} accent={accent} width={280} />
        </div>

        <NotesTerms p={p} accent={accent} />
      </div>
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 5 — Minimal Mono (thin rules, monochrome)                 */
/* ================================================================== */

function MinimalMonoInvoice(p: Bag) {
  const { t } = p;
  const line = `1px solid ${t.muted}`;
  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12.5,
        padding: 34,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        ...paperStyle(t, p.crumpled),
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Logo logo={p.logo} h={38} />
        <div style={{ fontSize: 13, letterSpacing: 6, textTransform: "uppercase", color: t.ink, fontWeight: 600 }}>{p.title}</div>
      </div>

      <div style={{ marginTop: 22, fontSize: 26, fontWeight: 300, letterSpacing: 1, color: t.ink }}>
        {p.sellerName || "Seller Name"}
      </div>
      {p.sellerAddress ? <div style={{ color: t.muted, marginTop: 2 }}>{p.sellerAddress}</div> : null}
      {p.sellerGstin ? <div style={{ color: t.muted, marginTop: 1 }}>GSTIN {p.sellerGstin}</div> : null}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, borderTop: line, borderBottom: line, padding: "14px 0", margin: "20px 0" }}>
        <div>
          <div style={{ fontSize: 10, color: t.muted, letterSpacing: 2, textTransform: "uppercase" }}>Billed To</div>
          <div style={{ fontWeight: 600, marginTop: 3 }}>{p.buyerName || "Buyer Name"}</div>
          {p.buyerAddress ? <div style={{ color: t.muted, lineHeight: 1.5, maxWidth: 280 }}>{p.buyerAddress}</div> : null}
          {p.buyerGstin ? <div style={{ color: t.muted }}>GSTIN {p.buyerGstin}</div> : null}
        </div>
        <div style={{ textAlign: "right", lineHeight: 1.9, color: t.muted }}>
          {p.invoiceNo ? <div>{p.invoiceNo}</div> : null}
          {p.invoiceDate ? <div>{fmtDMY(p.invoiceDate)}</div> : null}
          {p.dueDate ? <div>Due {fmtDMY(p.dueDate)}</div> : null}
          {p.placeOfSupply ? <div>{p.placeOfSupply}</div> : null}
        </div>
      </div>

      {/* items — borderless */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ color: t.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, borderBottom: line }}>
            <th style={{ textAlign: "left", padding: "6px 4px" }}>Description</th>
            {p.hasGst ? <th style={{ textAlign: "center", padding: "6px 4px", width: 80 }}>HSN</th> : null}
            <th style={{ textAlign: "center", padding: "6px 4px", width: 48 }}>Qty</th>
            <th style={{ textAlign: "right", padding: "6px 4px", width: 92 }}>Rate</th>
            <th style={{ textAlign: "right", padding: "6px 4px", width: 100 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {p.rows.length ? (
            p.rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.muted}33` }}>
                <td style={{ padding: "9px 4px", color: t.ink }}>{r.desc || "—"}</td>
                {p.hasGst ? <td style={{ padding: "9px 4px", textAlign: "center", color: t.muted }}>{r.hsn || "—"}</td> : null}
                <td style={{ padding: "9px 4px", textAlign: "center", color: t.ink }}>{num(r.qty).toLocaleString("en-IN")}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: t.ink }}>{money(r.rate, p.currency)}</td>
                <td style={{ padding: "9px 4px", textAlign: "right", color: t.ink }}>{plain(rowAmount(r), p.currency)}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={p.hasGst ? 5 : 4} style={{ padding: "10px 4px", color: t.muted, textAlign: "center" }}>No items added</td></tr>
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
        <div style={{ width: 260 }}>
          <SumRow label={p.hasGst ? "Taxable Value" : "Subtotal"} value={plain(p.taxable, p.currency)} ink={t.ink} muted={t.muted} pad="4px 2px" />
          {p.hasGst ? (
            p.isSplit ? (
              <>
                <SumRow label={`CGST @ ${fmtPct(p.halfPct)}%`} value={plain(p.cgst, p.currency)} ink={t.ink} muted={t.muted} pad="4px 2px" />
                <SumRow label={`SGST @ ${fmtPct(p.halfPct)}%`} value={plain(p.sgst, p.currency)} ink={t.ink} muted={t.muted} pad="4px 2px" />
              </>
            ) : (
              <SumRow label={`IGST @ ${fmtPct(p.gstPct)}%`} value={plain(p.igst, p.currency)} ink={t.ink} muted={t.muted} pad="4px 2px" />
            )
          ) : null}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 2px", borderTop: `2px solid ${t.ink}`, marginTop: 4, fontWeight: 700, fontSize: 16 }}>
            <span>Total</span>
            <span>{plain(p.total, p.currency)}</span>
          </div>
          {p.showPayment ? (
            <>
              <SumRow label="Amount Paid" value={plain(p.amountPaid, p.currency)} ink={t.ink} muted={t.muted} pad="4px 2px" />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 2px", fontWeight: 700 }}>
                <span>Balance Due</span>
                <span>{plain(p.balance, p.currency)}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <NotesTerms p={p} accent={t.ink} />
    </div>
  );
}

/* ================================================================== */
/* TEMPLATE 6 — Corporate Boxed (navy, fully framed)                  */
/* ================================================================== */

function CorporateBoxedInvoice(p: Bag) {
  const { t } = p;
  const accent = C_SLATE;
  const cellBorder = `1px solid ${t.muted}`;
  return (
    <div
      style={{
        width: 640,
        margin: "0 auto",
        color: t.ink,
        fontFamily: SANS,
        fontSize: 12,
        boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
        border: `2px solid ${accent}`,
        ...paperStyle(t, p.crumpled),
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: `2px solid ${accent}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", flex: 1 }}>
          <Logo logo={p.logo} h={44} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: accent }}>{p.sellerName || "Seller Name"}</div>
            {p.sellerAddress ? <div style={{ color: t.muted, lineHeight: 1.4, marginTop: 2 }}>{p.sellerAddress}</div> : null}
            {p.sellerGstin ? <div style={{ color: t.ink, marginTop: 1 }}><span style={{ color: t.muted }}>GSTIN: </span>{p.sellerGstin}</div> : null}
          </div>
        </div>
        <div style={{ background: accent, color: "#fff", padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 190 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>{p.title}</div>
          {p.invoiceNo ? <div style={{ fontSize: 11, opacity: 0.92, marginTop: 3 }}>No: {p.invoiceNo}</div> : null}
          {p.invoiceDate ? <div style={{ fontSize: 11, opacity: 0.92 }}>Date: {fmtDMY(p.invoiceDate)}</div> : null}
          {p.dueDate ? <div style={{ fontSize: 11, opacity: 0.92 }}>Due: {fmtDMY(p.dueDate)}</div> : null}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: cellBorder }}>
        <div style={{ flex: 1, padding: "10px 16px", borderRight: cellBorder }}>
          <div style={{ fontSize: 10, color: accent, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.ink, marginTop: 2 }}>{p.buyerName || "Buyer Name"}</div>
          {p.buyerAddress ? <div style={{ color: t.muted, lineHeight: 1.5 }}>{p.buyerAddress}</div> : null}
          {p.buyerGstin ? <div style={{ color: t.ink, marginTop: 2 }}><span style={{ color: t.muted }}>GSTIN: </span>{p.buyerGstin}</div> : null}
        </div>
        <div style={{ flex: 1, padding: "10px 16px", lineHeight: 1.8 }}>
          {p.placeOfSupply ? <div><span style={{ color: t.muted }}>Place of Supply: </span>{p.placeOfSupply}</div> : null}
          {p.buyerState ? <div><span style={{ color: t.muted }}>State: </span>{p.buyerState}</div> : null}
          <div><span style={{ color: t.muted }}>Supply: </span>{p.hasGst ? (p.taxType === "IGST" ? "Inter-state (IGST)" : "Intra-state (CGST+SGST)") : "—"}</div>
        </div>
      </div>

      <div style={{ padding: "0 0 4px" }}>
        <ItemsTable p={p} accent={accent} />
      </div>

      <div style={{ display: "flex", borderTop: cellBorder }}>
        <div style={{ flex: 1, padding: "12px 16px", borderRight: cellBorder }}>
          <NotesTerms p={p} accent={accent} />
        </div>
        <div style={{ width: 280, padding: 12 }}>
          <Totals p={p} accent={accent} width={256} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 16px 18px", borderTop: cellBorder }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${t.ink}`, width: 180, paddingTop: 4, color: t.muted, fontSize: 11 }}>
            For {p.sellerName || "the Seller"}
            <div style={{ fontSize: 10 }}>Authorised Signatory</div>
          </div>
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
