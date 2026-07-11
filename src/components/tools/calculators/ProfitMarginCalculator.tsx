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

export default function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState<number | "">(1000000);
  const [cogs, setCogs] = useState<number | "">(600000);
  const [opex, setOpex] = useState<number | "">(250000);
  const [other, setOther] = useState<number | "">(50000);

  const rev = Number(revenue) || 0;
  const cost = Number(cogs) || 0;
  const op = Number(opex) || 0;
  const oth = Number(other) || 0;

  const grossProfit = rev - cost;
  const operatingProfit = grossProfit - op;
  const netProfit = operatingProfit - oth;

  const pct = (n: number) => (rev > 0 ? `${formatINR((n / rev) * 100, 1)}%` : "—");
  const markup = cost > 0 ? `${formatINR((grossProfit / cost) * 100, 1)}%` : "—";

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Revenue (net sales)"
            prefix="₹"
            value={revenue}
            onChange={setRevenue}
          />
          <NumberField
            label="Cost of goods sold (COGS)"
            prefix="₹"
            value={cogs}
            onChange={setCogs}
            hint="Direct costs — raw material, purchases, direct labour."
          />
          <NumberField
            label="Operating expenses"
            prefix="₹"
            value={opex}
            onChange={setOpex}
            hint="Rent, salaries, utilities, marketing and other overheads."
          />
          <NumberField
            label="Other expenses + tax"
            prefix="₹"
            value={other}
            onChange={setOther}
            hint="Interest, depreciation, income tax, one-off costs."
          />
        </>
      }
      results={
        <>
          <BigResult label="Net profit margin" value={pct(netProfit)} />
          <ResultCard title="Margin breakup">
            <ResultRow
              label={`Gross profit (margin ${pct(grossProfit)})`}
              value={inr(Math.abs(grossProfit))}
              negative={grossProfit < 0}
            />
            <ResultRow
              label={`Operating profit (margin ${pct(operatingProfit)})`}
              value={inr(Math.abs(operatingProfit))}
              negative={operatingProfit < 0}
            />
            <ResultRow
              label="Net profit"
              value={inr(Math.abs(netProfit))}
              bold
              negative={netProfit < 0}
            />
            <ResultRow label="Markup on cost" value={markup} />
          </ResultCard>
          <ToolNote>
            Margins are calculated on revenue: gross = (revenue − COGS), operating
            = gross − operating expenses, net = operating − other expenses and
            tax. Markup is gross profit as a % of COGS — a 40% margin equals a
            66.7% markup. Use consistent GST-exclusive figures for accuracy.
          </ToolNote>
        </>
      }
    />
  );
}
