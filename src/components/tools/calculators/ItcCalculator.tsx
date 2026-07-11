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

export default function ItcCalculator() {
  const [igstOut, setIgstOut] = useState<number | "">(40000);
  const [cgstOut, setCgstOut] = useState<number | "">(25000);
  const [sgstOut, setSgstOut] = useState<number | "">(25000);
  const [igstItc, setIgstItc] = useState<number | "">(30000);
  const [cgstItc, setCgstItc] = useState<number | "">(20000);
  const [sgstItc, setSgstItc] = useState<number | "">(10000);

  let igstDue = Number(igstOut) || 0;
  let cgstDue = Number(cgstOut) || 0;
  let sgstDue = Number(sgstOut) || 0;
  let igstCr = Number(igstItc) || 0;
  let cgstCr = Number(cgstItc) || 0;
  let sgstCr = Number(sgstItc) || 0;

  const use = (credit: number, due: number) => Math.min(credit, due);

  // Step 1: IGST credit → IGST, then CGST, then SGST (must exhaust first).
  const igstToIgst = use(igstCr, igstDue);
  igstCr -= igstToIgst;
  igstDue -= igstToIgst;
  const igstToCgst = use(igstCr, cgstDue);
  igstCr -= igstToCgst;
  cgstDue -= igstToCgst;
  const igstToSgst = use(igstCr, sgstDue);
  igstCr -= igstToSgst;
  sgstDue -= igstToSgst;

  // Step 2: CGST credit → CGST, then IGST (never SGST).
  const cgstToCgst = use(cgstCr, cgstDue);
  cgstCr -= cgstToCgst;
  cgstDue -= cgstToCgst;
  const cgstToIgst = use(cgstCr, igstDue);
  cgstCr -= cgstToIgst;
  igstDue -= cgstToIgst;

  // Step 3: SGST credit → SGST, then IGST (never CGST).
  const sgstToSgst = use(sgstCr, sgstDue);
  sgstCr -= sgstToSgst;
  sgstDue -= sgstToSgst;
  const sgstToIgst = use(sgstCr, igstDue);
  sgstCr -= sgstToIgst;
  igstDue -= sgstToIgst;

  const cashPayable = igstDue + cgstDue + sgstDue;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField label="Output IGST liability" prefix="₹" value={igstOut} onChange={setIgstOut} />
          <NumberField label="Output CGST liability" prefix="₹" value={cgstOut} onChange={setCgstOut} />
          <NumberField label="Output SGST liability" prefix="₹" value={sgstOut} onChange={setSgstOut} />
          <NumberField label="Available IGST credit" prefix="₹" value={igstItc} onChange={setIgstItc} />
          <NumberField label="Available CGST credit" prefix="₹" value={cgstItc} onChange={setCgstItc} />
          <NumberField label="Available SGST credit" prefix="₹" value={sgstItc} onChange={setSgstItc} />
        </>
      }
      results={
        <>
          <BigResult label="Net cash payable" value={inr(cashPayable, 2)} />
          <ResultCard title="ITC utilisation (set-off order)">
            <ResultRow label="IGST credit → IGST" value={inr(igstToIgst, 2)} />
            <ResultRow label="IGST credit → CGST" value={inr(igstToCgst, 2)} />
            <ResultRow label="IGST credit → SGST" value={inr(igstToSgst, 2)} />
            <ResultRow label="CGST credit → CGST" value={inr(cgstToCgst, 2)} />
            <ResultRow label="CGST credit → IGST" value={inr(cgstToIgst, 2)} />
            <ResultRow label="SGST credit → SGST" value={inr(sgstToSgst, 2)} />
            <ResultRow label="SGST credit → IGST" value={inr(sgstToIgst, 2)} />
          </ResultCard>
          <ResultCard title="After set-off">
            <ResultRow label="IGST payable in cash" value={inr(igstDue, 2)} />
            <ResultRow label="CGST payable in cash" value={inr(cgstDue, 2)} />
            <ResultRow label="SGST payable in cash" value={inr(sgstDue, 2)} />
            <ResultRow label="Total cash payable" value={inr(cashPayable, 2)} bold />
            <ResultRow
              label="Credit carried forward (IGST / CGST / SGST)"
              value={`${inr(igstCr, 2)} / ${inr(cgstCr, 2)} / ${inr(sgstCr, 2)}`}
            />
          </ResultCard>
          <ToolNote>
            Set-off order per Sections 49A/49B and Rule 88A: IGST credit must be
            fully used first (against IGST, then CGST, then SGST). CGST credit
            can offset CGST and IGST; SGST credit can offset SGST and IGST.
            CGST and SGST credits can never be cross-utilised against each
            other. Verify final figures on the GST portal before filing GSTR-3B.
          </ToolNote>
        </>
      }
    />
  );
}
