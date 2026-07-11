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

// New-regime FY 2025-26 slabs (rates in percent) for the quick estimate mode.
const NEW_SLABS: { upTo: number; rate: number }[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

function estimateNewRegimeTax(income: number) {
  const taxable = Math.max(0, income - Math.min(75000, income));
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of NEW_SLABS) {
    if (taxable > prev) tax += ((Math.min(taxable, upTo) - prev) * rate) / 100;
    prev = upTo;
  }
  const afterRebate = taxable <= 1200000 ? 0 : Math.min(tax, taxable - 1200000);
  return afterRebate * 1.04; // + 4% cess
}

const INSTALMENTS = [
  { due: "15 Jun 2025", pct: 15 },
  { due: "15 Sep 2025", pct: 45 },
  { due: "15 Dec 2025", pct: 75 },
  { due: "15 Mar 2026", pct: 100 },
];

export default function AdvanceTaxCalculator() {
  const [mode, setMode] = useState<"tax" | "income">("tax");
  const [taxLiability, setTaxLiability] = useState<number | "">(150000);
  const [income, setIncome] = useState<number | "">(2000000);
  const [tds, setTds] = useState<number | "">(30000);

  const annualTax =
    mode === "tax"
      ? Number(taxLiability) || 0
      : estimateNewRegimeTax(Number(income) || 0);
  const tdsAmt = Number(tds) || 0;
  const net = Math.max(0, annualTax - tdsAmt);
  const payable = net >= 10000;

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="How do you want to start?"
            value={mode}
            onChange={(v) => setMode(v as "tax" | "income")}
            options={[
              { value: "tax", label: "I know my annual tax" },
              { value: "income", label: "Estimate from income (new regime)" },
            ]}
          />
          {mode === "tax" ? (
            <NumberField
              label="Estimated annual tax liability (incl. cess)"
              prefix="₹"
              value={taxLiability}
              onChange={setTaxLiability}
            />
          ) : (
            <NumberField
              label="Estimated annual income (FY 2025-26)"
              prefix="₹"
              value={income}
              onChange={setIncome}
              hint="Tax is estimated under the new regime with ₹75,000 standard deduction"
            />
          )}
          <NumberField
            label="TDS / TCS already deducted"
            prefix="₹"
            value={tds}
            onChange={setTds}
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Net advance tax for FY 2025-26"
            value={inr(net)}
            accent={!payable}
          />
          <ResultCard title="Instalment schedule">
            <ResultRow label="Estimated annual tax" value={inr(annualTax)} />
            <ResultRow label="TDS / TCS deducted" value={inr(tdsAmt)} negative />
            <ResultRow label="Net tax liability" value={inr(net)} bold />
            {payable ? (
              INSTALMENTS.map(({ due, pct }) => (
                <ResultRow
                  key={due}
                  label={`By ${due} — ${pct}% cumulative`}
                  value={inr((net * pct) / 100)}
                />
              ))
            ) : (
              <ResultRow
                label="Advance tax not applicable (net liability below ₹10,000)"
                value="—"
              />
            )}
          </ResultCard>
          <ToolNote>
            Advance tax applies when net tax liability for the year is ₹10,000 or
            more, payable 15% / 45% / 75% / 100% cumulatively by the four due
            dates. Presumptive taxpayers (44AD/44ADA) may pay 100% by 15 Mar.
            Shortfalls attract interest u/s 234B/234C — verify with your CA.
          </ToolNote>
        </>
      }
    />
  );
}
