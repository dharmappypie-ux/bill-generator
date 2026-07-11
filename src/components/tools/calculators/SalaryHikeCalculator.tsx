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

export default function SalaryHikeCalculator() {
  const [mode, setMode] = useState<"newSalary" | "hikePct">("newSalary");
  const [current, setCurrent] = useState<number | "">(50000);
  const [hike, setHike] = useState<number | "">(15);
  const [oldSalary, setOldSalary] = useState<number | "">(50000);
  const [newSalary, setNewSalary] = useState<number | "">(60000);

  const cur = Number(current) || 0;
  const pct = Number(hike) || 0;
  const oldS = Number(oldSalary) || 0;
  const newS = Number(newSalary) || 0;

  // Mode a: current + hike % → new salary
  const revised = cur * (1 + pct / 100);
  const increaseA = revised - cur;

  // Mode b: old + new → hike %
  const increaseB = newS - oldS;
  const hikePct = oldS > 0 ? (increaseB / oldS) * 100 : 0;

  const isA = mode === "newSalary";

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="What do you want to find?"
            value={mode}
            onChange={(v) => setMode(v as "newSalary" | "hikePct")}
            options={[
              { value: "newSalary", label: "New salary from hike %" },
              { value: "hikePct", label: "Hike % from old & new salary" },
            ]}
          />
          {isA ? (
            <>
              <NumberField
                label="Current monthly salary"
                prefix="₹"
                value={current}
                onChange={setCurrent}
              />
              <NumberField
                label="Hike percentage"
                suffix="%"
                value={hike}
                onChange={setHike}
                hint="The increment offered on your current salary."
              />
            </>
          ) : (
            <>
              <NumberField
                label="Old monthly salary"
                prefix="₹"
                value={oldSalary}
                onChange={setOldSalary}
              />
              <NumberField
                label="New monthly salary"
                prefix="₹"
                value={newSalary}
                onChange={setNewSalary}
              />
            </>
          )}
        </>
      }
      results={
        <>
          {isA ? (
            <BigResult label="New monthly salary" value={inr(revised)} />
          ) : (
            <BigResult
              label="Hike percentage"
              value={oldS > 0 ? `${formatINR(hikePct, 2)}%` : "—"}
            />
          )}
          <ResultCard title="Details">
            {isA ? (
              <>
                <ResultRow label="Current salary (monthly)" value={inr(cur)} />
                <ResultRow label={`Hike @ ${formatINR(pct, 2)}%`} value={inr(increaseA)} />
                <ResultRow label="New salary (monthly)" value={inr(revised)} bold />
                <ResultRow label="Monthly increase" value={inr(increaseA)} />
                <ResultRow label="Annual increase" value={inr(increaseA * 12)} />
                <ResultRow label="New salary (annual)" value={inr(revised * 12)} bold />
              </>
            ) : (
              <>
                <ResultRow label="Old salary (monthly)" value={inr(oldS)} />
                <ResultRow label="New salary (monthly)" value={inr(newS)} />
                <ResultRow label="Monthly increase" value={inr(increaseB)} />
                <ResultRow label="Annual increase" value={inr(increaseB * 12)} />
                <ResultRow
                  label="Hike percentage"
                  value={oldS > 0 ? `${formatINR(hikePct, 2)}%` : "—"}
                  bold
                />
              </>
            )}
          </ResultCard>
          <ToolNote>
            Figures assume the hike applies uniformly to your full salary. Actual
            in-hand change can differ because PF, professional tax and income tax
            (TDS) also change with your revised salary — use the in-hand salary
            calculator to estimate your new take-home.
          </ToolNote>
        </>
      }
    />
  );
}
