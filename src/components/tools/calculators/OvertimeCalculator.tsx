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
  formatINR,
} from "@/components/tools/ui";

export default function OvertimeCalculator() {
  const [salary, setSalary] = useState<number | "">(30000);
  const [days, setDays] = useState<number | "">(26);
  const [hoursPerDay, setHoursPerDay] = useState<number | "">(8);
  const [otHours, setOtHours] = useState<number | "">(20);
  const [multiplier, setMultiplier] = useState("2");

  const sal = Number(salary) || 0;
  const d = Number(days) || 0;
  const h = Number(hoursPerDay) || 0;
  const ot = Number(otHours) || 0;
  const mult = Number(multiplier);

  const totalHours = d * h;
  const hourly = totalHours > 0 ? sal / totalHours : 0;
  const otRate = hourly * mult;
  const otPay = otRate * ot;
  const totalEarnings = sal + otPay;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly gross salary"
            prefix="₹"
            value={salary}
            onChange={setSalary}
          />
          <NumberField
            label="Working days per month"
            value={days}
            onChange={setDays}
            hint="Most factories and shops work 26 days a month."
          />
          <NumberField
            label="Working hours per day"
            value={hoursPerDay}
            onChange={setHoursPerDay}
          />
          <NumberField
            label="Overtime hours this month"
            value={otHours}
            onChange={setOtHours}
          />
          <ToggleGroup
            label="Overtime rate"
            value={multiplier}
            onChange={setMultiplier}
            options={[
              { value: "1", label: "1× (normal)" },
              { value: "1.5", label: "1.5×" },
              { value: "2", label: "2× (Factories Act)" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Overtime pay" value={inr(otPay, 2)} />
          <ResultCard title="Breakup">
            <ResultRow label="Normal hourly rate" value={inr(hourly, 2)} />
            <ResultRow
              label={`Overtime rate @ ${formatINR(mult, 1)}×`}
              value={inr(otRate, 2)}
            />
            <ResultRow
              label={`Overtime pay for ${formatINR(ot)} hrs`}
              value={inr(otPay, 2)}
            />
            <ResultRow label="Monthly salary" value={inr(sal, 2)} />
            <ResultRow label="Total earnings" value={inr(totalEarnings, 2)} bold />
          </ResultCard>
          <ToolNote>
            The Factories Act, 1948 requires overtime to be paid at twice the
            ordinary rate of wages for work beyond 9 hours a day or 48 hours a
            week. Hourly rate here is salary ÷ (working days × hours per day) —
            your employer&apos;s policy or state shop &amp; establishment rules
            may differ.
          </ToolNote>
        </>
      }
    />
  );
}
