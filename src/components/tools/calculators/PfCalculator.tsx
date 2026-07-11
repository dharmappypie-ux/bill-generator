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

export default function PfCalculator() {
  const [basic, setBasic] = useState<number | "">(30000);
  const [age, setAge] = useState<number | "">(30);
  const [retireAge, setRetireAge] = useState<number | "">(58);
  const [increase, setIncrease] = useState<number | "">(5);
  const [rate, setRate] = useState<number | "">(8.25);

  const basicM = Number(basic) || 0;
  const years = Math.max(0, Math.floor((Number(retireAge) || 0) - (Number(age) || 0)));
  const g = (Number(increase) || 0) / 100;
  const i = (Number(rate) || 0) / 100;

  // Year-by-year projection: employee 12% of basic+DA plus the employer's 12%
  // minus the EPS share (8.33% of wages capped at ₹15,000, i.e. max ₹1,250/mo)
  // goes to EPF. Interest on opening balance for the full year, roughly half a
  // year's interest on the year's contributions (they arrive monthly).
  const monthlyEpf = (s: number) => s * 0.12 + (s * 0.12 - Math.min(s * 0.0833, 1250));
  let corpus = 0;
  let totalContribution = 0;
  let salary = basicM;
  for (let y = 0; y < years; y++) {
    const yearly = monthlyEpf(salary) * 12;
    corpus += yearly + corpus * i + yearly * (i / 2);
    totalContribution += yearly;
    salary *= 1 + g;
  }
  const interestEarned = Math.max(0, corpus - totalContribution);
  const monthlyNow = monthlyEpf(basicM);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly basic + DA"
            prefix="₹"
            value={basic}
            onChange={setBasic}
          />
          <NumberField label="Your age" suffix="years" value={age} onChange={setAge} />
          <NumberField
            label="Retirement age"
            suffix="years"
            value={retireAge}
            onChange={setRetireAge}
            hint="EPF retirement age is typically 58."
          />
          <NumberField
            label="Expected salary increase"
            suffix="% p.a."
            step={0.5}
            value={increase}
            onChange={setIncrease}
          />
          <NumberField
            label="EPF interest rate"
            suffix="% p.a."
            step={0.05}
            value={rate}
            onChange={setRate}
            hint="Current EPF rate is ~8.25% p.a. (set yearly by EPFO)."
          />
        </>
      }
      results={
        <>
          <BigResult
            label={`EPF corpus at age ${Number(retireAge) || 0}`}
            value={inr(corpus)}
          />
          <ResultCard title="Breakup">
            <ResultRow label="Years of contribution" value={`${years}`} />
            <ResultRow
              label="Monthly EPF contribution today (employee 12% + employer share)"
              value={inr(monthlyNow)}
            />
            <ResultRow label="Total contributions" value={inr(totalContribution)} />
            <ResultRow label="Interest earned" value={inr(interestEarned)} />
            <ResultRow label="Corpus at retirement" value={inr(corpus)} bold />
          </ResultCard>
          <ToolNote>
            Assumes employee 12% of basic + DA goes to EPF, and the
            employer&apos;s 12% goes to EPF after deducting the EPS (pension)
            share — 8.33% of wages capped at ₹15,000 (max ₹1,250/month) — which
            is not part of this corpus. Interest is credited yearly at the rate
            you set — the actual EPFO rate changes every year, so treat this as
            an estimate.
          </ToolNote>
        </>
      }
    />
  );
}
