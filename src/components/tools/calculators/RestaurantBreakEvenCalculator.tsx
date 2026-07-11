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

export default function RestaurantBreakEvenCalculator() {
  const [rent, setRent] = useState<number | "">(60000);
  const [salaries, setSalaries] = useState<number | "">(120000);
  const [utilities, setUtilities] = useState<number | "">(40000);
  const [aov, setAov] = useState<number | "">(350);
  const [varCost, setVarCost] = useState<number | "">(40);

  const fixedCosts =
    (Number(rent) || 0) + (Number(salaries) || 0) + (Number(utilities) || 0);
  const orderValue = Number(aov) || 0;
  const vcPct = Number(varCost) || 0;

  const contribution = orderValue * (1 - vcPct / 100);
  const beOrders = contribution > 0 ? fixedCosts / contribution : Infinity;
  const beSales = isFinite(beOrders) ? beOrders * orderValue : Infinity;
  const ordersPerDay = beOrders / 30;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly rent"
            prefix="₹"
            value={rent}
            onChange={setRent}
          />
          <NumberField
            label="Monthly salaries"
            prefix="₹"
            value={salaries}
            onChange={setSalaries}
          />
          <NumberField
            label="Utilities & other fixed costs"
            prefix="₹"
            value={utilities}
            onChange={setUtilities}
            hint="Electricity, gas, subscriptions, maintenance — costs that don't change with orders."
          />
          <NumberField
            label="Average order value (AOV)"
            prefix="₹"
            value={aov}
            onChange={setAov}
          />
          <NumberField
            label="Variable cost per order"
            suffix="%"
            value={varCost}
            onChange={setVarCost}
            hint="Food + packaging cost as a % of the order value. 35–45% is typical for Indian restaurants."
          />
        </>
      }
      results={
        <>
          <BigResult label="Monthly break-even sales" value={inr(beSales)} />
          <ResultCard title="How it adds up">
            <ResultRow label="Total fixed costs / month" value={inr(fixedCosts)} />
            <ResultRow
              label={`Contribution per order (${(100 - vcPct).toFixed(1)}% of AOV)`}
              value={inr(contribution, 2)}
            />
            <ResultRow
              label="Break-even orders / month"
              value={formatINR(beOrders)}
            />
            <ResultRow
              label="Orders needed per day (÷ 30)"
              value={formatINR(ordersPerDay, 1)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Assumes a 30-day month and a constant variable cost percentage.
            Break-even is where contribution (AOV minus food & packaging cost)
            exactly covers fixed costs — every order beyond this is profit. Use
            it as a planning estimate, not an accounting figure.
          </ToolNote>
        </>
      }
    />
  );
}
