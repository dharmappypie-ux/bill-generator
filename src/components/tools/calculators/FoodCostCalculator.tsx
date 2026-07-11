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

export default function FoodCostCalculator() {
  const [opening, setOpening] = useState<number | "">(50000);
  const [purchases, setPurchases] = useState<number | "">(150000);
  const [closing, setClosing] = useState<number | "">(40000);
  const [sales, setSales] = useState<number | "">(500000);

  const open = Number(opening) || 0;
  const buy = Number(purchases) || 0;
  const close = Number(closing) || 0;
  const rev = Number(sales) || 0;

  const cogs = open + buy - close;
  const foodCostPct = rev > 0 ? (cogs / rev) * 100 : 0;
  const grossProfit = rev - cogs;
  const benchmarkCogs = rev * 0.3;
  const vsBenchmark = cogs - benchmarkCogs; // positive = overspend vs 30%

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Opening inventory (start of month)"
            prefix="₹"
            value={opening}
            onChange={setOpening}
            hint="Value of food stock at the start of the period."
          />
          <NumberField
            label="Purchases during the month"
            prefix="₹"
            value={purchases}
            onChange={setPurchases}
          />
          <NumberField
            label="Closing inventory (end of month)"
            prefix="₹"
            value={closing}
            onChange={setClosing}
          />
          <NumberField
            label="Food sales for the month"
            prefix="₹"
            value={sales}
            onChange={setSales}
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Food cost percentage"
            value={rev > 0 ? `${formatINR(foodCostPct, 1)}%` : "—"}
          />
          <ResultCard title="Breakup">
            <ResultRow
              label="Cost of goods sold (COGS)"
              value={inr(cogs)}
            />
            <ResultRow label="Food sales" value={inr(rev)} />
            <ResultRow label="Gross profit on food" value={inr(grossProfit)} />
            <ResultRow
              label={
                vsBenchmark > 0
                  ? "Overspend vs 30% benchmark"
                  : "Cushion vs 30% benchmark"
              }
              value={inr(Math.abs(vsBenchmark))}
              negative={vsBenchmark > 0}
              bold
            />
          </ResultCard>
          <ToolNote>
            COGS = opening inventory + purchases − closing inventory. Healthy
            Indian restaurants typically target a food cost of 28–32% of food
            sales; QSRs run lower, fine dining higher. Every rupee of COGS saved
            adds directly to profit, so track this monthly with a physical stock
            count.
          </ToolNote>
        </>
      }
    />
  );
}
