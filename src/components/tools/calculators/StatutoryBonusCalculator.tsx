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

const ELIGIBILITY_CEILING = 21000; // basic + DA per month
const WAGE_CEILING = 7000; // calculation ceiling (or state minimum wage if higher)

export default function StatutoryBonusCalculator() {
  const [salary, setSalary] = useState<number | "">(15000);
  const [monthsWorked, setMonthsWorked] = useState<number | "">(12);
  const [rate, setRate] = useState("8.33");

  const sal = Number(salary) || 0;
  const months = Math.min(12, Math.max(0, Number(monthsWorked) || 0));
  const pct = Number(rate);

  const eligible = sal > 0 && sal <= ELIGIBILITY_CEILING;
  const eligibleWage = eligible ? Math.min(sal, WAGE_CEILING) : 0;
  const monthlyBonus = eligibleWage * (pct / 100);
  const annualBonus = monthlyBonus * months;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly basic + DA"
            prefix="₹"
            value={salary}
            onChange={setSalary}
            hint={`Eligible for statutory bonus only if basic + DA is ₹${ELIGIBILITY_CEILING.toLocaleString(
              "en-IN"
            )}/month or less.`}
          />
          <NumberField
            label="Months worked in the financial year"
            value={monthsWorked}
            onChange={setMonthsWorked}
            suffix="months"
            hint="Minimum 30 working days in the year is required for eligibility."
          />
          <ToggleGroup
            label="Bonus rate"
            value={rate}
            onChange={setRate}
            options={[
              { value: "8.33", label: "8.33% (minimum)" },
              { value: "10", label: "10%" },
              { value: "15", label: "15%" },
              { value: "20", label: "20% (maximum)" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Annual statutory bonus"
            value={eligible ? inr(annualBonus, 0) : "Not eligible"}
            accent={!eligible}
          />
          <ResultCard title="Breakup">
            <ResultRow
              label="Eligibility"
              value={
                eligible
                  ? "Eligible (basic + DA ≤ ₹21,000)"
                  : sal === 0
                  ? "—"
                  : "Basic + DA above ₹21,000"
              }
              bold
            />
            <ResultRow
              label={`Monthly eligible wage (capped at ₹${WAGE_CEILING.toLocaleString("en-IN")})`}
              value={inr(eligibleWage, 0)}
            />
            <ResultRow label={`Monthly bonus @ ${pct}%`} value={inr(monthlyBonus, 2)} />
            <ResultRow label={`Bonus for ${months} month(s)`} value={inr(annualBonus, 0)} bold />
          </ResultCard>
          <ToolNote>
            Per the Payment of Bonus Act, 1965: minimum bonus 8.33%, maximum
            20%, computed on the lower of actual basic + DA and ₹7,000 — or the
            state minimum wage for the scheduled employment if that is higher
            (this tool uses ₹7,000 as indicative). Applies to establishments
            with 20+ employees; the actual rate depends on the employer&apos;s
            allocable surplus.
          </ToolNote>
        </>
      }
    />
  );
}
