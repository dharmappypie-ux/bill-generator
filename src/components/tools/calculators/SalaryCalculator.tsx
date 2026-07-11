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

export default function SalaryCalculator() {
  const [salary, setSalary] = useState<number | "">(30000);
  const [basicPct, setBasicPct] = useState("40");
  const [esiMode, setEsiMode] = useState<"auto" | "yes" | "no">("auto");

  const gross = Number(salary) || 0;
  const pct = Number(basicPct);

  const basic = gross * (pct / 100);
  const otherAllowances = gross - basic;

  const esiApplies = esiMode === "yes" || (esiMode === "auto" && gross > 0 && gross <= 21000);
  const pf = basic * 0.12;
  const esi = esiApplies ? gross * 0.0075 : 0;
  const profTax = gross > 0 ? 200 : 0;

  const totalDeductions = pf + esi + profTax;
  const net = Math.max(gross - totalDeductions, 0);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly gross salary"
            prefix="₹"
            value={salary}
            onChange={setSalary}
            hint="Total monthly earnings before any deductions."
          />
          <ToggleGroup
            label="Basic salary as % of gross"
            value={basicPct}
            onChange={setBasicPct}
            options={["40", "50", "60"].map((v) => ({ value: v, label: `${v}%` }))}
          />
          <ToggleGroup
            label="ESI deduction"
            value={esiMode}
            onChange={(v) => setEsiMode(v as "auto" | "yes" | "no")}
            options={[
              { value: "auto", label: "Auto (if gross ≤ ₹21,000)" },
              { value: "yes", label: "Include" },
              { value: "no", label: "Exclude" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Net monthly salary" value={inr(net)} />
          <ResultCard title="Earnings vs deductions (monthly)">
            <ResultRow label={`Basic salary (${pct}% of gross)`} value={inr(basic)} />
            <ResultRow label="Other allowances (HRA, special, etc.)" value={inr(otherAllowances)} />
            <ResultRow label="Gross salary" value={inr(gross)} bold />
            <ResultRow label="Employee PF (12% of basic)" value={inr(pf)} negative />
            <ResultRow
              label={esiApplies ? "Employee ESI (0.75% of gross)" : "Employee ESI (not applicable)"}
              value={inr(esi)}
              negative={esiApplies}
            />
            <ResultRow label="Professional tax" value={inr(profTax)} negative />
            <ResultRow label="Total deductions" value={inr(totalDeductions)} negative />
            <ResultRow label="Net take-home" value={inr(net)} bold />
          </ResultCard>
          <ToolNote>
            Uses standard FY 2025-26 rates: employee PF 12% of basic (+DA), employee
            ESI 0.75% of gross (applicable only when gross ≤ ₹21,000/month), and a flat
            ₹200/month professional tax (state slabs vary). TDS on salary is not
            included here — it depends on your annual income and tax regime.
          </ToolNote>
        </>
      }
    />
  );
}
