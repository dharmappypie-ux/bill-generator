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

export default function MaternityLeaveCalculator() {
  const [salary, setSalary] = useState<number | "">(50000);
  const [daysToDue, setDaysToDue] = useState<number | "">(45);
  const [children, setChildren] = useState<"fewer" | "twoPlus">("fewer");

  const monthlyGross = Number(salary) || 0;
  const daysUntilDue = Math.max(0, Number(daysToDue) || 0);

  // Maternity Benefit Act: 26 weeks for the first two children, 12 weeks after.
  const totalWeeks = children === "fewer" ? 26 : 12;

  // Pre-delivery leave is capped at 8 weeks for the 26-week entitlement and
  // 6 weeks for the 12-week entitlement (and can't exceed days remaining).
  const preCap = children === "fewer" ? 8 : 6;
  const preWeeks = Math.min(preCap, daysUntilDue / 7, totalWeeks);
  const postWeeks = totalWeeks - preWeeks;

  // Weekly pay from monthly gross (average 4.33 weeks per month).
  const weeklyPay = monthlyGross / 4.33;
  const totalBenefit = weeklyPay * totalWeeks;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly gross salary"
            prefix="₹"
            value={salary}
            onChange={setSalary}
            hint="Average wages for the 3 months before leave"
          />
          <NumberField
            label="Days until due date"
            suffix="days"
            value={daysToDue}
            onChange={setDaysToDue}
            hint="How many days from today to the expected delivery date"
          />
          <ToggleGroup
            label="Surviving children"
            value={children}
            onChange={(v) => setChildren(v as "fewer" | "twoPlus")}
            options={[
              { value: "fewer", label: "Fewer than 2 (26 weeks)" },
              { value: "twoPlus", label: "2 or more (12 weeks)" },
            ]}
          />
        </>
      }
      results={
        <>
          <BigResult label="Total paid maternity leave" value={`${totalWeeks} weeks`} />
          <ResultCard title="Leave & benefit breakup">
            <ResultRow
              label={`Pre-delivery leave (max ${preCap} weeks)`}
              value={`${preWeeks.toFixed(1)} weeks`}
            />
            <ResultRow
              label="Post-delivery leave"
              value={`${postWeeks.toFixed(1)} weeks`}
            />
            <ResultRow label="Weekly pay" value={inr(weeklyPay)} />
            <ResultRow
              label={`Paid benefit for ${totalWeeks} weeks`}
              value={inr(totalBenefit)}
              bold
            />
          </ResultCard>
          <ToolNote>
            As per the Maternity Benefit (Amendment) Act, 2017: 26 weeks of paid
            leave for women with fewer than two surviving children (12 weeks
            otherwise), with pre-delivery leave capped at 8 weeks. Benefit is paid
            at the average daily wage. Applies to establishments with 10+ employees
            after 80 days of work in the preceding 12 months — check eligibility
            with your employer.
          </ToolNote>
        </>
      }
    />
  );
}
