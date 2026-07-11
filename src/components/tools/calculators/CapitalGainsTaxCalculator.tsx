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
  inr,
} from "@/components/tools/ui";

const LTCG_EQUITY_EXEMPTION = 125000;

export default function CapitalGainsTaxCalculator() {
  const [asset, setAsset] = useState("equity");
  const [buyPrice, setBuyPrice] = useState<number | "">(500000);
  const [sellPrice, setSellPrice] = useState<number | "">(800000);
  const [months, setMonths] = useState<number | "">(18);

  const buy = Number(buyPrice) || 0;
  const sell = Number(sellPrice) || 0;
  const held = Number(months) || 0;
  const gain = Math.max(0, sell - buy);

  // Rules for transfers on/after 23 Jul 2024 (Finance (No. 2) Act, 2024).
  // Debt MF units acquired on/after 1 Apr 2023 are always short term (Sec 50AA).
  const isLongTerm =
    asset === "debtmf" ? false : asset === "equity" ? held > 12 : held > 24;
  const rate = isLongTerm ? 12.5 : asset === "equity" ? 20 : 30;
  const exemption =
    asset === "equity" && isLongTerm ? Math.min(gain, LTCG_EQUITY_EXEMPTION) : 0;
  const taxableGain = Math.max(0, gain - exemption);
  const tax = (taxableGain * rate) / 100;

  const gainType = isLongTerm ? "LTCG (long term)" : "STCG (short term)";
  const rateLabel = isLongTerm
    ? "12.5% (no indexation)"
    : asset === "equity"
      ? "20% u/s 111A"
      : "Slab rate (30% assumed)";

  return (
    <ToolLayout
      inputs={
        <>
          <SelectField
            label="Asset type"
            value={asset}
            onChange={setAsset}
            options={[
              { value: "equity", label: "Listed equity shares / equity mutual funds" },
              { value: "property", label: "Property (land / house)" },
              { value: "gold", label: "Gold & other assets" },
              { value: "debtmf", label: "Debt mutual funds" },
            ]}
            hint={
              asset === "equity"
                ? "Long term if held more than 12 months"
                : asset === "debtmf"
                  ? "Always short term for units bought on/after 1 Apr 2023 (Sec 50AA)"
                  : "Long term if held more than 24 months"
            }
          />
          <NumberField
            label="Purchase price"
            prefix="₹"
            value={buyPrice}
            onChange={setBuyPrice}
          />
          <NumberField
            label="Sale price"
            prefix="₹"
            value={sellPrice}
            onChange={setSellPrice}
          />
          <NumberField
            label="Holding period"
            suffix="months"
            value={months}
            onChange={setMonths}
          />
        </>
      }
      results={
        <>
          <BigResult label="Capital gains tax payable" value={inr(tax)} />
          <ResultCard title="Breakup">
            <ResultRow label="Purchase price" value={inr(buy)} />
            <ResultRow label="Sale price" value={inr(sell)} />
            <ResultRow label="Capital gain" value={inr(gain)} bold />
            <ResultRow label="Gain type" value={gainType} />
            {exemption > 0 && (
              <ResultRow label="LTCG exemption u/s 112A" value={inr(exemption)} negative />
            )}
            <ResultRow label="Taxable gain" value={inr(taxableGain)} />
            <ResultRow label="Tax rate" value={rateLabel} />
            <ResultRow label="Tax payable" value={inr(tax)} bold />
          </ResultCard>
          <ToolNote>
            Uses rates for transfers on/after 23 Jul 2024: equity STCG 20% (u/s
            111A), equity LTCG 12.5% above the ₹1.25L annual exemption; property,
            gold and other assets held over 24 months attract 12.5% LTCG without
            indexation, else gains are taxed at your slab rate (30% assumed
            here). Debt mutual fund units acquired on/after 1 Apr 2023 are
            always short term (Sec 50AA) and taxed at slab rate regardless of
            holding period; units bought before that date follow the 24-month
            rule. Excludes surcharge and 4% cess — verify with your CA.
          </ToolNote>
        </>
      }
    />
  );
}
