"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  SelectField,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

const THRESHOLD = 1000000; // ₹10L LRS / tour / vehicle threshold (FY 2025-26)

const TYPES = [
  { value: "lrs", label: "Foreign remittance — LRS (investment, gifts etc.)" },
  { value: "eduLoan", label: "Education abroad — funded by education loan" },
  { value: "eduMedical", label: "Education / medical treatment abroad (own funds)" },
  { value: "tour", label: "Overseas tour programme package" },
  { value: "vehicle", label: "Purchase of motor vehicle above ₹10L" },
  { value: "scrap", label: "Sale of scrap" },
];

type Row = { label: string; value: string };

function computeTcs(type: string, amt: number): { tcs: number; rows: Row[] } {
  const above = Math.max(0, amt - THRESHOLD);
  const upTo = Math.min(amt, THRESHOLD);

  switch (type) {
    case "lrs":
      return {
        tcs: above * 0.2,
        rows: [
          { label: "No TCS up to ₹10L per FY", value: inr(upTo) },
          { label: "Amount above ₹10L", value: inr(above) },
          { label: "TCS @ 20% on the excess", value: inr(above * 0.2) },
        ],
      };
    case "eduLoan":
      return {
        tcs: 0,
        rows: [{ label: "TCS rate (education-loan funded)", value: "0%" }],
      };
    case "eduMedical":
      return {
        tcs: above * 0.05,
        rows: [
          { label: "No TCS up to ₹10L per FY", value: inr(upTo) },
          { label: "Amount above ₹10L", value: inr(above) },
          { label: "TCS @ 5% on the excess", value: inr(above * 0.05) },
        ],
      };
    case "tour":
      return {
        tcs: upTo * 0.05 + above * 0.2,
        rows: [
          { label: "First ₹10L @ 5%", value: inr(upTo * 0.05) },
          { label: "Above ₹10L @ 20%", value: inr(above * 0.2) },
        ],
      };
    case "vehicle":
      return {
        tcs: amt > THRESHOLD ? amt * 0.01 : 0,
        rows: [
          {
            label: "Above ₹10L threshold?",
            value: amt > THRESHOLD ? "Yes — TCS applies" : "No — no TCS",
          },
          {
            label: "TCS @ 1% on full sale value",
            value: inr(amt > THRESHOLD ? amt * 0.01 : 0),
          },
        ],
      };
    default: // scrap
      return {
        tcs: amt * 0.01,
        rows: [{ label: "TCS @ 1% on full amount (no threshold)", value: inr(amt * 0.01) }],
      };
  }
}

export default function TcsCalculator() {
  const [type, setType] = useState("lrs");
  const [amount, setAmount] = useState<number | "">(1500000);

  const amt = Number(amount) || 0;
  const { tcs, rows } = computeTcs(type, amt);
  const effectiveRate = amt > 0 ? (tcs / amt) * 100 : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            label="Transaction type"
            value={type}
            onChange={setType}
            options={TYPES}
          />
          <NumberField
            label="Transaction amount"
            prefix="₹"
            value={amount}
            onChange={setAmount}
            hint="For LRS, use your total remittance in the financial year"
          />
        </>
      }
      results={
        <>
          <BigResult label="TCS to be collected" value={inr(tcs)} />
          <ResultCard title="How it is applied">
            <ResultRow label="Transaction amount" value={inr(amt)} />
            {rows.map((row) => (
              <ResultRow key={row.label} label={row.label} value={row.value} />
            ))}
            <ResultRow label="Total TCS" value={inr(tcs)} bold />
            <ResultRow label="Effective TCS rate" value={`${effectiveRate.toFixed(2)}%`} />
          </ResultCard>
          <ToolNote>
            Rates for FY 2025-26 u/s 206C: the LRS / overseas tour threshold is
            ₹10L per financial year (raised from ₹7L on 1 Apr 2025). TCS is not
            an extra tax — it is adjustable against your income tax liability or
            refundable in your ITR. Higher rates apply without PAN. Verify with
            your bank or CA.
          </ToolNote>
        </>
      }
    />
  );
}
