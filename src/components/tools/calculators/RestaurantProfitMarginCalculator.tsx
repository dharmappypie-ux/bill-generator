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

export default function RestaurantProfitMarginCalculator() {
  const [revenue, setRevenue] = useState<number | "">(1000000);
  const [cogs, setCogs] = useState<number | "">(380000);
  const [labour, setLabour] = useState<number | "">(240000);
  const [rent, setRent] = useState<number | "">(100000);
  const [other, setOther] = useState<number | "">(120000);

  const rev = Number(revenue) || 0;
  const cogsAmt = Number(cogs) || 0;
  const labourAmt = Number(labour) || 0;
  const rentAmt = Number(rent) || 0;
  const otherAmt = Number(other) || 0;

  const grossProfit = rev - cogsAmt;
  const netProfit = grossProfit - labourAmt - rentAmt - otherAmt;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly revenue"
            prefix="₹"
            value={revenue}
            onChange={setRevenue}
            hint="Total sales for the month — dine-in, delivery and takeaway."
          />
          <NumberField
            label="Cost of goods sold (COGS)"
            prefix="₹"
            value={cogs}
            onChange={setCogs}
            hint="Food, beverages and packaging consumed during the month."
          />
          <NumberField
            label="Labour cost"
            prefix="₹"
            value={labour}
            onChange={setLabour}
          />
          <NumberField label="Rent" prefix="₹" value={rent} onChange={setRent} />
          <NumberField
            label="Utilities & other overheads"
            prefix="₹"
            value={other}
            onChange={setOther}
            hint="Electricity, gas, marketing, commissions, maintenance, etc."
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Net profit margin"
            value={rev > 0 ? `${netMargin.toFixed(1)}%` : "—"}
          />
          <ResultCard title="Profit breakup">
            <ResultRow label="Revenue" value={inr(rev)} />
            <ResultRow label="Less: COGS" value={inr(cogsAmt)} negative />
            <ResultRow
              label={`Gross profit (${rev > 0 ? grossMargin.toFixed(1) : "0"}% margin)`}
              value={inr(grossProfit)}
            />
            <ResultRow label="Less: labour" value={inr(labourAmt)} negative />
            <ResultRow label="Less: rent" value={inr(rentAmt)} negative />
            <ResultRow label="Less: other overheads" value={inr(otherAmt)} negative />
            <ResultRow label="Net profit / month" value={inr(netProfit)} bold />
          </ResultCard>
          <ToolNote>
            Benchmark: a net margin of 10–15% is considered healthy for Indian
            restaurants; a gross margin of 60–70% (food cost 30–40%) is typical.
            This is a simple operating view — it ignores loan interest,
            depreciation and income tax.
          </ToolNote>
        </>
      }
    />
  );
}
