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

type Slab = { upTo: number; rate: number };

// FY 2025-26 slabs. Rates are in percent.
const NEW_SLABS: Slab[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

const OLD_SLABS: Slab[] = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 5 },
  { upTo: 1000000, rate: 20 },
  { upTo: Infinity, rate: 30 },
];

function taxBeforeCess(regime: "new" | "old", taxable: number) {
  const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of slabs) {
    if (taxable > prev) tax += ((Math.min(taxable, upTo) - prev) * rate) / 100;
    prev = upTo;
  }
  // Section 87A rebate (marginal relief in the new regime).
  if (regime === "new") {
    return taxable <= 1200000 ? 0 : Math.min(tax, taxable - 1200000);
  }
  return taxable <= 500000 ? 0 : tax;
}

export default function TdsCalculator() {
  const [ctc, setCtc] = useState<number | "">(1500000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [deductions, setDeductions] = useState<number | "">(200000);

  const gross = Number(ctc) || 0;
  const stdDeduction = Math.min(regime === "new" ? 75000 : 50000, gross);
  const otherDeductions = regime === "old" ? Number(deductions) || 0 : 0;
  const taxable = Math.max(0, gross - stdDeduction - otherDeductions);

  const basicTax = taxBeforeCess(regime, taxable);
  const cess = basicTax * 0.04;
  const annualTax = basicTax + cess;
  const monthlyTds = annualTax / 12;
  const effectiveRate = gross > 0 ? (annualTax / gross) * 100 : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Annual CTC / gross salary"
            prefix="₹"
            value={ctc}
            onChange={setCtc}
          />
          <ToggleGroup
            label="Tax regime (FY 2025-26)"
            value={regime}
            onChange={(v) => setRegime(v as "new" | "old")}
            options={[
              { value: "new", label: "New regime (default)" },
              { value: "old", label: "Old regime" },
            ]}
          />
          {regime === "old" && (
            <NumberField
              label="Total deductions (80C, 80D, HRA etc.)"
              prefix="₹"
              value={deductions}
              onChange={setDeductions}
              hint="Sum of all exemptions and Chapter VI-A deductions you claim"
            />
          )}
        </>
      }
      results={
        <>
          <BigResult label="Monthly TDS on salary" value={inr(monthlyTds)} />
          <ResultCard title="How it is worked out">
            <ResultRow label="Gross salary" value={inr(gross)} />
            <ResultRow label="Standard deduction" value={inr(stdDeduction)} negative />
            {regime === "old" && (
              <ResultRow label="Other deductions" value={inr(otherDeductions)} negative />
            )}
            <ResultRow label="Taxable income" value={inr(taxable)} bold />
            <ResultRow label="Income tax (after 87A rebate)" value={inr(basicTax)} />
            <ResultRow label="Health & education cess @ 4%" value={inr(cess)} />
            <ResultRow label="Annual tax" value={inr(annualTax)} bold />
            <ResultRow label="Effective tax rate" value={`${effectiveRate.toFixed(1)}%`} />
            <ResultRow label="Monthly TDS (annual tax ÷ 12)" value={inr(monthlyTds)} bold />
          </ResultCard>
          <ToolNote>
            Estimates salary TDS u/s 192 by spreading the FY 2025-26 annual tax
            evenly over 12 months. New regime: ₹75,000 standard deduction, zero
            tax up to ₹12L taxable income; old regime: ₹50,000 standard deduction
            plus your declared deductions. Actual employer TDS varies with
            joining month, bonuses and investment proofs.
          </ToolNote>
        </>
      }
    />
  );
}
