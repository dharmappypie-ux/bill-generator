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

const TAX_FREE_CAP = 2000000; // ₹20 lakh under Section 10(10)

export default function GratuityCalculator() {
  const [salary, setSalary] = useState<number | "">(50000);
  const [years, setYears] = useState<number | "">(8);
  const [months, setMonths] = useState<number | "">(7);
  const [covered, setCovered] = useState<"yes" | "no">("yes");

  const sal = Number(salary) || 0;
  const yrs = Math.max(0, Math.floor(Number(years) || 0));
  const mos = Math.min(11, Math.max(0, Math.floor(Number(months) || 0)));

  // Covered under the Act: ≥6 extra months rounds up to a full year, 15/26 formula.
  // Not covered: only completed years count, 15/30 (i.e. half month) formula.
  const serviceYears = covered === "yes" ? yrs + (mos >= 6 ? 1 : 0) : yrs;
  const gratuity =
    covered === "yes"
      ? (15 / 26) * sal * serviceYears
      : (15 / 30) * sal * serviceYears;

  const taxFree = Math.min(gratuity, TAX_FREE_CAP);
  const taxable = Math.max(0, gratuity - TAX_FREE_CAP);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Last drawn basic + DA (monthly)"
            prefix="₹"
            value={salary}
            onChange={setSalary}
            hint={
              covered === "yes"
                ? "Last drawn basic salary plus dearness allowance."
                : "For uncovered employees, use the average basic + DA of the last 10 months."
            }
          />
          <NumberField
            label="Completed years of service"
            value={years}
            onChange={setYears}
            suffix="years"
          />
          <NumberField
            label="Extra months beyond completed years"
            value={months}
            onChange={setMonths}
            suffix="months"
            hint={
              covered === "yes"
                ? "6 months or more rounds up to one more year (Payment of Gratuity Act)."
                : "Ignored when not covered — only completed years count."
            }
          />
          <ToggleGroup
            label="Covered under the Payment of Gratuity Act?"
            value={covered}
            onChange={(v) => setCovered(v as "yes" | "no")}
            options={[
              { value: "yes", label: "Covered (15/26 formula)" },
              { value: "no", label: "Not covered (15/30 formula)" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Gratuity payable" value={inr(gratuity, 0)} />
          <ResultCard title="Breakup">
            <ResultRow
              label="Service counted"
              value={`${serviceYears} year${serviceYears === 1 ? "" : "s"}`}
            />
            <ResultRow
              label={covered === "yes" ? "15 days' pay (salary × 15/26)" : "Half month's pay (salary × 15/30)"}
              value={inr(covered === "yes" ? (15 / 26) * sal : (15 / 30) * sal, 0)}
            />
            <ResultRow label="Tax-free gratuity (up to ₹20,00,000)" value={inr(taxFree, 0)} />
            <ResultRow label="Taxable gratuity" value={inr(taxable, 0)} bold />
          </ResultCard>
          <ToolNote>
            Gratuity generally requires 5 years of continuous service. The ₹20
            lakh exemption is the lifetime limit for non-government employees
            under Section 10(10); government employees&apos; gratuity is fully
            exempt. Employer policy can be more generous — confirm with HR or
            your CA.
          </ToolNote>
        </>
      }
    />
  );
}
