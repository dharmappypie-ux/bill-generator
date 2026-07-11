"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  SelectField,
  ToggleGroup,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

/** Indicative monthly minimum wages (₹) — actual rates vary by zone & industry. */
const WAGE_TABLE: Record<string, { label: string; unskilled: number; skilled: number }> = {
  DL: { label: "Delhi", unskilled: 18456, skilled: 22411 },
  MH: { label: "Maharashtra", unskilled: 13000, skilled: 15200 },
  KA: { label: "Karnataka", unskilled: 14000, skilled: 17000 },
  TN: { label: "Tamil Nadu", unskilled: 11500, skilled: 14000 },
  GJ: { label: "Gujarat", unskilled: 12100, skilled: 13500 },
  WB: { label: "West Bengal", unskilled: 9800, skilled: 11900 },
  TS: { label: "Telangana", unskilled: 11000, skilled: 13200 },
  UP: { label: "Uttar Pradesh", unskilled: 10600, skilled: 12800 },
};

export default function MinimumWageCalculator() {
  const [state, setState] = useState("MH");
  const [skill, setSkill] = useState<"unskilled" | "skilled">("unskilled");
  const [wage, setWage] = useState<number | "">(15000);

  const row = WAGE_TABLE[state];
  const minimumMonthly = skill === "skilled" ? row.skilled : row.unskilled;
  const yourWage = Number(wage) || 0;

  const gap = yourWage - minimumMonthly;
  const compliant = gap >= 0;
  const dailyMinimum = minimumMonthly / 26;
  const yourDaily = yourWage / 26;

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            label="State"
            value={state}
            onChange={setState}
            options={Object.entries(WAGE_TABLE).map(([value, s]) => ({
              value,
              label: s.label,
            }))}
            hint="Indicative rates — actual notified rates vary by zone and industry"
          />
          <ToggleGroup
            label="Skill category"
            value={skill}
            onChange={(v) => setSkill(v as "unskilled" | "skilled")}
            options={[
              { value: "unskilled", label: "Unskilled" },
              { value: "skilled", label: "Skilled" },
            ]}
          />
          <NumberField
            label="Your monthly wage"
            prefix="₹"
            value={wage}
            onChange={setWage}
            hint="Gross monthly wage being paid"
          />
        </>
      }
      results={
        <>
          <BigResult
            label={compliant ? "Above minimum wage" : "Below minimum wage"}
            value={`${inr(Math.abs(gap))} ${compliant ? "above" : "short"}`}
            accent={!compliant}
          />
          <ResultCard title="Comparison">
            <ResultRow
              label={`${row.label} minimum (${skill}, indicative)`}
              value={inr(minimumMonthly)}
            />
            <ResultRow label="Your monthly wage" value={inr(yourWage)} />
            <ResultRow
              label="Difference"
              value={inr(Math.abs(gap))}
              negative={!compliant}
              bold
            />
            <ResultRow label="Minimum daily rate (÷26)" value={inr(dailyMinimum)} />
            <ResultRow label="Your daily rate (÷26)" value={inr(yourDaily)} />
          </ResultCard>
          <ToolNote>
            Minimum wages in India are notified by each state and revised twice a
            year (VDA), with different rates by zone, industry and skill level. The
            figures here are indicative monthly rates for comparison only — always
            check the latest notification from the state labour department before
            making compliance decisions.
          </ToolNote>
        </>
      }
    />
  );
}
