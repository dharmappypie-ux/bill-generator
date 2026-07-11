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
  formatINR,
} from "@/components/tools/ui";

export default function FoodWasteCostCalculator() {
  const [wasteKg, setWasteKg] = useState<number | "">(5);
  const [costPerKg, setCostPerKg] = useState<number | "">(120);
  const [daysOpen, setDaysOpen] = useState<number | "">(26);
  const [targetPct, setTargetPct] = useState<number | "">(30);

  const kg = Number(wasteKg) || 0;
  const rate = Number(costPerKg) || 0;
  const days = Number(daysOpen) || 0;
  const target = Number(targetPct) || 0;

  const dailyCost = kg * rate;
  const monthlyCost = dailyCost * days;
  const annualCost = monthlyCost * 12;
  const monthlySaving = monthlyCost * (target / 100);
  const annualSaving = annualCost * (target / 100);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Food waste per day"
            suffix="kg"
            value={wasteKg}
            onChange={setWasteKg}
            hint="Prep trim, spoilage, plate waste and over-production combined."
          />
          <NumberField
            label="Average cost per kg"
            prefix="₹"
            value={costPerKg}
            onChange={setCostPerKg}
            hint="Blended raw-material cost of what gets thrown away."
          />
          <NumberField
            label="Days open per month"
            value={daysOpen}
            onChange={setDaysOpen}
          />
          <NumberField
            label="Waste reduction target"
            suffix="%"
            value={targetPct}
            onChange={setTargetPct}
            hint="Kitchens routinely cut waste 25–40% with tracking and portion control."
          />
        </>
      }
      results={
        <>
          <BigResult label="Annual waste cost" value={inr(annualCost)} accent />
          <ResultCard title="Breakup">
            <ResultRow label="Waste cost per day" value={inr(dailyCost)} />
            <ResultRow label="Waste cost per month" value={inr(monthlyCost)} />
            <ResultRow
              label={`Monthly saving at ${formatINR(target)}% reduction`}
              value={inr(monthlySaving)}
            />
            <ResultRow
              label={`Annual saving at ${formatINR(target)}% reduction`}
              value={inr(annualSaving)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Waste cost = kg wasted × cost per kg × days open. Savings assume the
            reduction applies evenly across the month. Track waste by category
            (spoilage, prep trim, plate waste) for a week to find where the
            biggest rupees leak — most kitchens are surprised by the annual
            figure.
          </ToolNote>
        </>
      }
    />
  );
}
