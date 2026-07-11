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

export default function RestaurantStartupCostCalculator() {
  const [deposit, setDeposit] = useState<number | "">(500000);
  const [interiors, setInteriors] = useState<number | "">(1200000);
  const [kitchen, setKitchen] = useState<number | "">(800000);
  const [licenses, setLicenses] = useState<number | "">(150000);
  const [inventory, setInventory] = useState<number | "">(200000);
  const [marketing, setMarketing] = useState<number | "">(150000);
  const [bufferMonths, setBufferMonths] = useState<number | "">(3);
  const [monthlyOpex, setMonthlyOpex] = useState<number | "">(300000);

  const oneTime =
    (Number(deposit) || 0) +
    (Number(interiors) || 0) +
    (Number(kitchen) || 0) +
    (Number(licenses) || 0) +
    (Number(inventory) || 0) +
    (Number(marketing) || 0);
  const workingCapital = (Number(bufferMonths) || 0) * (Number(monthlyOpex) || 0);
  const total = oneTime + workingCapital;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Security deposit"
            prefix="₹"
            value={deposit}
            onChange={setDeposit}
            hint="Typically 6–10 months of rent, refundable."
          />
          <NumberField
            label="Interiors & furniture"
            prefix="₹"
            value={interiors}
            onChange={setInteriors}
          />
          <NumberField
            label="Kitchen equipment"
            prefix="₹"
            value={kitchen}
            onChange={setKitchen}
          />
          <NumberField
            label="Licenses & legal"
            prefix="₹"
            value={licenses}
            onChange={setLicenses}
            hint="FSSAI, GST registration, trade licence, fire NOC, liquor licence if any."
          />
          <NumberField
            label="Initial inventory"
            prefix="₹"
            value={inventory}
            onChange={setInventory}
          />
          <NumberField
            label="Marketing & launch"
            prefix="₹"
            value={marketing}
            onChange={setMarketing}
          />
          <NumberField
            label="Working capital buffer"
            suffix="months"
            value={bufferMonths}
            onChange={setBufferMonths}
            hint="Months of running costs to keep aside while the restaurant ramps up. 3–6 is prudent."
          />
          <NumberField
            label="Monthly operating cost"
            prefix="₹"
            value={monthlyOpex}
            onChange={setMonthlyOpex}
            hint="Rent + salaries + utilities + food purchases for a typical month."
          />
        </>
      }
      results={
        <>
          <BigResult label="Total investment needed" value={inr(total)} />
          <ResultCard title="Breakup">
            <ResultRow label="Security deposit" value={inr(Number(deposit) || 0)} />
            <ResultRow label="Interiors & furniture" value={inr(Number(interiors) || 0)} />
            <ResultRow label="Kitchen equipment" value={inr(Number(kitchen) || 0)} />
            <ResultRow label="Licenses & legal" value={inr(Number(licenses) || 0)} />
            <ResultRow label="Initial inventory" value={inr(Number(inventory) || 0)} />
            <ResultRow label="Marketing & launch" value={inr(Number(marketing) || 0)} />
            <ResultRow label="One-time setup cost" value={inr(oneTime)} bold />
            <ResultRow
              label={`Working capital (${Number(bufferMonths) || 0} × ${inr(
                Number(monthlyOpex) || 0
              )})`}
              value={inr(workingCapital)}
              bold
            />
          </ResultCard>
          <ToolNote>
            A rough planning estimate — actual costs vary widely by city, format
            (QSR vs fine dine) and location. Most new restaurants take 6–12
            months to break even, so keeping a working capital buffer of at
            least 3 months is strongly recommended.
          </ToolNote>
        </>
      }
    />
  );
}
