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

/** Income tax under the new regime, FY 2025-26 (incl. 87A rebate + 4% cess). */
function newRegimeTax(taxableIncome: number) {
  const slabs: [number, number][] = [
    [400000, 0],
    [400000, 0.05],
    [400000, 0.1],
    [400000, 0.15],
    [400000, 0.2],
    [400000, 0.25],
    [Infinity, 0.3],
  ];
  let remaining = taxableIncome;
  let tax = 0;
  for (const [width, rate] of slabs) {
    if (remaining <= 0) break;
    const chunk = Math.min(remaining, width);
    tax += chunk * rate;
    remaining -= chunk;
  }
  if (taxableIncome <= 1200000) tax = 0; // Section 87A rebate
  else tax = Math.min(tax, taxableIncome - 1200000); // marginal relief
  return tax * 1.04; // 4% health & education cess
}

export default function CtcCalculator() {
  const [ctc, setCtc] = useState<number | "">(1200000);
  const [basicPct, setBasicPct] = useState<number | "">(40);
  const [metro, setMetro] = useState<"metro" | "nonmetro">("metro");

  const annualCtc = Number(ctc) || 0;
  const pct = Math.min(Math.max(Number(basicPct) || 0, 0), 100);

  const basic = annualCtc * (pct / 100);
  const hra = basic * (metro === "metro" ? 0.5 : 0.4);
  const employerPf = basic * 0.12;
  const gratuity = basic * 0.0481;
  const fixedComponents = basic + hra + employerPf + gratuity;
  // If basic % is set so high that basic + HRA + employer PF + gratuity exceed
  // the CTC, the structure is impossible — flag it instead of showing wrong numbers.
  const structureInvalid = annualCtc > 0 && fixedComponents > annualCtc;
  const special = Math.max(annualCtc - fixedComponents, 0);

  const grossSalary = basic + hra + special;
  const employeePf = basic * 0.12;
  const profTax = 2400; // ₹200/month, indicative
  const taxable = Math.max(grossSalary - 75000, 0); // standard deduction
  const incomeTax = newRegimeTax(taxable);

  const annualInHand = Math.max(grossSalary - employeePf - profTax - incomeTax, 0);
  const monthlyInHand = annualInHand / 12;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Annual CTC"
            prefix="₹"
            value={ctc}
            onChange={setCtc}
            hint="Total cost to company per year, including employer PF and gratuity."
          />
          <NumberField
            label="Basic salary (% of CTC)"
            suffix="%"
            value={basicPct}
            onChange={setBasicPct}
            hint="Most companies keep basic at 40–50% of CTC."
          />
          <ToggleGroup
            label="City type (for HRA)"
            value={metro}
            onChange={(v) => setMetro(v as "metro" | "nonmetro")}
            options={[
              { value: "metro", label: "Metro (HRA 50% of basic)" },
              { value: "nonmetro", label: "Non-metro (HRA 40%)" },
            ]}
          />
        </>
      }
      results={
        structureInvalid ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
            Basic salary of {pct.toFixed(0)}% is too high for this CTC: basic, HRA,
            employer PF and gratuity alone add up to {inr(fixedComponents)}, which
            exceeds the CTC of {inr(annualCtc)}. Lower the basic % (most companies
            keep it at 40–50% of CTC) to see a valid structure.
          </div>
        ) : (
        <>
          <BigResult label="Estimated monthly in-hand" value={inr(monthlyInHand)} />
          <ResultCard title="Salary structure (annual)">
            <ResultRow label={`Basic salary (${pct.toFixed(0)}% of CTC)`} value={inr(basic)} />
            <ResultRow label={`HRA (${metro === "metro" ? "50" : "40"}% of basic)`} value={inr(hra)} />
            <ResultRow label="Special allowance" value={inr(special)} />
            <ResultRow label="Employer PF (12% of basic)" value={inr(employerPf)} />
            <ResultRow label="Gratuity provision (4.81% of basic)" value={inr(gratuity)} />
            <ResultRow label="Gross salary (excl. employer PF & gratuity)" value={inr(grossSalary)} bold />
            <ResultRow label="Employee PF (12% of basic)" value={inr(employeePf)} negative />
            <ResultRow label="Professional tax (₹200/mo)" value={inr(profTax)} negative />
            <ResultRow label="Income tax (new regime, incl. cess)" value={inr(incomeTax)} negative />
            <ResultRow label="Annual in-hand" value={inr(annualInHand)} bold />
          </ResultCard>
          <ToolNote>
            Assumes the FY 2025-26 new tax regime with ₹75,000 standard deduction and
            Section 87A rebate (zero tax up to ₹12L taxable income), PF at 12% of basic
            without the ₹15,000 wage ceiling, and professional tax of ₹200/month. Your
            actual structure, PF ceiling, ESI and employer policies may differ.
          </ToolNote>
        </>
        )
      }
    />
  );
}
