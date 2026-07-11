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

export default function NoticePeriodCalculator() {
  const [gross, setGross] = useState<number | "">(60000);
  const [basic, setBasic] = useState<number | "">(30000);
  const [required, setRequired] = useState<number | "">(90);
  const [served, setServed] = useState<number | "">(60);
  const [basis, setBasis] = useState<"gross" | "basic">("gross");

  const grossPay = Number(gross) || 0;
  const basicPay = Number(basic) || 0;
  const requiredDays = Number(required) || 0;
  const servedDays = Number(served) || 0;

  const shortfall = Math.max(0, requiredDays - servedDays);
  const basisAmount = basis === "gross" ? grossPay : basicPay;
  const perDay = basisAmount / 30;
  const recovery = perDay * shortfall;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly gross salary"
            prefix="₹"
            value={gross}
            onChange={setGross}
          />
          <ToggleGroup
            label="Notice pay basis"
            value={basis}
            onChange={(v) => setBasis(v as "gross" | "basic")}
            options={[
              { value: "gross", label: "Gross salary" },
              { value: "basic", label: "Basic + DA" },
            ]}
          />
          {basis === "basic" && (
            <NumberField
              label="Monthly basic + DA"
              prefix="₹"
              value={basic}
              onChange={setBasic}
              hint="Many companies compute notice pay on basic + DA only"
            />
          )}
          <NumberField
            label="Notice period required"
            suffix="days"
            value={required}
            onChange={setRequired}
            hint="As per your appointment letter (30/60/90 days)"
          />
          <NumberField
            label="Notice actually served"
            suffix="days"
            value={served}
            onChange={setServed}
          />
        </>
      }
      results={
        <>
          <BigResult label="Notice pay recovery" value={inr(recovery)} />
          <ResultCard title="How it's computed">
            <ResultRow
              label={`Per-day rate (${basis === "gross" ? "gross" : "basic + DA"} ÷ 30)`}
              value={inr(perDay)}
            />
            <ResultRow label="Shortfall days" value={`${shortfall} days`} />
            <ResultRow
              label={`Recovery (${shortfall} days × per-day rate)`}
              value={inr(recovery)}
              bold
            />
            <ResultRow
              label="Notice served"
              value={`${servedDays} of ${requiredDays} days`}
            />
          </ResultCard>
          <ToolNote>
            Notice pay recovery = per-day salary × days of notice not served, using
            a 30-day month. Whether it is computed on gross or basic + DA depends
            on your employment contract, and employers may waive or buy out the
            shortfall. If the employer asks you to leave early, the same amount is
            typically payable to you instead. Check your appointment letter and HR
            policy.
          </ToolNote>
        </>
      }
    />
  );
}
