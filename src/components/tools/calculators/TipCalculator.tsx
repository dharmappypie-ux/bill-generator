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
  formatINR,
} from "@/components/tools/ui";

export default function TipCalculator() {
  const [bill, setBill] = useState<number | "">(1200);
  const [tipChoice, setTipChoice] = useState("10");
  const [customTip, setCustomTip] = useState<number | "">(12);
  const [people, setPeople] = useState<number | "">(2);

  const amt = Number(bill) || 0;
  const tipPct =
    tipChoice === "custom" ? Number(customTip) || 0 : Number(tipChoice) || 0;
  const heads = Number(people) || 0;

  const tip = amt * (tipPct / 100);
  const grandTotal = amt + tip;
  const perPerson = heads > 0 ? grandTotal / heads : 0;
  const tipPerPerson = heads > 0 ? tip / heads : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Bill amount"
            prefix="₹"
            value={bill}
            onChange={setBill}
            hint="The final bill including taxes and service charge, if any."
          />
          <ToggleGroup
            label="Tip percentage"
            value={tipChoice}
            onChange={setTipChoice}
            options={[
              ...["5", "10", "15", "20"].map((v) => ({ value: v, label: `${v}%` })),
              { value: "custom", label: "Custom" },
            ]}
          />
          {tipChoice === "custom" && (
            <NumberField
              label="Custom tip"
              suffix="%"
              value={customTip}
              onChange={setCustomTip}
            />
          )}
          <NumberField
            label="Splitting between (people)"
            value={people}
            onChange={setPeople}
            min={1}
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Each person pays"
            value={heads > 0 ? inr(perPerson, 2) : "—"}
          />
          <ResultCard title="Breakup">
            <ResultRow label="Bill amount" value={inr(amt, 2)} />
            <ResultRow label={`Tip @ ${formatINR(tipPct, 1)}%`} value={inr(tip, 2)} />
            <ResultRow label="Grand total" value={inr(grandTotal, 2)} bold />
            <ResultRow
              label="Tip per person"
              value={heads > 0 ? inr(tipPerPerson, 2) : "—"}
            />
          </ResultCard>
          <ToolNote>
            Tipping in India is discretionary — 5–10% is customary at restaurants.
            If the bill already includes a service charge, an additional tip is
            optional. The split assumes everyone pays an equal share.
          </ToolNote>
        </>
      }
    />
  );
}
