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

const GST_ON_FEES = 18;

export default function SwiggyZomatoCommissionCalculator() {
  const [orderValue, setOrderValue] = useState<number | "">(500);
  const [commissionPct, setCommissionPct] = useState<number | "">(25);
  const [pgPct, setPgPct] = useState<number | "">(2);
  const [discount, setDiscount] = useState<number | "">(20);

  const order = Number(orderValue) || 0;
  const cPct = Number(commissionPct) || 0;
  const pPct = Number(pgPct) || 0;
  const disc = Number(discount) || 0;

  const commission = order * (cPct / 100);
  const pgFee = order * (pPct / 100);
  const gstOnFees = (commission + pgFee) * (GST_ON_FEES / 100);
  const totalDeductions = commission + pgFee + gstOnFees + disc;
  const netPayout = order - totalDeductions;
  const takeRate = order > 0 ? (totalDeductions / order) * 100 : NaN;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Order value"
            prefix="₹"
            value={orderValue}
            onChange={setOrderValue}
            hint="Item total the customer pays (before platform-level charges)."
          />
          <NumberField
            label="Platform commission"
            suffix="%"
            value={commissionPct}
            onChange={setCommissionPct}
            hint="Swiggy/Zomato typically charge 18–30% depending on city and contract."
          />
          <NumberField
            label="Payment gateway fee"
            suffix="%"
            value={pgPct}
            onChange={setPgPct}
            hint="Charged on the order value, usually around 2%."
          />
          <NumberField
            label="Restaurant-funded discount"
            prefix="₹"
            value={discount}
            onChange={setDiscount}
            hint="Your share of coupons/offers on this order, if any."
          />
        </>
      }
      results={
        <>
          <BigResult label="Net payout to restaurant" value={inr(netPayout, 2)} />
          <ResultCard title="Deduction breakup">
            <ResultRow label="Order value" value={inr(order, 2)} />
            <ResultRow
              label={`Commission @ ${cPct.toFixed(1)}%`}
              value={inr(commission, 2)}
              negative
            />
            <ResultRow
              label={`Payment gateway fee @ ${pPct.toFixed(1)}%`}
              value={inr(pgFee, 2)}
              negative
            />
            <ResultRow
              label={`GST @ ${GST_ON_FEES}% on commission + PG fee`}
              value={inr(gstOnFees, 2)}
              negative
            />
            <ResultRow label="Restaurant-funded discount" value={inr(disc, 2)} negative />
            <ResultRow label="Total deductions" value={inr(totalDeductions, 2)} bold />
            <ResultRow
              label="Effective take-rate"
              value={isFinite(takeRate) ? `${takeRate.toFixed(1)}%` : "—"}
              bold
            />
          </ResultCard>
          <ToolNote>
            Estimates based on typical aggregator terms: commission and PG fee
            attract 18% GST, which the platform collects on its invoice to you.
            Actual payouts also adjust for TDS/TCS under GST, refunds and
            weekly settlement cycles — check your platform statement for exact
            figures.
          </ToolNote>
        </>
      }
    />
  );
}
