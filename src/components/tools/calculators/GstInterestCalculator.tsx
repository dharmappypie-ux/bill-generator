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

export default function GstInterestCalculator() {
  const [taxDue, setTaxDue] = useState<number | "">(50000);
  const [days, setDays] = useState<number | "">(30);
  const [rate, setRate] = useState<"18" | "24">("18");

  const tax = Number(taxDue) || 0;
  const d = Math.max(0, Number(days) || 0);
  const r = Number(rate);

  const interest = (tax * r * d) / (100 * 365);
  const total = tax + interest;
  const perDay = (tax * r) / (100 * 365);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Tax amount due"
            prefix="₹"
            value={taxDue}
            onChange={setTaxDue}
            hint="Net GST liability paid late (after ITC set-off)."
          />
          <NumberField
            label="Days delayed"
            suffix="days"
            value={days}
            onChange={setDays}
            min={0}
            step={1}
            hint="Number of days from the due date to the actual payment date."
          />
          <ToggleGroup
            label="Interest rate"
            value={rate}
            onChange={(v) => setRate(v as "18" | "24")}
            options={[
              { value: "18", label: "18% — delayed payment" },
              { value: "24", label: "24% — excess ITC claimed" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Interest payable" value={inr(interest, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="Tax amount due" value={inr(tax, 2)} />
            <ResultRow label="Interest rate" value={`${r}% p.a.`} />
            <ResultRow label="Days delayed" value={`${d} days`} />
            <ResultRow label="Interest per day" value={inr(perDay, 2)} />
            <ResultRow label={`Interest for ${d} days`} value={inr(interest, 2)} />
            <ResultRow label="Total payable (tax + interest)" value={inr(total, 2)} bold />
          </ResultCard>
          <ToolNote>
            Interest under Section 50 of the CGST Act is simple interest,
            calculated day-wise: tax × rate × days ÷ 365. 18% p.a. applies to
            delayed tax payment and 24% p.a. to excess ITC claimed or excess
            output tax reduction. Verify the exact days and liability with your
            CA or the GST portal.
          </ToolNote>
        </>
      }
    />
  );
}
