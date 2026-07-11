"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  ToggleGroup,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

export default function GstInvoiceValueCalculator() {
  const [price, setPrice] = useState<number | "">(1000);
  const [qty, setQty] = useState<number | "">(5);
  const [discount, setDiscount] = useState<number | "">(10);
  const [rate, setRate] = useState("18");
  const [supply, setSupply] = useState<"intra" | "inter">("intra");

  const p = Number(price) || 0;
  const q = Number(qty) || 0;
  const d = Number(discount) || 0;
  const r = Number(rate);

  const gross = p * q;
  const discountAmt = gross * (d / 100);
  const taxable = gross - discountAmt;
  const gst = taxable * (r / 100);
  const total = taxable + gst;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Item price (per unit)"
            prefix="₹"
            value={price}
            onChange={setPrice}
          />
          <NumberField label="Quantity" value={qty} onChange={setQty} min={0} step={1} />
          <NumberField
            label="Discount"
            suffix="%"
            value={discount}
            onChange={setDiscount}
            hint="Discount applied on the gross amount before GST."
          />
          <ToggleGroup
            label="GST rate"
            value={rate}
            onChange={setRate}
            options={["0.25", "3", "5", "12", "18", "28"].map((v) => ({
              value: v,
              label: `${v}%`,
            }))}
          />
          <ToggleGroup
            label="Type of supply"
            value={supply}
            onChange={(v) => setSupply(v as "intra" | "inter")}
            options={[
              { value: "intra", label: "Within state (CGST + SGST)" },
              { value: "inter", label: "Interstate (IGST)" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Total invoice value" value={inr(total, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label={`Gross amount (${q} × ${inr(p, 2)})`} value={inr(gross, 2)} />
            <ResultRow label={`Discount @ ${d}%`} value={inr(discountAmt, 2)} negative />
            <ResultRow label="Taxable value" value={inr(taxable, 2)} />
            {supply === "intra" ? (
              <>
                <ResultRow label={`CGST @ ${r / 2}%`} value={inr(gst / 2, 2)} />
                <ResultRow label={`SGST @ ${r / 2}%`} value={inr(gst / 2, 2)} />
              </>
            ) : (
              <ResultRow label={`IGST @ ${r}%`} value={inr(gst, 2)} />
            )}
            <ResultRow label="Invoice total" value={inr(total, 2)} bold />
          </ResultCard>
          <ToolNote>
            GST is charged on the taxable value after discount, as discounts
            shown on the invoice are deductible under Section 15 of the CGST
            Act. Rates change from time to time — confirm with your CA before
            issuing the invoice.
          </ToolNote>
        </>
      }
    />
  );
}
