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

export default function GstRefundCalculator() {
  const [mode, setMode] = useState<"export" | "inverted">("export");
  const [netItc, setNetItc] = useState<number | "">(200000);
  const [relevantTurnover, setRelevantTurnover] = useState<number | "">(1500000);
  const [totalTurnover, setTotalTurnover] = useState<number | "">(5000000);
  const [outputTax, setOutputTax] = useState<number | "">(30000);
  const [totalItcAll, setTotalItcAll] = useState<number | "">(250000);

  const itc = Number(netItc) || 0;
  const relevant = Number(relevantTurnover) || 0;
  const total = Number(totalTurnover) || 0;
  const outTax = Number(outputTax) || 0;
  const itcAll = Number(totalItcAll) || 0;

  const turnoverExceedsTotal = total > 0 && relevant > total;
  const ratio = total > 0 ? Math.min(1, relevant / total) : 0;
  const proRataItc = itc * ratio;
  // Amended Rule 89(5) (Notification 14/2022-CT, w.e.f. 05-07-2022): the output-tax
  // deduction is scaled by Net ITC ÷ ITC availed on inputs and input services.
  const invertedDeduction = outTax * (itcAll > 0 ? Math.min(1, itc / itcAll) : 1);
  const refund =
    mode === "export" ? proRataItc : Math.max(0, proRataItc - invertedDeduction);

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="Refund type"
            value={mode}
            onChange={(v) => setMode(v as "export" | "inverted")}
            options={[
              { value: "export", label: "Export without tax (zero-rated)" },
              { value: "inverted", label: "Inverted duty structure" },
            ]}
          />
          <NumberField
            label="Net ITC for the period"
            prefix="₹"
            value={netItc}
            onChange={setNetItc}
            hint={
              mode === "export"
                ? "ITC availed on inputs and input services."
                : "ITC availed on inputs only (input services excluded)."
            }
          />
          <NumberField
            label={
              mode === "export"
                ? "Zero-rated turnover (exports without tax)"
                : "Turnover of inverted-rated supplies"
            }
            prefix="₹"
            value={relevantTurnover}
            onChange={setRelevantTurnover}
          />
          <NumberField
            label="Adjusted total turnover"
            prefix="₹"
            value={totalTurnover}
            onChange={setTotalTurnover}
            hint="All taxable turnover in the period, excluding exempt supplies other than zero-rated."
          />
          {mode === "inverted" && (
            <>
              <NumberField
                label="Output tax on inverted-rated supplies"
                prefix="₹"
                value={outputTax}
                onChange={setOutputTax}
              />
              <NumberField
                label="Total ITC availed on inputs and input services"
                prefix="₹"
                value={totalItcAll}
                onChange={setTotalItcAll}
                hint="Scales the output-tax deduction per amended Rule 89(5)."
              />
            </>
          )}
        </>
      }
      results={
        <>
          {turnoverExceedsTotal && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-600">
              <i className="fa-solid fa-triangle-exclamation mr-1.5" />
              {mode === "export" ? "Zero-rated" : "Inverted-rated"} turnover
              exceeds adjusted total turnover, which is not possible — the
              turnover ratio has been capped at 100%. Check your inputs.
            </p>
          )}
          <BigResult label="Eligible refund" value={inr(refund, 2)} />
          <ResultCard title="Formula breakup">
            <ResultRow label="Net ITC" value={inr(itc, 2)} />
            <ResultRow
              label={mode === "export" ? "Zero-rated turnover" : "Inverted turnover"}
              value={inr(relevant, 2)}
            />
            <ResultRow label="Adjusted total turnover" value={inr(total, 2)} />
            <ResultRow label="Turnover ratio" value={`${(ratio * 100).toFixed(2)}%`} />
            <ResultRow label="Pro-rata ITC (ITC × ratio)" value={inr(proRataItc, 2)} />
            {mode === "inverted" && (
              <ResultRow
                label="Less: output tax × (Net ITC ÷ total ITC on inputs and services)"
                value={inr(invertedDeduction, 2)}
                negative
              />
            )}
            <ResultRow label="Eligible refund" value={inr(refund, 2)} bold />
          </ResultCard>
          <ToolNote>
            {mode === "export"
              ? "Formula per Rule 89(4): Refund = Net ITC × (zero-rated turnover ÷ adjusted total turnover), for exports made without payment of tax under LUT."
              : "Formula per Rule 89(5), as amended by Notification 14/2022-CT (w.e.f. 05-07-2022): Refund = (inverted turnover × Net ITC ÷ adjusted total turnover) − (output tax on inverted supplies × Net ITC ÷ ITC availed on inputs and input services); Net ITC here covers inputs only."}{" "}
            Actual refunds are capped by the balance in your electronic credit
            ledger — verify with your CA before filing RFD-01.
          </ToolNote>
        </>
      }
    />
  );
}
