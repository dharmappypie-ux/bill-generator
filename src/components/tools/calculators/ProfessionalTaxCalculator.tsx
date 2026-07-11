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

const STATES = [
  { value: "MH", label: "Maharashtra" },
  { value: "KA", label: "Karnataka" },
  { value: "WB", label: "West Bengal" },
  { value: "TG", label: "Telangana" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "GJ", label: "Gujarat" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "TN", label: "Tamil Nadu" },
];

/** Indicative monthly PT slabs by state. Returns { monthly, annual, slab }. */
function professionalTax(state: string, gross: number) {
  switch (state) {
    case "MH":
      if (gross > 10000)
        return { monthly: 200, annual: 2500, slab: "Above ₹10,000/mo (₹300 in Feb)" };
      if (gross >= 7500)
        return { monthly: 175, annual: 2100, slab: "₹7,500 – ₹10,000/mo" };
      return { monthly: 0, annual: 0, slab: "Up to ₹7,500/mo — nil" };
    case "KA":
      if (gross > 25000) return { monthly: 200, annual: 2400, slab: "Above ₹25,000/mo" };
      return { monthly: 0, annual: 0, slab: "Up to ₹25,000/mo — nil" };
    case "WB": {
      const m = gross > 40000 ? 200 : gross > 25000 ? 150 : gross > 15000 ? 130 : gross > 10000 ? 110 : 0;
      return { monthly: m, annual: m * 12, slab: m ? "As per WB monthly slab" : "Up to ₹10,000/mo — nil" };
    }
    case "TG":
    case "AP": {
      const m = gross > 20000 ? 200 : gross > 15000 ? 150 : 0;
      return { monthly: m, annual: m * 12, slab: m ? "As per state monthly slab" : "Up to ₹15,000/mo — nil" };
    }
    case "GJ":
      if (gross > 12000) return { monthly: 200, annual: 2400, slab: "Above ₹12,000/mo" };
      return { monthly: 0, annual: 0, slab: "Up to ₹12,000/mo — nil" };
    case "MP": {
      const annualSalary = gross * 12;
      const a = annualSalary > 400000 ? 2500 : annualSalary > 300000 ? 2000 : annualSalary > 225000 ? 1500 : 0;
      return { monthly: a / 12, annual: a, slab: a ? "As per MP annual-income slab" : "Up to ₹2.25L/yr — nil" };
    }
    case "TN": {
      const half = gross * 6;
      const h =
        half > 75000 ? 1250 : half > 60000 ? 1025 : half > 45000 ? 690 : half > 30000 ? 315 : half > 21000 ? 135 : 0;
      return { monthly: h / 6, annual: h * 2, slab: h ? "As per TN half-yearly slab" : "Up to ₹21,000/half-year — nil" };
    }
    default:
      return { monthly: 0, annual: 0, slab: "—" };
  }
}

export default function ProfessionalTaxCalculator() {
  const [state, setState] = useState("MH");
  const [salary, setSalary] = useState<number | "">(50000);

  const gross = Number(salary) || 0;
  const pt = professionalTax(state, gross);
  const stateName = STATES.find((s) => s.value === state)?.label ?? state;

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            label="State"
            value={state}
            onChange={setState}
            options={STATES}
            hint="Professional tax is levied by state governments — slabs differ by state."
          />
          <NumberField
            label="Monthly gross salary"
            prefix="₹"
            value={salary}
            onChange={setSalary}
            hint="Gross salary / wages per month before deductions."
          />
        </>
      }
      results={
        <>
          <BigResult label="Professional tax per month" value={inr(pt.monthly)} />
          <ResultCard title="Details">
            <ResultRow label="State" value={stateName} />
            <ResultRow label="Applicable slab" value={pt.slab} />
            <ResultRow label="Monthly PT" value={inr(pt.monthly)} />
            <ResultRow label="Annual PT" value={inr(pt.annual)} bold />
          </ResultCard>
          <ToolNote>
            Slabs shown are indicative for FY 2025-26 and are simplified — some states
            have gender-based or half-yearly slabs, and Maharashtra collects ₹300 in
            February. Professional tax is capped at ₹2,500 per year under Article 276.
            Confirm the exact slab with your state&apos;s commercial tax department.
          </ToolNote>
        </>
      }
    />
  );
}
