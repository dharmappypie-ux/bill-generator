import { GeneratorConfig } from "@/types/generator";

export const dailyHelperConfig: GeneratorConfig = {
  slug: "daily-helper",
  name: "Daily Helper Receipt",
  title: "Daily Helper Payment Receipt Generator — Maid & Cook Salary Slips",
  description:
    "Create payment receipts for household help — maids, cooks, gardeners and nannies. Add employer and helper details, the month, amount and payment mode, then download a print-ready PDF.",
  icon: "fa-broom",
  category: "Professional & Personal",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Standard Receipt" },
    { id: "template-2", label: "Minimal" },
  ],
  fields: [
    { name: "employerName", label: "Employer Name", type: "text", group: "Details", half: true, placeholder: "Priya Nair" },
    { name: "helperName", label: "Helper Name", type: "text", group: "Details", half: true, placeholder: "Lakshmi Devi" },
    {
      name: "workType",
      label: "Work Type",
      type: "select",
      group: "Details",
      half: true,
      options: [
        { value: "Maid", label: "Maid" },
        { value: "Cook", label: "Cook" },
        { value: "Gardener", label: "Gardener" },
        { value: "Nanny", label: "Nanny" },
      ],
    },
    { name: "month", label: "For the Month of", type: "text", group: "Details", half: true, placeholder: "June 2026" },

    { name: "amount", label: "Amount Paid", type: "number", group: "Amount", half: true, placeholder: "8000" },
    { name: "currency", label: "Currency", type: "currency", group: "Amount", half: true },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      group: "Amount",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Cheque", label: "Cheque" },
      ],
    },
    { name: "receiptNo", label: "Receipt No.", type: "text", group: "Amount", half: true, placeholder: "DH-0027" },
    { name: "date", label: "Receipt Date", type: "date", group: "Amount", half: true },
  ],
  defaults: {
    employerName: "Priya Nair",
    helperName: "Lakshmi Devi",
    workType: "Maid",
    month: "June 2026",
    amount: "8000",
    currency: "INR",
    paymentMode: "Cash",
    receiptNo: "DH-0027",
    date: "",
  },
};
