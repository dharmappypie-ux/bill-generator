"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  TextField,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  inr,
} from "@/components/tools/ui";

export default function SalarySlipGenerator() {
  const [employee, setEmployee] = useState("Rahul Sharma");
  const [company, setCompany] = useState("Acme Pvt Ltd");
  const [month, setMonth] = useState("July 2026");
  const [basic, setBasic] = useState<number | "">(30000);
  const [hra, setHra] = useState<number | "">(12000);
  const [special, setSpecial] = useState<number | "">(8000);
  const [other, setOther] = useState<number | "">(2000);
  const [pf, setPf] = useState<number | "">(3600);
  const [pt, setPt] = useState<number | "">(200);
  const [tds, setTds] = useState<number | "">(1500);
  const [otherDed, setOtherDed] = useState<number | "">(0);

  const earnings =
    (Number(basic) || 0) +
    (Number(hra) || 0) +
    (Number(special) || 0) +
    (Number(other) || 0);
  const deductions =
    (Number(pf) || 0) +
    (Number(pt) || 0) +
    (Number(tds) || 0) +
    (Number(otherDed) || 0);
  const netPay = earnings - deductions;

  return (
    <ToolLayout
      inputs={
        <>
          <TextField label="Employee name" value={employee} onChange={setEmployee} />
          <TextField label="Company name" value={company} onChange={setCompany} />
          <TextField label="Month" value={month} onChange={setMonth} placeholder="e.g. July 2026" />
          <NumberField label="Basic salary" prefix="₹" value={basic} onChange={setBasic} />
          <NumberField label="HRA" prefix="₹" value={hra} onChange={setHra} />
          <NumberField label="Special allowance" prefix="₹" value={special} onChange={setSpecial} />
          <NumberField label="Other allowance" prefix="₹" value={other} onChange={setOther} />
          <NumberField label="Provident Fund (PF)" prefix="₹" value={pf} onChange={setPf} />
          <NumberField label="Professional tax (PT)" prefix="₹" value={pt} onChange={setPt} />
          <NumberField label="TDS" prefix="₹" value={tds} onChange={setTds} />
          <NumberField label="Other deduction" prefix="₹" value={otherDed} onChange={setOtherDed} />
        </>
      }
      results={
        <>
          <BigResult label={`Net pay — ${month || "this month"}`} value={inr(netPay)} />
          {/* id="bill-print-area" hooks into the global print stylesheet so
              window.print() shows only this slip instead of a blank page. */}
          <div id="bill-print-area" className="print:w-[180mm]">
          <ResultCard title={`${company || "Company"} · Salary slip for ${employee || "Employee"}`}>
            <ResultRow label="Basic salary" value={inr(Number(basic) || 0)} />
            <ResultRow label="HRA" value={inr(Number(hra) || 0)} />
            <ResultRow label="Special allowance" value={inr(Number(special) || 0)} />
            <ResultRow label="Other allowance" value={inr(Number(other) || 0)} />
            <ResultRow label="Gross earnings" value={inr(earnings)} bold />
            <ResultRow label="Provident Fund" value={inr(Number(pf) || 0)} negative />
            <ResultRow label="Professional tax" value={inr(Number(pt) || 0)} negative />
            <ResultRow label="TDS" value={inr(Number(tds) || 0)} negative />
            <ResultRow label="Other deduction" value={inr(Number(otherDed) || 0)} negative />
            <ResultRow label="Total deductions" value={inr(deductions)} negative bold />
            <ResultRow label="Net pay" value={inr(netPay)} bold />
          </ResultCard>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full rounded-xl bg-indigoBtn px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-indigoBtn-deeper"
          >
            Print / Save PDF
          </button>
          <ToolNote>
            This is a simple, indicative salary slip. It assumes flat monthly
            figures you enter and does not compute PF, PT or TDS for you — enter
            the amounts from your payroll. Use your employer&apos;s official slip
            for loans, visas and other formal purposes.
          </ToolNote>
        </>
      }
    />
  );
}
