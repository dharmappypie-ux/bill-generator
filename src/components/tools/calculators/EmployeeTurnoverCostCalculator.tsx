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

export default function EmployeeTurnoverCostCalculator() {
  const [employees, setEmployees] = useState<number | "">(100);
  const [attrition, setAttrition] = useState<number | "">(18);
  const [avgSalary, setAvgSalary] = useState<number | "">(600000);
  const [replacementPct, setReplacementPct] = useState<number | "">(50);

  const headcount = Number(employees) || 0;
  const attritionRate = Number(attrition) || 0;
  const salary = Number(avgSalary) || 0;
  const replacement = Number(replacementPct) || 0;

  const exitsPerYear = (headcount * attritionRate) / 100;
  const costPerExit = salary * (replacement / 100);
  const annualCost = exitsPerYear * costPerExit;
  const costPctOfPayroll =
    headcount > 0 && salary > 0
      ? (annualCost / (headcount * salary)) * 100
      : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Total employees"
            value={employees}
            onChange={setEmployees}
          />
          <NumberField
            label="Annual attrition rate"
            suffix="%"
            value={attrition}
            onChange={setAttrition}
            hint="Percentage of employees who leave in a year"
          />
          <NumberField
            label="Average annual salary"
            prefix="₹"
            value={avgSalary}
            onChange={setAvgSalary}
          />
          <NumberField
            label="Replacement cost (% of salary)"
            suffix="%"
            value={replacementPct}
            onChange={setReplacementPct}
            hint="Hiring, onboarding, training and lost productivity — 50% is a common estimate"
          />
        </>
      }
      results={
        <>
          <BigResult label="Annual turnover cost" value={inr(annualCost)} />
          <ResultCard title="How it adds up">
            <ResultRow
              label="Expected exits per year"
              value={exitsPerYear.toFixed(1)}
            />
            <ResultRow label="Cost per exit" value={inr(costPerExit)} />
            <ResultRow label="Annual turnover cost" value={inr(annualCost)} bold />
            <ResultRow
              label="As % of annual payroll"
              value={`${costPctOfPayroll.toFixed(1)}%`}
            />
          </ResultCard>
          <ToolNote>
            Turnover cost = exits × average salary × replacement cost %. Studies
            typically peg replacement cost at 30–150% of annual salary depending on
            the role. This is a planning estimate — actual costs vary with hiring
            time, training needs and role seniority.
          </ToolNote>
        </>
      }
    />
  );
}
