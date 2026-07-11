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

export default function NpsCalculator() {
  const [monthly, setMonthly] = useState<number | "">(5000);
  const [age, setAge] = useState<number | "">(30);
  const [returnPct, setReturnPct] = useState<number | "">(10);
  const [annuityPct, setAnnuityPct] = useState<number | "">(40);
  const [annuityRate, setAnnuityRate] = useState<number | "">(6);

  const p = Number(monthly) || 0;
  const months = Math.max(0, (60 - (Number(age) || 0)) * 12);
  const i = (Number(returnPct) || 0) / 100 / 12;
  const annPct = Math.min(100, Math.max(40, Number(annuityPct) || 0));
  const annRate = (Number(annuityRate) || 0) / 100;

  // Future value of a monthly SIP, contributions at the start of each month.
  const corpus =
    i > 0 ? p * ((Math.pow(1 + i, months) - 1) / i) * (1 + i) : p * months;
  const invested = p * months;
  const growth = Math.max(0, corpus - invested);

  const annuityAmount = corpus * (annPct / 100);
  const lumpsum = corpus - annuityAmount;
  const monthlyPension = (annuityAmount * annRate) / 12;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly NPS contribution"
            prefix="₹"
            value={monthly}
            onChange={setMonthly}
          />
          <NumberField label="Current age" suffix="years" value={age} onChange={setAge} />
          <NumberField
            label="Expected return on NPS"
            suffix="% p.a."
            step={0.5}
            value={returnPct}
            onChange={setReturnPct}
            hint="Long-term equity+debt NPS returns are often assumed around 9–11%."
          />
          <NumberField
            label="Corpus used to buy annuity"
            suffix="%"
            min={40}
            step={5}
            value={annuityPct}
            onChange={setAnnuityPct}
            hint="At least 40% must buy an annuity at exit; values below 40 are treated as 40."
          />
          <NumberField
            label="Expected annuity rate"
            suffix="% p.a."
            step={0.25}
            value={annuityRate}
            onChange={setAnnuityRate}
          />
        </>
      }
      results={
        <>
          <BigResult label="NPS corpus at age 60" value={inr(corpus)} />
          <ResultCard title="At retirement">
            <ResultRow label="Total invested" value={inr(invested)} />
            <ResultRow label="Growth earned" value={inr(growth)} />
            <ResultRow
              label={`Lumpsum in hand (${(100 - annPct).toFixed(0)}%, tax-free)`}
              value={inr(lumpsum)}
              bold
            />
            <ResultRow
              label={`Annuity purchase (${annPct.toFixed(0)}%)`}
              value={inr(annuityAmount)}
            />
            <ResultRow
              label="Estimated monthly pension"
              value={inr(monthlyPension)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Assumes contributions continue till age 60 with returns compounding
            monthly at your assumed rate. NPS rules require at least 40% of the
            corpus to buy an annuity; up to 60% can be withdrawn tax-free as
            lumpsum. Pension shown is pre-tax and depends on the annuity plan you
            choose — actual annuity rates vary by provider.
          </ToolNote>
        </>
      }
    />
  );
}
