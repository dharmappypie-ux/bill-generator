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

export default function LtaCalculator() {
  const [received, setReceived] = useState<number | "">(60000);
  const [fare, setFare] = useState<number | "">(42000);

  const lta = Number(received) || 0;
  const spent = Number(fare) || 0;

  const exempt = Math.max(0, Math.min(lta, spent));
  const taxable = Math.max(0, lta - exempt);
  const unused = Math.max(0, spent - lta);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="LTA received from employer"
            prefix="₹"
            value={received}
            onChange={setReceived}
            hint="The LTA component paid to you for this claim / financial year."
          />
          <NumberField
            label="Actual eligible travel fare spent"
            prefix="₹"
            value={fare}
            onChange={setFare}
            hint="Domestic travel fare only (economy air / AC first class rail), shortest route. Hotels and food don't count."
          />
        </>
      }
      results={
        <>
          <BigResult label="Exempt LTA" value={inr(exempt)} />
          <ResultCard title="Breakup">
            <ResultRow label="LTA received" value={inr(lta)} />
            <ResultRow label="Eligible fare spent" value={inr(spent)} />
            <ResultRow label="Exempt LTA (lower of the two)" value={inr(exempt)} bold />
            <ResultRow label="Taxable LTA" value={inr(taxable)} bold />
            {unused > 0 && (
              <ResultRow
                label="Fare spent beyond LTA (no extra benefit)"
                value={inr(unused)}
              />
            )}
          </ResultCard>
          <ToolNote>
            LTA exemption under Section 10(5) covers only the travel fare for you
            and your family within India, by the shortest route, and can be claimed
            for 2 journeys in a block of 4 calendar years (current block: 2026–29).
            It is available only under the old tax regime — keep tickets and proofs
            for your employer.
          </ToolNote>
        </>
      }
    />
  );
}
