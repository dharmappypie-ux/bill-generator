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
  formatINR,
} from "@/components/tools/ui";

export default function SalaryArrearsCalculator() {
  const [oldSalary, setOldSalary] = useState<number | "">(40000);
  const [revisedSalary, setRevisedSalary] = useState<number | "">(46000);
  const [months, setMonths] = useState<number | "">(6);

  const oldS = Number(oldSalary) || 0;
  const newS = Number(revisedSalary) || 0;
  const m = Math.max(Math.floor(Number(months) || 0), 0);

  const perMonthDiff = newS - oldS;
  const totalArrears = perMonthDiff * m;
  const hikePct = oldS > 0 ? (perMonthDiff / oldS) * 100 : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Old monthly salary"
            prefix="₹"
            value={oldSalary}
            onChange={setOldSalary}
            hint="Salary you were actually paid during the arrears period."
          />
          <NumberField
            label="Revised monthly salary"
            prefix="₹"
            value={revisedSalary}
            onChange={setRevisedSalary}
            hint="New salary after the revision / increment."
          />
          <NumberField
            label="Effective from (months ago)"
            suffix="months"
            value={months}
            onChange={setMonths}
            step={1}
            hint="Number of months the revision applies to retrospectively."
          />
        </>
      }
      results={
        <>
          <BigResult label="Total salary arrears" value={inr(totalArrears)} />
          <ResultCard title="Breakup">
            <ResultRow label="Old salary (monthly)" value={inr(oldS)} />
            <ResultRow label="Revised salary (monthly)" value={inr(newS)} />
            <ResultRow
              label="Effective hike"
              value={oldS > 0 ? `${formatINR(hikePct, 2)}%` : "—"}
            />
            <ResultRow label="Difference per month" value={inr(perMonthDiff)} />
            <ResultRow label="Arrears period" value={`${m} month${m === 1 ? "" : "s"}`} />
            <ResultRow label="Total arrears payable" value={inr(totalArrears)} bold />
          </ResultCard>
          <ToolNote>
            Arrears are computed as (revised − old salary) × months, before tax and
            statutory deductions. Arrears are taxable in the year you receive them,
            but Section 89(1) relief (claimed by filing Form 10E before your ITR) can
            reduce the extra tax caused by income bunching. PF/ESI on arrears may also
            apply as per your employer&apos;s policy.
          </ToolNote>
        </>
      }
    />
  );
}
