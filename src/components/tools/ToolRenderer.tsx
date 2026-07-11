"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const loading = () => (
  <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div className="h-96 animate-pulse rounded-2xl border border-line bg-white shadow-soft" />
    <div className="h-96 animate-pulse rounded-2xl border border-line bg-white shadow-soft" />
  </div>
);

const lazy = (imp: () => Promise<{ default: ComponentType }>) =>
  dynamic(imp, { loading, ssr: false });

const REGISTRY: Record<string, ComponentType> = {
  "advance-tax-calculator": lazy(() => import("./calculators/AdvanceTaxCalculator")),
  "capital-gains-tax-calculator": lazy(() => import("./calculators/CapitalGainsTaxCalculator")),
  "cost-per-hire-calculator": lazy(() => import("./calculators/CostPerHireCalculator")),
  "ctc-calculator": lazy(() => import("./calculators/CtcCalculator")),
  "discount-calculator": lazy(() => import("./calculators/DiscountCalculator")),
  "employee-cost-calculator": lazy(() => import("./calculators/EmployeeCostCalculator")),
  "employee-turnover-cost-calculator": lazy(() => import("./calculators/EmployeeTurnoverCostCalculator")),
  "epf-withdrawal-calculator": lazy(() => import("./calculators/EpfWithdrawalCalculator")),
  "esi-calculator": lazy(() => import("./calculators/EsiCalculator")),
  "fnf-calculator": lazy(() => import("./calculators/FnfCalculator")),
  "food-cost-calculator": lazy(() => import("./calculators/FoodCostCalculator")),
  "food-waste-cost-calculator": lazy(() => import("./calculators/FoodWasteCostCalculator")),
  "fssai-license-fee-calculator": lazy(() => import("./calculators/FssaiLicenseFeeCalculator")),
  "gratuity-calculator": lazy(() => import("./calculators/GratuityCalculator")),
  "gst-calculator": lazy(() => import("./calculators/GstCalculator")),
  "gst-composition-scheme-calculator": lazy(() => import("./calculators/GstCompositionSchemeCalculator")),
  "gst-interest-calculator": lazy(() => import("./calculators/GstInterestCalculator")),
  "gst-invoice-value-calculator": lazy(() => import("./calculators/GstInvoiceValueCalculator")),
  "gst-refund-calculator": lazy(() => import("./calculators/GstRefundCalculator")),
  "hra-calculator": lazy(() => import("./calculators/HraCalculator")),
  "in-hand-salary-calculator": lazy(() => import("./calculators/InHandSalaryCalculator")),
  "income-tax-calculator": lazy(() => import("./calculators/IncomeTaxCalculator")),
  "itc-calculator": lazy(() => import("./calculators/ItcCalculator")),
  "labour-code-salary-structure-calculator": lazy(() => import("./calculators/LabourCodeSalaryStructureCalculator")),
  "leave-encashment-calculator": lazy(() => import("./calculators/LeaveEncashmentCalculator")),
  "lta-calculator": lazy(() => import("./calculators/LtaCalculator")),
  "maternity-leave-calculator": lazy(() => import("./calculators/MaternityLeaveCalculator")),
  "menu-pricing-calculator": lazy(() => import("./calculators/MenuPricingCalculator")),
  "minimum-wage-calculator": lazy(() => import("./calculators/MinimumWageCalculator")),
  "notice-period-calculator": lazy(() => import("./calculators/NoticePeriodCalculator")),
  "nps-calculator": lazy(() => import("./calculators/NpsCalculator")),
  "old-vs-new-tax-regime-calculator": lazy(() => import("./calculators/OldVsNewTaxRegimeCalculator")),
  "overtime-calculator": lazy(() => import("./calculators/OvertimeCalculator")),
  "pf-calculator": lazy(() => import("./calculators/PfCalculator")),
  "professional-tax-calculator": lazy(() => import("./calculators/ProfessionalTaxCalculator")),
  "profit-margin-calculator": lazy(() => import("./calculators/ProfitMarginCalculator")),
  "recipe-costing-calculator": lazy(() => import("./calculators/RecipeCostingCalculator")),
  "restaurant-break-even-calculator": lazy(() => import("./calculators/RestaurantBreakEvenCalculator")),
  "restaurant-franchise-cost-calculator": lazy(() => import("./calculators/RestaurantFranchiseCostCalculator")),
  "restaurant-profit-margin-calculator": lazy(() => import("./calculators/RestaurantProfitMarginCalculator")),
  "restaurant-staff-cost-calculator": lazy(() => import("./calculators/RestaurantStaffCostCalculator")),
  "restaurant-startup-cost-calculator": lazy(() => import("./calculators/RestaurantStartupCostCalculator")),
  "reverse-gst-calculator": lazy(() => import("./calculators/ReverseGstCalculator")),
  "salary-arrears-calculator": lazy(() => import("./calculators/SalaryArrearsCalculator")),
  "salary-calculator": lazy(() => import("./calculators/SalaryCalculator")),
  "salary-hike-calculator": lazy(() => import("./calculators/SalaryHikeCalculator")),
  "salary-slip-generator": lazy(() => import("./calculators/SalarySlipGenerator")),
  "statutory-bonus-calculator": lazy(() => import("./calculators/StatutoryBonusCalculator")),
  "swiggy-zomato-commission-calculator": lazy(() => import("./calculators/SwiggyZomatoCommissionCalculator")),
  "table-turnover-calculator": lazy(() => import("./calculators/TableTurnoverCalculator")),
  "tcs-calculator": lazy(() => import("./calculators/TcsCalculator")),
  "tds-calculator": lazy(() => import("./calculators/TdsCalculator")),
  "tip-calculator": lazy(() => import("./calculators/TipCalculator")),
  "work-hours-calculator": lazy(() => import("./calculators/WorkHoursCalculator")),
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = REGISTRY[slug];
  if (!Tool) return null;
  return <Tool />;
}
