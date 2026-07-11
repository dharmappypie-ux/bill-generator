"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  TextField,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

type Ingredient = { name: string; qty: number | ""; price: number | "" };

const DEFAULT_INGREDIENTS: Ingredient[] = [
  { name: "Paneer", qty: 0.5, price: 400 },
  { name: "Tomatoes", qty: 0.3, price: 40 },
  { name: "Butter & cream", qty: 0.2, price: 500 },
  { name: "Spices & masala", qty: 1, price: 15 },
];

export default function RecipeCostingCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS);
  const [servings, setServings] = useState<number | "">(4);
  const [targetPct, setTargetPct] = useState<number | "">(30);

  const update = (i: number, patch: Partial<Ingredient>) =>
    setIngredients((rows) =>
      rows.map((row, idx) => (idx === i ? { ...row, ...patch } : row))
    );
  const addRow = () =>
    setIngredients((rows) => [...rows, { name: "", qty: "", price: "" }]);
  const removeRow = (i: number) =>
    setIngredients((rows) => rows.filter((_, idx) => idx !== i));

  const totalCost = ingredients.reduce(
    (sum, row) => sum + (Number(row.qty) || 0) * (Number(row.price) || 0),
    0
  );
  const serv = Number(servings) || 0;
  const target = Number(targetPct) || 0;
  const costPerServing = serv > 0 ? totalCost / serv : 0;
  const suggestedPrice = target > 0 ? costPerServing / (target / 100) : 0;

  return (
    <ToolLayout
      inputs={
        <>
          {ingredients.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.4fr_0.8fr_0.9fr_auto] items-end gap-2"
            >
              <TextField
                label={i === 0 ? "Ingredient" : ""}
                value={row.name}
                onChange={(v) => update(i, { name: v })}
                placeholder="e.g. Paneer"
              />
              <NumberField
                label={i === 0 ? "Qty (kg/unit)" : ""}
                value={row.qty}
                onChange={(v) => update(i, { qty: v })}
                step={0.1}
              />
              <NumberField
                label={i === 0 ? "Price per kg/unit" : ""}
                prefix="₹"
                value={row.price}
                onChange={(v) => update(i, { price: v })}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                disabled={ingredients.length <= 1}
                className="mb-1 rounded-full px-3 py-1.5 text-sm font-semibold text-inkSoft transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                aria-label="Remove ingredient"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="rounded-full px-4 py-1.5 text-[13px] font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            + Add ingredient
          </button>
          <NumberField
            label="Servings this recipe yields"
            value={servings}
            onChange={setServings}
          />
          <NumberField
            label="Target food cost"
            suffix="%"
            value={targetPct}
            onChange={setTargetPct}
            hint="Most Indian restaurants target 28–32%."
          />
        </>
      }
      results={
        <>
          <BigResult label="Cost per serving" value={inr(costPerServing, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="Total recipe cost" value={inr(totalCost, 2)} />
            <ResultRow label="Cost per serving" value={inr(costPerServing, 2)} />
            <ResultRow
              label={`Suggested menu price @ ${target || "—"}% food cost`}
              value={inr(suggestedPrice, 2)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Suggested price = cost per serving ÷ target food cost %. Remember to
            factor wastage, garnish and packaging into ingredient quantities, and
            add GST (5% for restaurants without ITC) on top of the menu price
            where applicable.
          </ToolNote>
        </>
      }
    />
  );
}
