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

export default function InHandSalaryCalculator() {
  const [period, setPeriod] = useState<"annual" | "monthly">("annual");
  const [ctc, setCtc] = useState<number | "">(1000000);

  const input = Number(ctc) || 0;
  const annualCtc = period === "annual" ? input : input * 12;

  // Simple standard structure: basic = 40% of CTC.
  const basic = annualCtc * 0.4;
  const employerPf = basic * 0.12;
  const grossSalary = Math.max(annualCtc - employerPf, 0);

  const employeePf = basic * 0.12;
  const profTax = 2400; // ₹200/month, indicative
  const taxable = Math.max(grossSalary - 75000, 0); // standard deduction
  const incomeTax = newRegimeTax(taxable);

  const annualTakeHome = Math.max(grossSalary - employeePf - profTax - incomeTax, 0);
  const monthlyTakeHome = annualTakeHome / 12;

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="How is your CTC quoted?"
            value={period}
            onChange={(v) => setPeriod(v as "annual" | "monthly")}
            options={[
              { value: "annual", label: "Annual CTC" },
              { value: "monthly", label: "Monthly CTC" },
            ]}
          />
          <NumberField
            label={period === "annual" ? "Annual CTC" : "Monthly CTC"}
            prefix="₹"
            value={ctc}
            onChange={setCtc}
            hint="Total cost to company, including the employer's PF contribution."
          />
        </>
      }
      results={
        <>
          <BigResult label="Monthly take-home" value={inr(monthlyTakeHome)} />
          <ResultCard title="Breakup (annual)">
            <ResultRow label="Annual CTC" value={inr(annualCtc)} />
            <ResultRow label="Basic salary (assumed 40% of CTC)" value={inr(basic)} />
            <ResultRow label="Employer PF (part of CTC)" value={inr(employerPf)} negative />
            <ResultRow label="Gross salary" value={inr(grossSalary)} bold />
            <ResultRow label="Employee PF (12% of basic)" value={inr(employeePf)} negative />
            <ResultRow label="Professional tax (₹200/mo)" value={inr(profTax)} negative />
            <ResultRow label="Income tax (new regime, incl. cess)" value={inr(incomeTax)} negative />
            <ResultRow label="Annual take-home" value={inr(annualTakeHome)} bold />
          </ResultCard>
          <ToolNote>
            Quick estimate assuming basic = 40% of CTC, PF at 12% of basic on both
            sides, professional tax ₹200/month, and the FY 2025-26 new regime with
            ₹75,000 standard deduction and 87A rebate (zero tax up to ₹12L taxable
            income). Excludes gratuity, ESI, bonuses and company-specific components.
          </ToolNote>
        </>
      }
    />
  );
}
