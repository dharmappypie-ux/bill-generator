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

export default function RestaurantFranchiseCostCalculator() {
  const [franchiseFee, setFranchiseFee] = useState<number | "">(1000000);
  const [setupCost, setSetupCost] = useState<number | "">(2500000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | "">(800000);
  const [royaltyPct, setRoyaltyPct] = useState<number | "">(6);
  const [marginPct, setMarginPct] = useState<number | "">(18);

  const fee = Number(franchiseFee) || 0;
  const setup = Number(setupCost) || 0;
  const revenue = Number(monthlyRevenue) || 0;
  const royalty = Number(royaltyPct) || 0;
  const margin = Number(marginPct) || 0;

  const totalInvestment = fee + setup;
  const royaltyAmt = revenue * (royalty / 100);
  const monthlyProfit = revenue * ((margin - royalty) / 100);
  const paybackMonths = monthlyProfit > 0 ? totalInvestment / monthlyProfit : Infinity;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Franchise fee (one-time)"
            prefix="₹"
            value={franchiseFee}
            onChange={setFranchiseFee}
          />
          <NumberField
            label="Setup / fit-out cost"
            prefix="₹"
            value={setupCost}
            onChange={setSetupCost}
            hint="Interiors, kitchen equipment, signage, deposits and launch costs."
          />
          <NumberField
            label="Expected monthly revenue"
            prefix="₹"
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
          />
          <NumberField
            label="Royalty (% of revenue)"
            suffix="%"
            value={royaltyPct}
            onChange={setRoyaltyPct}
            hint="Most Indian F&B franchises charge 4–8% of monthly revenue."
          />
          <NumberField
            label="Expected net margin before royalty"
            suffix="%"
            value={marginPct}
            onChange={setMarginPct}
            hint="Operating profit as % of revenue, before paying royalty."
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Payback period"
            value={
              isFinite(paybackMonths)
                ? `${formatINR(paybackMonths, 1)} months`
                : "—"
            }
          />
          <ResultCard title="Breakup">
            <ResultRow label="Franchise fee" value={inr(fee)} />
            <ResultRow label="Setup / fit-out cost" value={inr(setup)} />
            <ResultRow label="Total investment" value={inr(totalInvestment)} bold />
            <ResultRow
              label={`Monthly royalty @ ${royalty.toFixed(1)}%`}
              value={inr(royaltyAmt)}
              negative
            />
            <ResultRow
              label={`Monthly profit after royalty (${(margin - royalty).toFixed(1)}%)`}
              value={inr(monthlyProfit)}
              bold
            />
            <ResultRow
              label="Payback in years"
              value={isFinite(paybackMonths) ? formatINR(paybackMonths / 12, 1) : "—"}
            />
          </ResultCard>
          <ToolNote>
            Assumes steady revenue from month one and a constant margin — real
            outlets usually ramp up over 6–12 months, so actual payback is
            longer. Excludes loan interest, taxes, renewal fees and marketing
            contributions some franchisors charge on top of royalty.
          </ToolNote>
        </>
      }
    />
  );
}
