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

export default function CostPerHireCalculator() {
  const [recruiterCost, setRecruiterCost] = useState<number | "">(300000);
  const [referralBonus, setReferralBonus] = useState<number | "">(50000);
  const [jobBoards, setJobBoards] = useState<number | "">(80000);
  const [agencyFees, setAgencyFees] = useState<number | "">(150000);
  const [hires, setHires] = useState<number | "">(10);

  const internal = (Number(recruiterCost) || 0) + (Number(referralBonus) || 0);
  const external = (Number(jobBoards) || 0) + (Number(agencyFees) || 0);
  const total = internal + external;
  const hireCount = Math.max(0, Math.floor(Number(hires) || 0));

  const cph = hireCount > 0 ? total / hireCount : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Recruiter salaries (for the period)"
            prefix="₹"
            value={recruiterCost}
            onChange={setRecruiterCost}
            hint="Internal recruiting team cost apportioned to hiring work."
          />
          <NumberField
            label="Referral bonuses paid"
            prefix="₹"
            value={referralBonus}
            onChange={setReferralBonus}
          />
          <NumberField
            label="Job boards, ATS & sourcing tools"
            prefix="₹"
            value={jobBoards}
            onChange={setJobBoards}
          />
          <NumberField
            label="Agency / consultant fees"
            prefix="₹"
            value={agencyFees}
            onChange={setAgencyFees}
          />
          <NumberField
            label="Number of hires in the period"
            value={hires}
            onChange={setHires}
            suffix="hires"
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Cost per hire"
            value={hireCount > 0 ? inr(cph, 0) : "—"}
          />
          <ResultCard title="Breakup">
            <ResultRow label="Internal costs (recruiters + referrals)" value={inr(internal, 0)} />
            <ResultRow label="External costs (boards, tools, agencies)" value={inr(external, 0)} />
            <ResultRow label="Total recruiting spend" value={inr(total, 0)} bold />
            <ResultRow
              label="Hires in the period"
              value={hireCount > 0 ? `${hireCount}` : "—"}
            />
          </ResultCard>
          <ToolNote>
            Cost per hire = (internal + external recruiting costs) ÷ number of
            hires, per the standard SHRM formula. Include only costs for the
            same period as the hires. Onboarding, training and hiring-manager
            time are excluded here — add them if you want a fully loaded cost.
          </ToolNote>
        </>
      }
    />
  );
}
