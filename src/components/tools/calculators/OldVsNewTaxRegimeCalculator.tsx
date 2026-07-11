"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
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

function slabTax(taxable: number, slabs: Slab[]) {
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of slabs) {
    if (taxable > prev) tax += ((Math.min(taxable, upTo) - prev) * rate) / 100;
    prev = upTo;
  }
  return tax;
}

// Total tax including 87A rebate (with marginal relief) and 4% cess.
function newRegimeTax(taxable: number) {
  const tax = slabTax(taxable, NEW_SLABS);
  const afterRebate = taxable <= 1200000 ? 0 : Math.min(tax, taxable - 1200000);
  return afterRebate * 1.04;
}

function oldRegimeTax(taxable: number) {
  const tax = slabTax(taxable, OLD_SLABS);
  const afterRebate = taxable <= 500000 ? 0 : tax;
  return afterRebate * 1.04;
}

export default function OldVsNewTaxRegimeCalculator() {
  const [salary, setSalary] = useState<number | "">(1600000);
  const [ded80c, setDed80c] = useState<number | "">(150000);
  const [ded80d, setDed80d] = useState<number | "">(25000);
  const [hra, setHra] = useState<number | "">(120000);
  const [homeLoan, setHomeLoan] = useState<number | "">(200000);
  const [otherDed, setOtherDed] = useState<number | "">(0);

  const gross = Number(salary) || 0;
  const oldDeductions =
    Math.min(Number(ded80c) || 0, 150000) +
    (Number(ded80d) || 0) +
    (Number(hra) || 0) +
    Math.min(Number(homeLoan) || 0, 200000) +
    (Number(otherDed) || 0);

  const taxableNew = Math.max(0, gross - Math.min(75000, gross));
  const taxableOld = Math.max(0, gross - Math.min(50000, gross) - oldDeductions);

  const taxNew = newRegimeTax(taxableNew);
  const taxOld = oldRegimeTax(taxableOld);
  const savings = Math.abs(taxOld - taxNew);
  const winner = taxNew < taxOld ? "NEW" : taxOld < taxNew ? "OLD" : null;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Annual gross salary"
            prefix="₹"
            value={salary}
            onChange={setSalary}
          />
          <NumberField
            label="Section 80C investments"
            prefix="₹"
            value={ded80c}
            onChange={setDed80c}
            hint="Capped at ₹1,50,000 — used only in the old regime"
          />
          <NumberField
            label="Section 80D (health insurance)"
            prefix="₹"
            value={ded80d}
            onChange={setDed80d}
          />
          <NumberField
            label="HRA exemption"
            prefix="₹"
            value={hra}
            onChange={setHra}
          />
          <NumberField
            label="Home loan interest (Sec 24b)"
            prefix="₹"
            value={homeLoan}
            onChange={setHomeLoan}
            hint="Capped at ₹2,00,000 for self-occupied property"
          />
          <NumberField
            label="Other deductions (80CCD(1B), 80G etc.)"
            prefix="₹"
            value={otherDed}
            onChange={setOtherDed}
          />
        </>
      }
      results={
        <>
          <BigResult
            label={
              winner
                ? `You save with the ${winner} regime`
                : "Both regimes cost the same"
            }
            value={inr(savings)}
            accent={winner === "OLD"}
          />
          <ResultCard title="Side by side (FY 2025-26)">
            <ResultRow label="Taxable income — new regime" value={inr(taxableNew)} />
            <ResultRow
              label="Tax — new regime (incl. cess)"
              value={inr(taxNew)}
              bold={winner === "NEW"}
            />
            <ResultRow label="Taxable income — old regime" value={inr(taxableOld)} />
            <ResultRow
              label="Tax — old regime (incl. cess)"
              value={inr(taxOld)}
              bold={winner === "OLD"}
            />
            <ResultRow label="Difference" value={inr(savings)} bold />
          </ResultCard>
          <ToolNote>
            FY 2025-26 rules: new regime — ₹75,000 standard deduction, 87A rebate
            up to ₹12L taxable income (with marginal relief); old regime — ₹50,000
            standard deduction, 87A rebate up to ₹5L, plus the deductions you
            enter. Includes 4% cess; excludes surcharge. Estimates only — confirm
            with your CA before choosing a regime.
          </ToolNote>
        </>
      }
    />
  );
}
