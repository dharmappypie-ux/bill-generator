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

const EXEMPTION_CAP = 2500000; // ₹25 lakh under Section 10(10AA) for non-government employees

export default function LeaveEncashmentCalculator() {
  const [salary, setSalary] = useState<number | "">(60000);
  const [days, setDays] = useState<number | "">(45);
  const [divisor, setDivisor] = useState<number | "">(30);

  const sal = Number(salary) || 0;
  const leaveDays = Math.max(0, Number(days) || 0);
  const div = Number(divisor) || 0;

  const perDay = div > 0 ? sal / div : 0;
  const encashment = perDay * leaveDays;

  const exempt = Math.min(encashment, EXEMPTION_CAP);
  const taxable = Math.max(0, encashment - EXEMPTION_CAP);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Basic + DA (monthly)"
            prefix="₹"
            value={salary}
            onChange={setSalary}
            hint="Section 10(10AA) uses the average basic + DA of the last 10 months."
          />
          <NumberField
            label="Unused earned-leave days"
            value={days}
            onChange={setDays}
            suffix="days"
            hint="Earned/privilege leave balance being encashed."
          />
          <NumberField
            label="Per-day salary divisor"
            value={divisor}
            onChange={setDivisor}
            suffix="days"
            hint="Most employers divide monthly salary by 30 to get the per-day rate."
          />
        </>
      }
      results={
        <>
          <BigResult label="Leave encashment amount" value={inr(encashment, 0)} />
          <ResultCard title="Breakup">
            <ResultRow label="Per-day salary" value={div > 0 ? inr(perDay, 2) : "—"} />
            <ResultRow label="Days encashed" value={`${leaveDays} days`} />
            <ResultRow
              label="Exempt on retirement (up to ₹25,00,000)"
              value={inr(exempt, 0)}
            />
            <ResultRow label="Taxable amount" value={inr(taxable, 0)} bold />
          </ResultCard>
          <ToolNote>
            The ₹25 lakh exemption under Section 10(10AA) applies to leave
            encashment received at retirement/resignation by non-government
            employees, further limited to 10 months&apos; average salary and a
            maximum of 30 days&apos; leave per year of service. Government
            employees are fully exempt; encashment during service is fully
            taxable. Verify the exact exemption with your CA.
          </ToolNote>
        </>
      }
    />
  );
}
