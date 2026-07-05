import { GeneratorConfig } from "@/types/generator";

export const ltaReceiptConfig: GeneratorConfig = {
  slug: "lta-receipt",
  name: "LTA Receipt",
  title: "LTA Receipt Generator — Leave Travel Allowance Claim Receipt",
  description:
    "Create Leave Travel Allowance (LTA) claim receipts for tax exemption. Add employee, journey, mode of travel and ticket details, choose a template and currency, and download a print-ready PDF.",
  icon: "fa-train",
  category: "Transportation & Travel",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Standard Receipt" },
    { id: "template-2", label: "Minimal" },
  ],
  fields: [
    // --- Journey ---
    { name: "employeeName", label: "Employee Name", type: "text", group: "Journey", half: true, placeholder: "Amit Sharma" },
    { name: "employeeId", label: "Employee ID", type: "text", group: "Journey", half: true, placeholder: "EMP-10428" },
    { name: "fromPlace", label: "From (Origin)", type: "text", group: "Journey", half: true, placeholder: "New Delhi" },
    { name: "toPlace", label: "To (Destination)", type: "text", group: "Journey", half: true, placeholder: "Mumbai" },
    {
      name: "mode",
      label: "Mode of Travel",
      type: "select",
      group: "Journey",
      half: true,
      options: [
        { value: "Train", label: "Train" },
        { value: "Flight", label: "Flight" },
        { value: "Bus", label: "Bus" },
      ],
    },
    { name: "travelDate", label: "Date of Travel", type: "date", group: "Journey", half: true },
    { name: "ticketNo", label: "Ticket / PNR No.", type: "text", group: "Journey", half: true, placeholder: "PNR 8842910673" },

    // --- Amount ---
    { name: "amount", label: "Claim Amount", type: "number", group: "Amount", half: true, placeholder: "12500" },
    { name: "currency", label: "Currency", type: "currency", group: "Amount", half: true },
    { name: "receiptNo", label: "Receipt No.", type: "text", group: "Amount", half: true, placeholder: "LTA-0042" },
    { name: "date", label: "Receipt Date", type: "date", group: "Amount", half: true },
    { name: "purpose", label: "Purpose of Travel", type: "textarea", group: "Amount", placeholder: "Annual leave travel to home town with family" },
  ],
  defaults: {
    employeeName: "Amit Sharma",
    employeeId: "EMP-10428",
    fromPlace: "New Delhi",
    toPlace: "Mumbai",
    mode: "Train",
    travelDate: "",
    ticketNo: "PNR 8842910673",
    amount: "12500",
    currency: "INR",
    receiptNo: "LTA-0042",
    date: "",
    purpose: "Annual leave travel to home town with family under LTA block.",
  },
};
