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
} from "@/components/tools/ui";

export default function GstCalculator() {
  const [amount, setAmount] = useState<number | "">(10000);
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [supply, setSupply] = useState<"intra" | "inter">("intra");

  const amt = Number(amount) || 0;
  const r = Number(rate);

  const base = mode === "add" ? amt : amt / (1 + r / 100);
  const gst = mode === "add" ? amt * (r / 100) : amt - base;
  const total = mode === "add" ? amt + gst : amt;

  return (
    <ToolLayout
      inputs={
        <>
          <ToggleGroup
            label="What do you want to do?"
            value={mode}
            onChange={(v) => setMode(v as "add" | "remove")}
            options={[
              { value: "add", label: "Add GST" },
              { value: "remove", label: "Remove GST (inclusive)" },
            ]}
          />
          <NumberField
            label={mode === "add" ? "Amount (before GST)" : "Amount (including GST)"}
            prefix="₹"
            value={amount}
            onChange={setAmount}
          />
          <ToggleGroup
            label="GST rate"
            value={rate}
            onChange={setRate}
            options={["0.25", "3", "5", "12", "18", "28"].map((v) => ({
              value: v,
              label: `${v}%`,
            }))}
          />
          <ToggleGroup
            label="Type of supply"
            value={supply}
            onChange={(v) => setSupply(v as "intra" | "inter")}
            options={[
              { value: "intra", label: "Within state (CGST + SGST)" },
              { value: "inter", label: "Interstate (IGST)" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Total GST" value={inr(gst, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="Base amount" value={inr(base, 2)} />
            {supply === "intra" ? (
              <>
                <ResultRow label={`CGST @ ${r / 2}%`} value={inr(gst / 2, 2)} />
                <ResultRow label={`SGST @ ${r / 2}%`} value={inr(gst / 2, 2)} />
              </>
            ) : (
              <ResultRow label={`IGST @ ${r}%`} value={inr(gst, 2)} />
            )}
            <ResultRow label="Invoice total" value={inr(total, 2)} bold />
          </ResultCard>
          <ToolNote>
            GST rates and rules are set by the GST Council and change from time to
            time. This tool is for quick estimation — verify with your CA or the
            official GST portal before filing.
          </ToolNote>
        </>
      }
    />
  );
}
