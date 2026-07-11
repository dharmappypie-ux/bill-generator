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

export default function EpfWithdrawalCalculator() {
  const [balance, setBalance] = useState<number | "">(300000);
  const [years, setYears] = useState<number | "">(3);
  const [pan, setPan] = useState<"yes" | "no">("yes");

  const bal = Number(balance) || 0;
  const service = Number(years) || 0;

  const noTds = service >= 5 || bal < 50000;
  const tdsRate = noTds ? 0 : pan === "yes" ? 10 : 20;
  const tds = (bal * tdsRate) / 100;
  const receive = bal - tds;

  const reason = noTds
    ? service >= 5
      ? "No TDS — 5 or more years of continuous service."
      : "No TDS — balance below ₹50,000."
    : pan === "yes"
      ? "TDS @ 10% — withdrawal before 5 years with PAN submitted."
      : "TDS @ 20% — PAN not submitted (Section 192A read with 206AA).";

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Current EPF balance"
            prefix="₹"
            value={balance}
            onChange={setBalance}
            hint="Employee + employer share plus interest, as per your passbook."
          />
          <NumberField
            label="Years of continuous service"
            suffix="years"
            step={0.5}
            value={years}
            onChange={setYears}
          />
          <ToggleGroup
            label="PAN submitted to EPFO?"
            value={pan}
            onChange={(v) => setPan(v as "yes" | "no")}
            options={[
              { value: "yes", label: "Yes (Form 15G/PAN on record)" },
              { value: "no", label: "No" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Amount you receive" value={inr(receive)} />
          <ResultCard title="Breakup">
            <ResultRow label="EPF balance withdrawn" value={inr(bal)} />
            <ResultRow
              label={`TDS @ ${tdsRate.toFixed(1)}%`}
              value={inr(tds)}
              negative={tds > 0}
            />
            <ResultRow label="Net payout" value={inr(receive)} bold />
            <ResultRow label="Why" value={noTds ? "Tax-free withdrawal" : "TDS applies"} />
          </ResultCard>
          <ToolNote>
            {reason} Withdrawal after 5 years of continuous service is fully
            tax-free; before that, the taxable portion is added to your income
            and taxed at slab rates — TDS shown here is only the deduction at
            source, not your final tax. You may avoid TDS by filing Form 15G/15H
            if eligible. Verify with EPFO / your CA.
          </ToolNote>
        </>
      }
    />
  );
}
