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

export default function MenuPricingCalculator() {
  const [foodCost, setFoodCost] = useState<number | "">(90);
  const [targetSel, setTargetSel] = useState("30");
  const [customPct, setCustomPct] = useState<number | "">(28);
  const [gstMode, setGstMode] = useState<"with" | "without">("with");

  const cost = Number(foodCost) || 0;
  const targetPct =
    targetSel === "custom" ? Number(customPct) || 0 : Number(targetSel);

  const price = targetPct > 0 ? cost / (targetPct / 100) : 0;
  const grossMargin = price - cost;
  const marginPct = price > 0 ? (grossMargin / price) * 100 : 0;
  const gst = gstMode === "with" ? price * 0.05 : 0;
  const finalPrice = price + gst;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Food cost of the dish"
            prefix="₹"
            value={foodCost}
            onChange={setFoodCost}
            hint="Total ingredient cost per plate, including wastage and garnish."
          />
          <ToggleGroup
            label="Target food cost %"
            value={targetSel}
            onChange={setTargetSel}
            options={[
              { value: "25", label: "25%" },
              { value: "30", label: "30%" },
              { value: "35", label: "35%" },
              { value: "custom", label: "Custom" },
            ]}
          />
          {targetSel === "custom" && (
            <NumberField
              label="Custom target food cost"
              suffix="%"
              value={customPct}
              onChange={setCustomPct}
            />
          )}
          <ToggleGroup
            label="GST on menu price"
            value={gstMode}
            onChange={(v) => setGstMode(v as "with" | "without")}
            options={[
              { value: "with", label: "Add 5% GST (restaurant)" },
              { value: "without", label: "Without GST" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Suggested selling price" value={inr(price, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="Food cost per plate" value={inr(cost, 2)} />
            <ResultRow
              label={`Gross margin (${formatINR(marginPct, 1)}%)`}
              value={inr(grossMargin, 2)}
            />
            {gstMode === "with" && (
              <ResultRow label="GST @ 5%" value={inr(gst, 2)} />
            )}
            <ResultRow
              label={gstMode === "with" ? "Menu price incl. GST" : "Menu price"}
              value={inr(finalPrice, 2)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Price = food cost ÷ target food cost %. Standalone restaurants
            charge 5% GST without input tax credit; restaurants inside hotels
            with room tariff above ₹7,500 charge 18% with ITC. Round the final
            price to a menu-friendly figure (₹299, ₹315 etc.) and re-check the
            resulting margin.
          </ToolNote>
        </>
      }
    />
  );
}
