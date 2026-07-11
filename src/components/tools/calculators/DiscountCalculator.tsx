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

export default function DiscountCalculator() {
  const [price, setPrice] = useState<number | "">(2000);
  const [mode, setMode] = useState<"percent" | "flat">("percent");
  const [discount, setDiscount] = useState<number | "">(20);
  const [extra, setExtra] = useState<number | "">(0);

  const p = Number(price) || 0;
  const d = Number(discount) || 0;
  const e = Number(extra) || 0;

  const afterFirst = Math.max(0, mode === "percent" ? p * (1 - d / 100) : p - d);
  const finalPrice = Math.max(0, afterFirst * (1 - e / 100));
  const savings = p - finalPrice;
  const effectivePct = p > 0 ? `${formatINR((savings / p) * 100, 1)}%` : "—";

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Original price (MRP)"
            prefix="₹"
            value={price}
            onChange={setPrice}
          />
          <ToggleGroup
            label="Discount type"
            value={mode}
            onChange={(v) => setMode(v as "percent" | "flat")}
            options={[
              { value: "percent", label: "Percentage (%)" },
              { value: "flat", label: "Flat amount (₹)" },
            ]}
          />
          <NumberField
            label={mode === "percent" ? "Discount" : "Flat discount"}
            prefix={mode === "flat" ? "₹" : undefined}
            suffix={mode === "percent" ? "%" : undefined}
            value={discount}
            onChange={setDiscount}
          />
          <NumberField
            label="Extra discount (optional)"
            suffix="%"
            value={extra}
            onChange={setExtra}
            hint="Stacked offers like “20% + extra 10%” — applied on the already discounted price."
          />
        </>
      }
      results={
        <>
          <BigResult label="Final price" value={inr(finalPrice, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="Original price" value={inr(p, 2)} />
            <ResultRow
              label={mode === "percent" ? `After ${formatINR(d, 1)}% off` : "After flat discount"}
              value={inr(afterFirst, 2)}
            />
            {e > 0 && (
              <ResultRow
                label={`After extra ${formatINR(e, 1)}% off`}
                value={inr(finalPrice, 2)}
              />
            )}
            <ResultRow label="You save" value={inr(savings, 2)} bold />
            <ResultRow label="Effective discount" value={effectivePct} />
          </ResultCard>
          <ToolNote>
            Stacked discounts apply on the reduced price, not the MRP — so
            “20% + 10%” works out to an effective 28% off, not 30%. Prices shown
            here exclude any GST that may be charged on the discounted amount.
          </ToolNote>
        </>
      }
    />
  );
}
