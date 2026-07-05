import { PreviewProps } from "@/types/generator";
import {
  str,
  num,
  plain,
  fmtDMonY,
  fmtDMY,
  paperStyle,
  KV,
  Divider,
} from "./shared";
import { themeById } from "@/lib/themes";

export default function WifiBillPreview(props: PreviewProps) {
  const { data, theme, template, crumpled, currency } = props;
  const t = themeById(theme);

  const providerName = str(data, "providerName") || "Provider Name";
  const customerName = str(data, "customerName");
  const planName = str(data, "planName");
  const speed = str(data, "speed");
  const validFrom = str(data, "validFrom");
  const validTo = str(data, "validTo");
  const invoiceNo = str(data, "invoiceNo");
  const date = str(data, "date");
  const paymentMethod = str(data, "paymentMethod");

  const amount = num(str(data, "amount"));
  const tax = num(str(data, "tax"));
  const total = amount + tax;

  // ---------------------------------------------------------------- Invoice
  if (template === "template-2") {
    return (
      <div
        style={{
          ...paperStyle(t, crumpled),
          color: t.ink,
          width: 640,
          margin: "0 auto",
          padding: 36,
          fontFamily: "Product Sans, Montserrat, Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: t.accent,
                lineHeight: 1.1,
              }}
            >
              {providerName}
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>
              Broadband &amp; Fiber Internet Services
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
              Plot 14, Sector 62, Noida, UP 201301
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
              GSTIN: 09AABCJ2354N1Z8
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                color: t.ink,
              }}
            >
              INVOICE
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 8 }}>
              #{invoiceNo || "—"}
            </div>
            <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
              {fmtDMonY(date)}
            </div>
          </div>
        </div>

        {/* bill to */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            padding: "14px 0",
            borderTop: `2px solid ${t.accent}`,
            borderBottom: `1px solid ${t.muted}`,
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: t.muted,
                marginBottom: 4,
              }}
            >
              Billed To
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {customerName || "—"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: t.muted,
                marginBottom: 4,
              }}
            >
              Billing Period
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {fmtDMY(validFrom)} &mdash; {fmtDMY(validTo)}
            </div>
          </div>
        </div>

        {/* line items table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            marginBottom: 18,
          }}
        >
          <thead>
            <tr style={{ background: t.accent, color: t.paper }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                }}
              >
                Speed
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "10px 12px",
                  fontWeight: 600,
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${t.muted}` }}>
              <td style={{ padding: "12px" }}>
                <div style={{ fontWeight: 600 }}>
                  {planName || "Internet Plan"}
                </div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
                  Wi-Fi / Fiber Monthly Subscription
                </div>
              </td>
              <td style={{ padding: "12px" }}>{speed || "—"}</td>
              <td style={{ padding: "12px", textAlign: "right" }}>
                {plain(amount, currency)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 260 }}>
            <KV
              k="Subtotal"
              v={plain(amount, currency)}
              ink={t.ink}
              muted={t.muted}
            />
            <KV
              k="GST (18%)"
              v={plain(tax, currency)}
              ink={t.ink}
              muted={t.muted}
            />
            <Divider color={t.muted} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                fontWeight: 700,
                fontSize: 16,
                color: t.accent,
              }}
            >
              <span>Total Due</span>
              <span>{plain(total, currency)}</span>
            </div>
          </div>
        </div>

        <Divider color={t.muted} />

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
            fontSize: 12,
            color: t.muted,
          }}
        >
          <div>
            Payment Method:{" "}
            <span style={{ color: t.ink, fontWeight: 600 }}>
              {paymentMethod || "—"}
            </span>
          </div>
          <div>Status: PAID</div>
        </div>
        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            fontSize: 11,
            color: t.muted,
          }}
        >
          Thank you for staying connected with {providerName}. This is a
          computer-generated invoice.
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- Receipt
  return (
    <div
      style={{
        ...paperStyle(t, crumpled),
        color: t.ink,
        width: 380,
        margin: "0 auto",
        padding: 28,
        fontFamily: "Product Sans, Montserrat, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* header banner */}
      <div
        style={{
          background: t.accent,
          color: t.paper,
          margin: "-28px -28px 18px -28px",
          padding: "20px 28px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.85 }}>
          PAYMENT RECEIPT
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
          {providerName}
        </div>
        <div style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>
          Wi-Fi &amp; Broadband Services
        </div>
      </div>

      {/* amount hero block */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1 }}>
          AMOUNT PAID
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: t.accent,
            lineHeight: 1.1,
          }}
        >
          {plain(total, currency)}
        </div>
      </div>

      <Divider color={t.muted} />

      {/* meta */}
      <KV k="Receipt No." v={invoiceNo || "—"} ink={t.ink} muted={t.muted} />
      <KV k="Date" v={fmtDMonY(date)} ink={t.ink} muted={t.muted} />
      <KV k="Customer" v={customerName || "—"} ink={t.ink} muted={t.muted} />
      <KV k="Payment" v={paymentMethod || "—"} ink={t.ink} muted={t.muted} />

      <Divider color={t.muted} />

      {/* plan block */}
      <div
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: t.muted,
          marginBottom: 6,
        }}
      >
        Plan Details
      </div>
      <KV k="Plan" v={planName || "—"} ink={t.ink} muted={t.muted} />
      <KV k="Speed" v={speed || "—"} ink={t.ink} muted={t.muted} />
      <KV k="Valid From" v={fmtDMY(validFrom)} ink={t.ink} muted={t.muted} />
      <KV k="Valid To" v={fmtDMY(validTo)} ink={t.ink} muted={t.muted} />

      <Divider color={t.muted} />

      {/* charges */}
      <KV k="Plan Amount" v={plain(amount, currency)} ink={t.ink} muted={t.muted} />
      <KV k="GST (18%)" v={plain(tax, currency)} ink={t.ink} muted={t.muted} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 0",
          marginTop: 2,
          borderTop: `2px dashed ${t.muted}`,
          fontWeight: 700,
          fontSize: 16,
          color: t.accent,
        }}
      >
        <span>TOTAL</span>
        <span>{plain(total, currency)}</span>
      </div>

      <div
        style={{
          marginTop: 16,
          textAlign: "center",
          fontSize: 11,
          color: t.muted,
        }}
      >
        Thank you for your payment!
        <br />
        Stay connected with {providerName}.
      </div>
    </div>
  );
}
