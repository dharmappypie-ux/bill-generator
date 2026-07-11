"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  SelectField,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

const BUSINESS_TYPES: Record<
  string,
  { label: string; rate: number; limit: number; limitLabel: string }
> = {
  trader: {
    label: "Trader / Manufacturer (1%)",
    rate: 1,
    limit: 15000000,
    limitLabel: "₹1.5 crore",
  },
  restaurant: {
    label: "Restaurant, not serving alcohol (5%)",
    rate: 5,
    limit: 15000000,
    limitLabel: "₹1.5 crore",
  },
  services: {
    label: "Other services (6%)",
    rate: 6,
    limit: 5000000,
    limitLabel: "₹50 lakh",
  },
};

export default function GstCompositionSchemeCalculator() {
  const [turnover, setTurnover] = useState<number | "">(8000000);
  const [type, setType] = useState("trader");

  const t = Number(turnover) || 0;
  const biz = BUSINESS_TYPES[type];
  const eligible = t > 0 && t <= biz.limit;
  const tax = eligible ? t * (biz.rate / 100) : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Annual aggregate turnover"
            prefix="₹"
            value={turnover}
            onChange={setTurnover}
            hint="Turnover across all GSTINs on the same PAN in the financial year."
          />
          <SelectField
            label="Business type"
            value={type}
            onChange={setType}
            options={Object.entries(BUSINESS_TYPES).map(([value, o]) => ({
              value,
              label: o.label,
            }))}
            hint={`Turnover limit for this category: ${biz.limitLabel}.`}
          />
        </>
      }
      results={
        <>
          <BigResult
            label={eligible ? "Composition tax payable" : "Not eligible"}
            value={eligible ? inr(tax, 2) : "—"}
            accent={!eligible}
          />
          <ResultCard title="Details">
            <ResultRow label="Annual turnover" value={inr(t)} />
            <ResultRow label="Turnover limit" value={biz.limitLabel} />
            <ResultRow
              label="Eligibility"
              value={eligible ? "Eligible ✓" : "Turnover exceeds limit ✗"}
              bold
            />
            <ResultRow label="Composition rate" value={`${biz.rate}% of turnover`} />
            <ResultRow
              label="Tax payable per year"
              value={eligible ? inr(tax, 2) : "—"}
              bold
            />
            <ResultRow
              label="Tax payable per quarter (approx.)"
              value={eligible ? inr(tax / 4, 2) : "—"}
            />
          </ResultCard>
          <ToolNote>
            Composition scheme limits: ₹1.5 crore for goods and restaurants
            (₹75 lakh in some special-category states) and ₹50 lakh for other
            service providers under Section 10(2A). Composition dealers cannot
            collect GST from customers or claim ITC, and cannot make interstate
            outward supplies. Confirm eligibility with your CA.
          </ToolNote>
        </>
      }
    />
  );
}
