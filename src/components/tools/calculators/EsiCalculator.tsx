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

const WAGE_CEILING = 21000;
const EMPLOYEE_RATE = 0.75;
const EMPLOYER_RATE = 3.25;

export default function EsiCalculator() {
  const [gross, setGross] = useState<number | "">(18000);

  const wages = Number(gross) || 0;
  const covered = wages > 0 && wages <= WAGE_CEILING;

  const employee = covered ? wages * (EMPLOYEE_RATE / 100) : 0;
  const employer = covered ? wages * (EMPLOYER_RATE / 100) : 0;
  const total = employee + employer;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly gross wages"
            prefix="₹"
            value={gross}
            onChange={setGross}
            hint={`ESI applies only if gross wages are ₹${WAGE_CEILING.toLocaleString(
              "en-IN"
            )} per month or less.`}
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Total monthly ESI contribution"
            value={covered ? inr(total, 2) : "Not covered"}
            accent={!covered}
          />
          <ResultCard title="Breakup">
            <ResultRow
              label="Coverage status"
              value={
                covered
                  ? "Covered under ESI"
                  : wages === 0
                  ? "—"
                  : `Gross above ₹${WAGE_CEILING.toLocaleString("en-IN")} — not covered`
              }
              bold
            />
            <ResultRow
              label={`Employee share @ ${EMPLOYEE_RATE}%`}
              value={covered ? inr(employee, 2) : inr(0)}
            />
            <ResultRow
              label={`Employer share @ ${EMPLOYER_RATE}%`}
              value={covered ? inr(employer, 2) : inr(0)}
            />
            <ResultRow
              label="Annual ESI cost (12 months)"
              value={covered ? inr(total * 12, 2) : inr(0)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Assumes the current ESI wage ceiling of ₹21,000/month (₹25,000 for
            persons with disability) and contribution rates of 0.75% (employee)
            and 3.25% (employer). Once covered at the start of a contribution
            period, an employee stays covered for that period even if wages later
            exceed the ceiling. Verify with the ESIC portal for your case.
          </ToolNote>
        </>
      }
    />
  );
}
