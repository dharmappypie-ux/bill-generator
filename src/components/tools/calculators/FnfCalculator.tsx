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

export default function FnfCalculator() {
  const [gross, setGross] = useState<number | "">(60000);
  const [salaryDays, setSalaryDays] = useState<number | "">(15);
  const [leaveDays, setLeaveDays] = useState<number | "">(12);
  const [basic, setBasic] = useState<number | "">(30000);
  const [years, setYears] = useState<number | "">(6);
  const [shortfallDays, setShortfallDays] = useState<number | "">(0);
  const [otherDues, setOtherDues] = useState<number | "">(0);

  const grossPay = Number(gross) || 0;
  const basicPay = Number(basic) || 0;
  const unpaidDays = Number(salaryDays) || 0;
  const leave = Number(leaveDays) || 0;
  const service = Number(years) || 0;
  const shortfall = Number(shortfallDays) || 0;
  const dues = Number(otherDues) || 0;

  const pendingSalary = (grossPay / 30) * unpaidDays;
  const leaveEncashment = (basicPay / 30) * leave;

  // Gratuity: payable only after 5 years; ≥6 months in the final year rounds up.
  const roundedYears =
    service >= 5 ? Math.floor(service) + (service % 1 >= 0.5 ? 1 : 0) : 0;
  const gratuity = (15 / 26) * basicPay * roundedYears;

  const noticeRecovery = (grossPay / 30) * shortfall;
  const netPayable =
    pendingSalary + leaveEncashment + gratuity + dues - noticeRecovery;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Monthly gross salary"
            prefix="₹"
            value={gross}
            onChange={setGross}
          />
          <NumberField
            label="Unpaid salary days"
            suffix="days"
            value={salaryDays}
            onChange={setSalaryDays}
            hint="Days worked in the last month that are still unpaid"
          />
          <NumberField
            label="Unused leave days"
            suffix="days"
            value={leaveDays}
            onChange={setLeaveDays}
            hint="Earned leave balance eligible for encashment"
          />
          <NumberField
            label="Monthly basic + DA"
            prefix="₹"
            value={basic}
            onChange={setBasic}
            hint="Used for leave encashment and gratuity"
          />
          <NumberField
            label="Years of service"
            suffix="yrs"
            value={years}
            onChange={setYears}
            step={0.5}
            hint="Gratuity applies only if 5 years or more"
          />
          <NumberField
            label="Notice period shortfall"
            suffix="days"
            value={shortfallDays}
            onChange={setShortfallDays}
            hint="Days of notice not served — recovered from FnF"
          />
          <NumberField
            label="Pending bonus / other dues"
            prefix="₹"
            value={otherDues}
            onChange={setOtherDues}
          />
        </>
      }
      results={
        <>
          <BigResult label="Net FnF payable" value={inr(netPayable)} />
          <ResultCard title="Settlement breakup">
            <ResultRow
              label={`Pending salary (${unpaidDays} days)`}
              value={inr(pendingSalary)}
            />
            <ResultRow
              label={`Leave encashment (${leave} days on basic)`}
              value={inr(leaveEncashment)}
            />
            <ResultRow
              label={
                roundedYears > 0
                  ? `Gratuity (${roundedYears} yrs, 15/26 formula)`
                  : "Gratuity (under 5 years — not payable)"
              }
              value={roundedYears > 0 ? inr(gratuity) : "—"}
            />
            <ResultRow label="Bonus / other dues" value={inr(dues)} />
            <ResultRow
              label={`Notice recovery (${shortfall} days)`}
              value={inr(noticeRecovery)}
              negative={noticeRecovery > 0}
            />
            <ResultRow label="Net FnF payable" value={inr(netPayable)} bold />
          </ResultCard>
          <ToolNote>
            Uses a 30-day month for per-day salary, leave encashment on basic + DA,
            and the Payment of Gratuity Act formula (15/26 × basic × years, ≥6
            months rounds up, minimum 5 years of service). TDS and company-specific
            policies (leave caps, notice buyout terms) are not applied — confirm
            with your HR/payroll team.
          </ToolNote>
        </>
      }
    />
  );
}
