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

const PF_RATE = 0.12; // 12% of basic, employee and employer each
const GRATUITY_RATE = 0.0481; // 4.81% of basic, employer provision

function structure(ctcAnnual: number, basicPct: number) {
  const basic = ctcAnnual * (basicPct / 100);
  const employeePf = basic * PF_RATE;
  const employerPf = basic * PF_RATE;
  const gratuity = basic * GRATUITY_RATE;
  // Gross pay = CTC minus employer-side costs; take-home = gross minus employee PF.
  const gross = Math.max(0, ctcAnnual - employerPf - gratuity);
  const takeHome = Math.max(0, gross - employeePf);
  return { basic, employeePf, employerPf, gratuity, takeHome };
}

export default function LabourCodeSalaryStructureCalculator() {
  const [ctc, setCtc] = useState<number | "">(1200000);
  const [basicPct, setBasicPct] = useState<number | "">(35);

  const ctcNum = Number(ctc) || 0;
  const pct = Math.min(100, Math.max(0, Number(basicPct) || 0));
  const newPct = Math.max(pct, 50);

  const current = structure(ctcNum, pct);
  const labourCode = structure(ctcNum, newPct);

  const monthlyChange = (labourCode.takeHome - current.takeHome) / 12;
  const pair = (a: number, b: number) => `${inr(a / 12, 0)} → ${inr(b / 12, 0)}`;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Annual CTC"
            prefix="₹"
            value={ctc}
            onChange={setCtc}
          />
          <NumberField
            label="Current basic pay as % of CTC"
            value={basicPct}
            onChange={setBasicPct}
            suffix="%"
            min={0}
            hint="Under the new labour codes, 'wages' (basic + DA) must be at least 50% of total remuneration."
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Monthly take-home changes by"
            value={
              monthlyChange === 0
                ? "₹0 (already compliant)"
                : `${monthlyChange < 0 ? "−" : "+"}${inr(Math.abs(monthlyChange), 0)}`
            }
            accent={monthlyChange < 0}
          />
          <ResultCard title="Current vs labour-code structure (monthly)">
            <ResultRow
              label={`Basic pay (${pct.toFixed(0)}% → ${newPct.toFixed(0)}% of CTC)`}
              value={pair(current.basic, labourCode.basic)}
            />
            <ResultRow
              label="Employee PF @ 12% of basic"
              value={pair(current.employeePf, labourCode.employeePf)}
            />
            <ResultRow
              label="Employer PF @ 12% of basic"
              value={pair(current.employerPf, labourCode.employerPf)}
            />
            <ResultRow
              label="Gratuity provision @ 4.81% of basic"
              value={pair(current.gratuity, labourCode.gratuity)}
            />
            <ResultRow
              label="Estimated take-home"
              value={pair(current.takeHome, labourCode.takeHome)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Simplified model: take-home = CTC − employer PF − gratuity provision
            − employee PF, ignoring income tax, professional tax, ESI and other
            allowance-specific rules. Assumes full-basic PF (no ₹15,000 wage
            cap) and gratuity provisioning at 4.81% of basic. The new labour
            codes&apos; 50% wage definition raises retirals and typically lowers
            monthly take-home — actual impact depends on your employer&apos;s
            structure.
          </ToolNote>
        </>
      }
    />
  );
}
