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

export default function EmployeeCostCalculator() {
  const [ctc, setCtc] = useState<number | "">(1200000);
  const [pfInCtc, setPfInCtc] = useState<"yes" | "no">("yes");
  const [gratuityProvision, setGratuityProvision] = useState<"yes" | "no">("yes");
  const [overheads, setOverheads] = useState<number | "">(60000);

  const annualCtc = Number(ctc) || 0;
  const extraOverheads = Number(overheads) || 0;

  // Assume basic + DA = 50% of CTC (typical Indian salary structure).
  const assumedBasic = annualCtc * 0.5;

  // Employer PF = 12% of basic+DA. Add only if it is NOT already inside the CTC.
  const employerPf = pfInCtc === "no" ? assumedBasic * 0.12 : 0;

  // Gratuity provision ≈ 4.81% of basic+DA per year (15/26 ÷ 12 months).
  const gratuity = gratuityProvision === "yes" ? assumedBasic * 0.0481 : 0;

  const totalAnnual = annualCtc + employerPf + gratuity + extraOverheads;
  const monthly = totalAnnual / 12;
  const multiple = annualCtc > 0 ? totalAnnual / annualCtc : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Annual CTC"
            prefix="₹"
            value={ctc}
            onChange={setCtc}
            hint="Cost to company as per the offer letter"
          />
          <ToggleGroup
            label="Is employer PF already included in CTC?"
            value={pfInCtc}
            onChange={(v) => setPfInCtc(v as "yes" | "no")}
            options={[
              { value: "yes", label: "Yes, included" },
              { value: "no", label: "No, paid over CTC" },
            ]}
          />
          <ToggleGroup
            label="Provision for gratuity?"
            value={gratuityProvision}
            onChange={(v) => setGratuityProvision(v as "yes" | "no")}
            options={[
              { value: "yes", label: "Yes (~4.81% of basic)" },
              { value: "no", label: "No" },
            ]}
          />
          <NumberField
            label="Other annual overheads"
            prefix="₹"
            value={overheads}
            onChange={setOverheads}
            hint="Insurance, laptop/equipment, software licences, training, etc."
          />
        </>
      }
      results={
        <>
          <BigResult label="True annual employee cost" value={inr(totalAnnual)} />
          <ResultCard title="Cost breakup (per year)">
            <ResultRow label="CTC" value={inr(annualCtc)} />
            <ResultRow
              label="Employer PF (12% of assumed basic)"
              value={employerPf > 0 ? inr(employerPf) : "Included in CTC"}
            />
            <ResultRow
              label="Gratuity provision (4.81% of basic)"
              value={gratuity > 0 ? inr(gratuity) : "—"}
            />
            <ResultRow label="Other overheads" value={inr(extraOverheads)} />
            <ResultRow label="Total annual cost" value={inr(totalAnnual)} bold />
            <ResultRow label="Monthly cost" value={inr(monthly)} />
            <ResultRow label="Cost as multiple of CTC" value={`${multiple.toFixed(2)}×`} />
          </ResultCard>
          <ToolNote>
            Assumes basic + DA is 50% of CTC for the PF and gratuity estimates.
            Employer PF is 12% of basic + DA; gratuity provision is taken at 4.81%
            of basic per year. Actual cost depends on your salary structure and
            benefits policy — use this as a planning estimate.
          </ToolNote>
        </>
      }
    />
  );
}
