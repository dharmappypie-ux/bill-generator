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

// FY 2025-26 (AY 2026-27) slabs. Rates are in percent.
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

const lakh = (n: number) => `₹${n / 100000}L`;

function slabBreakup(taxable: number, slabs: Slab[]) {
  const rows: { label: string; tax: number }[] = [];
  let prev = 0;
  for (const { upTo, rate } of slabs) {
    if (taxable > prev && rate > 0) {
      rows.push({
        label:
          upTo === Infinity
            ? `Above ${lakh(prev)} @ ${rate}%`
            : `${lakh(prev)} – ${lakh(upTo)} @ ${rate}%`,
        tax: ((Math.min(taxable, upTo) - prev) * rate) / 100,
      });
    }
    prev = upTo;
  }
  return rows;
}

export default function IncomeTaxCalculator() {
  const [salary, setSalary] = useState<number | "">(1500000);
  const [otherIncome, setOtherIncome] = useState<number | "">(0);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [ded80c, setDed80c] = useState<number | "">(150000);
  const [ded80d, setDed80d] = useState<number | "">(25000);
  const [hra, setHra] = useState<number | "">(0);
  const [homeLoan, setHomeLoan] = useState<number | "">(0);

  const sal = Number(salary) || 0;
  const other = Number(otherIncome) || 0;
  const gross = sal + other;

  const stdDeduction = Math.min(regime === "new" ? 75000 : 50000, sal);
  const oldDeductions =
    regime === "old"
      ? Math.min(Number(ded80c) || 0, 150000) +
        (Number(ded80d) || 0) +
        (Number(hra) || 0) +
        Math.min(Number(homeLoan) || 0, 200000)
      : 0;

  const taxable = Math.max(0, gross - stdDeduction - oldDeductions);
  const breakup = slabBreakup(taxable, regime === "new" ? NEW_SLABS : OLD_SLABS);
  const slabTax = breakup.reduce((sum, row) => sum + row.tax, 0);

  // Section 87A rebate (with marginal relief in the new regime).
  const afterRebate =
    regime === "new"
      ? taxable <= 1200000
        ? 0
        : Math.min(slabTax, taxable - 1200000)
      : taxable <= 500000
        ? 0
        : slabTax;
  const rebate = slabTax - afterRebate;
  const cess = afterRebate * 0.04;
  const totalTax = afterRebate + cess;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="Tax regime (FY 2025-26)"
            value={regime}
            onChange={(v) => setRegime(v as "new" | "old")}
            options={[
              { value: "new", label: "New regime (default)" },
              { value: "old", label: "Old regime" },
            ]}
          />
          <NumberField
            label="Annual gross salary"
            prefix="₹"
            value={salary}
            onChange={setSalary}
          />
          <NumberField
            label="Other income (interest, rent etc.)"
            prefix="₹"
            value={otherIncome}
            onChange={setOtherIncome}
          />
          {regime === "old" && (
            <>
              <NumberField
                label="Section 80C investments"
                prefix="₹"
                value={ded80c}
                onChange={setDed80c}
                hint="PPF, ELSS, LIC etc. — capped at ₹1,50,000"
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
            </>
          )}
        </>
      }
      results={
        <>
          <BigResult label="Total income tax (FY 2025-26)" value={inr(totalTax)} />
          <ResultCard title="Breakup">
            <ResultRow label="Gross income" value={inr(gross)} />
            <ResultRow label="Standard deduction" value={inr(stdDeduction)} negative />
            {regime === "old" && (
              <ResultRow label="Chapter VI-A + other deductions" value={inr(oldDeductions)} negative />
            )}
            <ResultRow label="Taxable income" value={inr(taxable)} bold />
            {breakup.map((row) => (
              <ResultRow key={row.label} label={row.label} value={inr(row.tax)} />
            ))}
            {rebate > 0 && (
              <ResultRow label="Rebate u/s 87A" value={inr(rebate)} negative />
            )}
            <ResultRow label="Health & education cess @ 4%" value={inr(cess)} />
            <ResultRow label="Total tax payable" value={inr(totalTax)} bold />
            <ResultRow label="Effective tax rate" value={`${effectiveRate.toFixed(1)}%`} />
            <ResultRow label="Approx. monthly TDS" value={inr(totalTax / 12)} />
          </ResultCard>
          <ToolNote>
            Uses FY 2025-26 slabs: new regime with ₹75,000 standard deduction and
            Section 87A rebate (zero tax up to ₹12L taxable income, with marginal
            relief), old regime with ₹50,000 standard deduction and rebate up to
            ₹5L. Surcharge on income above ₹50L is not included — verify with your
            CA before filing.
          </ToolNote>
        </>
      }
    />
  );
}
