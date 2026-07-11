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

export default function HraCalculator() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [basic, setBasic] = useState<number | "">(40000);
  const [hra, setHra] = useState<number | "">(16000);
  const [rent, setRent] = useState<number | "">(15000);
  const [metro, setMetro] = useState<"metro" | "nonmetro">("metro");

  const b = Number(basic) || 0;
  const h = Number(hra) || 0;
  const r = Number(rent) || 0;

  const ruleA = h; // actual HRA received
  const ruleB = Math.max(0, r - 0.1 * b); // rent paid − 10% of basic
  const ruleC = (metro === "metro" ? 0.5 : 0.4) * b; // 50% / 40% of basic

  const exempt = Math.max(0, Math.min(ruleA, ruleB, ruleC));
  const taxable = Math.max(0, h - exempt);
  const suffix = period === "monthly" ? "/month" : "/year";

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="Enter figures as"
            value={period}
            onChange={(v) => setPeriod(v as "monthly" | "annual")}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "annual", label: "Annual" },
            ]}
          />
          <NumberField
            label={`Basic salary + DA (${period})`}
            prefix="₹"
            value={basic}
            onChange={setBasic}
          />
          <NumberField
            label={`HRA received (${period})`}
            prefix="₹"
            value={hra}
            onChange={setHra}
          />
          <NumberField
            label={`Rent paid (${period})`}
            prefix="₹"
            value={rent}
            onChange={setRent}
          />
          <ToggleGroup
            label="City of residence"
            value={metro}
            onChange={(v) => setMetro(v as "metro" | "nonmetro")}
            options={[
              { value: "metro", label: "Metro (Delhi, Mumbai, Kolkata, Chennai)" },
              { value: "nonmetro", label: "Non-metro" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label={`Exempt HRA (${period})`} value={inr(exempt)} />
          <ResultCard title="How the exemption is picked (least of the three)">
            <ResultRow label="Actual HRA received" value={`${inr(ruleA)}${suffix}`} />
            <ResultRow
              label="Rent paid − 10% of basic + DA"
              value={`${inr(ruleB)}${suffix}`}
            />
            <ResultRow
              label={`${metro === "metro" ? "50%" : "40%"} of basic + DA`}
              value={`${inr(ruleC)}${suffix}`}
            />
            <ResultRow label="Exempt HRA" value={`${inr(exempt)}${suffix}`} bold />
            <ResultRow label="Taxable HRA" value={`${inr(taxable)}${suffix}`} bold />
          </ResultCard>
          <ToolNote>
            HRA exemption under Section 10(13A) is the least of the three amounts
            above and is available only under the old tax regime. If annual rent
            exceeds ₹1,00,000 you must share the landlord&apos;s PAN with your
            employer. Verify with your CA before filing.
          </ToolNote>
        </>
      }
    />
  );
}
