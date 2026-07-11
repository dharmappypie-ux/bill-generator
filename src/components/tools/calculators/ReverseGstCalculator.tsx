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

export default function ReverseGstCalculator() {
  const [amount, setAmount] = useState<number | "">(11800);
  const [rate, setRate] = useState("18");
  const [supply, setSupply] = useState<"intra" | "inter">("intra");

  const amt = Number(amount) || 0;
  const r = Number(rate);

  const base = amt / (1 + r / 100);
  const gst = amt - base;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="GST-inclusive amount"
            prefix="₹"
            value={amount}
            onChange={setAmount}
            hint="The final price you paid or charged, including GST."
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
          <BigResult label="Base price (before GST)" value={inr(base, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="GST-inclusive amount" value={inr(amt, 2)} />
            <ResultRow label={`GST portion @ ${r}%`} value={inr(gst, 2)} />
            {supply === "intra" ? (
              <>
                <ResultRow label={`CGST @ ${r / 2}%`} value={inr(gst / 2, 2)} />
                <ResultRow label={`SGST @ ${r / 2}%`} value={inr(gst / 2, 2)} />
              </>
            ) : (
              <ResultRow label={`IGST @ ${r}%`} value={inr(gst, 2)} />
            )}
            <ResultRow label="Base price" value={inr(base, 2)} bold />
          </ResultCard>
          <ToolNote>
            Base price = inclusive amount ÷ (1 + GST rate). GST rates are set by
            the GST Council and may change — verify with your CA or the official
            GST portal before invoicing or filing.
          </ToolNote>
        </>
      }
    />
  );
}
