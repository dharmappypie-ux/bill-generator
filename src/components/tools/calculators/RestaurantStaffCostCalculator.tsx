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

type Role = { name: string; count: number | ""; salary: number | "" };

export default function RestaurantStaffCostCalculator() {
  const [roles, setRoles] = useState<Role[]>([
    { name: "Head chef", count: 1, salary: 45000 },
    { name: "Cook", count: 2, salary: 22000 },
    { name: "Waiter", count: 3, salary: 15000 },
    { name: "Cashier", count: 1, salary: 18000 },
  ]);
  const [sales, setSales] = useState<number | "">(700000);

  const updateRole = (i: number, patch: Partial<Role>) =>
    setRoles((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const removeRole = (i: number) =>
    setRoles((rs) => rs.filter((_, idx) => idx !== i));
  const addRole = () =>
    setRoles((rs) => [...rs, { name: "New role", count: 1, salary: 15000 }]);

  const totalStaffCost = roles.reduce(
    (sum, r) => sum + (Number(r.count) || 0) * (Number(r.salary) || 0),
    0
  );
  const salesAmt = Number(sales) || 0;
  const labourPct = salesAmt > 0 ? (totalStaffCost / salesAmt) * 100 : NaN;

  return (
    <ToolLayout
      inputs={
        <>
          {roles.map((role, i) => (
            <div key={i} className="rounded-xl border border-line bg-section/50 p-3.5">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField
                    label={`Role ${i + 1}`}
                    value={role.name}
                    onChange={(v) => updateRole(i, { name: v })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRole(i)}
                  className="mb-1 rounded-full bg-section px-3 py-1.5 text-xs font-semibold text-inkSoft transition hover:bg-red-50 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <NumberField
                  label="Headcount"
                  value={role.count}
                  onChange={(v) => updateRole(i, { count: v })}
                />
                <NumberField
                  label="Monthly salary each"
                  prefix="₹"
                  value={role.salary}
                  onChange={(v) => updateRole(i, { salary: v })}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addRole}
            className="rounded-full bg-section px-4 py-1.5 text-[13px] font-semibold text-inkSoft transition hover:bg-brand-50 hover:text-brand-700"
          >
            + Add role
          </button>
          <NumberField
            label="Monthly sales"
            prefix="₹"
            value={sales}
            onChange={setSales}
            hint="Used to compute labour as a percentage of sales."
          />
        </>
      }
      results={
        <>
          <BigResult label="Monthly staff cost" value={inr(totalStaffCost)} />
          <ResultCard title="Breakup">
            {roles.map((role, i) => (
              <ResultRow
                key={i}
                label={`${role.name || "Role"} (${Number(role.count) || 0} × ${inr(
                  Number(role.salary) || 0
                )})`}
                value={inr((Number(role.count) || 0) * (Number(role.salary) || 0))}
              />
            ))}
            <ResultRow
              label="Labour % of sales"
              value={isFinite(labourPct) ? `${labourPct.toFixed(1)}%` : "—"}
              bold
            />
          </ResultCard>
          <ToolNote>
            Benchmark: labour cost of 20–25% of sales is considered healthy for
            Indian restaurants; above 30% usually squeezes margins. Salaries here
            are gross monthly pay — add roughly 13% more if you cover employer
            PF/ESI contributions.
          </ToolNote>
        </>
      }
    />
  );
}
