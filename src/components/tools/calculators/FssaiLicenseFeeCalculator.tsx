"use client";

import { useState } from "react";
import {
  ToolLayout,
  SelectField,
  ToggleGroup,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

const STATE_CATEGORY_FEES: Record<string, { label: string; fee: number }> = {
  mfgLarge: { label: "Manufacturer — above 1 MT/day", fee: 5000 },
  mfgSmall: { label: "Manufacturer — up to 1 MT/day", fee: 3000 },
  hotel: { label: "Hotel (3-star and above)", fee: 5000 },
  other: { label: "Restaurant / trader / other FBO", fee: 2000 },
};

export default function FssaiLicenseFeeCalculator() {
  const [turnover, setTurnover] = useState("state");
  const [category, setCategory] = useState("other");
  const [years, setYears] = useState("1");

  const yrs = Number(years) || 1;

  let licenseType = "Basic Registration";
  let perYear = 100;
  if (turnover === "state") {
    licenseType = "State License";
    perYear = STATE_CATEGORY_FEES[category]?.fee ?? 2000;
  } else if (turnover === "central") {
    licenseType = "Central License";
    perYear = 7500;
  }

  const total = perYear * yrs;

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            label="Annual turnover of the food business"
            value={turnover}
            onChange={setTurnover}
            options={[
              { value: "basic", label: "Up to ₹12 lakh — Basic Registration" },
              { value: "state", label: "₹12 lakh to ₹20 crore — State License" },
              { value: "central", label: "Above ₹20 crore — Central License" },
            ]}
          />
          {turnover === "state" && (
            <SelectField
              label="Business category"
              value={category}
              onChange={setCategory}
              options={Object.entries(STATE_CATEGORY_FEES).map(([value, o]) => ({
                value,
                label: `${o.label} — ${inr(o.fee)}/yr`,
              }))}
              hint="State license fees vary by the kind of food business."
            />
          )}
          <ToggleGroup
            label="License validity (years)"
            value={years}
            onChange={setYears}
            options={["1", "2", "3", "4", "5"].map((v) => ({
              value: v,
              label: `${v} yr`,
            }))}
          />
        </>
      }
      results={
        <>
          <BigResult label="Total government fee" value={inr(total)} />
          <ResultCard title="Fee breakup">
            <ResultRow label="License type" value={licenseType} bold />
            <ResultRow label="Government fee per year" value={inr(perYear)} />
            <ResultRow label="Validity chosen" value={`${yrs} year${yrs > 1 ? "s" : ""}`} />
            <ResultRow label="Total fee payable" value={inr(total)} bold />
          </ResultCard>
          <ToolNote>
            Fees are indicative, based on the FSSAI fee schedule: Basic
            Registration ₹100/yr (turnover up to ₹12 lakh), State License
            ₹2,000–5,000/yr by category (₹12 lakh–₹20 crore) and Central License
            ₹7,500/yr (above ₹20 crore). Professional or consultant charges are
            extra. Confirm the exact fee on foscos.fssai.gov.in before applying.
          </ToolNote>
        </>
      }
    />
  );
}
