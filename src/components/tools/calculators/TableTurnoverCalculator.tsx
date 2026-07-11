"use client";

import { useState } from "react";
import {
  ToolLayout,
  NumberField,
  BigResult,
  ResultCard,
  ResultRow,
  ToolNote,
  formatINR,
} from "@/components/tools/ui";

export default function TableTurnoverCalculator() {
  const [parties, setParties] = useState<number | "">(60);
  const [tables, setTables] = useState<number | "">(15);
  const [hours, setHours] = useState<number | "">(4);

  const p = Number(parties) || 0;
  const t = Number(tables) || 0;
  const h = Number(hours) || 0;

  const turns = t > 0 ? p / t : 0;
  const turnsPerHour = h > 0 ? turns / h : 0;
  const occupancyMins = p > 0 && t > 0 ? (t * h * 60) / p : 0;

  return (
    <ToolLayout
      inputs={
        <>
          <NumberField
            label="Parties / covers served in the period"
            value={parties}
            onChange={setParties}
            hint="Total number of groups (parties) seated during the service period."
          />
          <NumberField
            label="Number of tables"
            value={tables}
            onChange={setTables}
            min={1}
          />
          <NumberField
            label="Service period"
            suffix="hours"
            value={hours}
            onChange={setHours}
            step={0.5}
            hint="e.g. 4 hours for a dinner service, 12 for a full day."
          />
        </>
      }
      results={
        <>
          <BigResult
            label="Table turns per period"
            value={`${formatINR(turns, 2)} turns`}
          />
          <ResultCard title="Details">
            <ResultRow
              label="Turnover rate per hour"
              value={`${formatINR(turnsPerHour, 2)} turns/hr`}
            />
            <ResultRow
              label="Avg. table occupancy time"
              value={occupancyMins > 0 ? `${formatINR(occupancyMins, 0)} min` : "—"}
            />
            <ResultRow
              label="Parties served per table"
              value={formatINR(turns, 2)}
              bold
            />
          </ResultCard>
          <ToolNote>
            Table turnover = parties served ÷ number of tables. Higher is better —
            most Indian restaurants target 1.5–2 turns per meal service (lunch or
            dinner). Very high turns with falling average bills may signal rushed
            service, so read this alongside your average cover value.
          </ToolNote>
        </>
      }
    />
  );
}
