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
  formatINR,
} from "@/components/tools/ui";

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return { value: `${h}:${m}`, label: `${h}:${m}` };
});

const toHours = (t: string) => Number(t.slice(0, 2)) + Number(t.slice(3)) / 60;

const hrs = (n: number) => `${formatINR(n, 1)} hrs`;

export default function WorkHoursCalculator() {
  const [daysPerWeek, setDaysPerWeek] = useState<number | "">(6);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");
  const [breakMins, setBreakMins] = useState<number | "">(30);

  const days = Number(daysPerWeek) || 0;
  const brk = (Number(breakMins) || 0) / 60;

  let shift = toHours(end) - toHours(start);
  if (shift <= 0) shift += 24; // overnight shift
  const daily = Math.max(0, shift - brk);
  const weekly = daily * days;
  const monthly = weekly * 4.33;
  const overtime = Math.max(0, weekly - 48);

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Days worked per week"
            value={daysPerWeek}
            onChange={setDaysPerWeek}
          />
          <SelectField
            label="Shift start time"
            value={start}
            onChange={setStart}
            options={TIME_OPTIONS}
          />
          <SelectField
            label="Shift end time"
            value={end}
            onChange={setEnd}
            options={TIME_OPTIONS}
            hint="If end time is before start time, it is treated as an overnight shift."
          />
          <NumberField
            label="Break per day"
            suffix="minutes"
            value={breakMins}
            onChange={setBreakMins}
            hint="Lunch and tea breaks are unpaid in most establishments."
          />
        </>
      }
      results={
        <>
          <BigResult label="Weekly work hours" value={hrs(weekly)} />
          <ResultCard title="Breakup">
            <ResultRow label="Shift length" value={hrs(shift)} />
            <ResultRow label="Net hours per day (after break)" value={hrs(daily)} />
            <ResultRow label="Hours per week" value={hrs(weekly)} />
            <ResultRow label="Hours per month (× 4.33 weeks)" value={hrs(monthly)} />
            <ResultRow
              label="Overtime beyond 48 hrs/week"
              value={hrs(overtime)}
              bold
            />
          </ResultCard>
          <ToolNote>
            The Factories Act, 1948 caps normal working time at 48 hours a week
            and 9 hours a day; anything beyond counts as overtime payable at
            double the ordinary wage rate. Monthly figure uses the standard 4.33
            weeks-per-month average. State shop &amp; establishment acts may set
            different limits.
          </ToolNote>
        </>
      }
    />
  );
}
