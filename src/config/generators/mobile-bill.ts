import { GeneratorConfig } from "@/types/generator";

export const mobileBillConfig: GeneratorConfig = {
  slug: "mobile-bill",
  name: "Mobile Bill",
  title: "Mobile Bill Generator — Postpaid Phone Statement Maker",
  description:
    "Create realistic postpaid mobile phone bills for Airtel, Jio, Vi and BSNL. Add your plan, rental, call, data and SMS charges, pick a template and currency, and download a print-ready PDF statement in seconds.",
  icon: "fa-mobile-screen",
  category: "Utilities & Services",
  popular: false,
  hasThemes: true,
  hasCrumple: true,
  templates: [
    { id: "template-1", label: "Statement" },
    { id: "template-2", label: "Summary" },
  ],
  fields: [
    // --- Account ---
    {
      name: "operator",
      label: "Operator",
      type: "select",
      group: "Account",
      half: true,
      options: [
        { value: "Airtel", label: "Airtel" },
        { value: "Jio", label: "Jio" },
        { value: "Vi", label: "Vi" },
        { value: "BSNL", label: "BSNL" },
      ],
    },
    { name: "mobileNumber", label: "Mobile Number", type: "text", group: "Account", half: true, placeholder: "98765 43210" },
    { name: "customerName", label: "Customer Name", type: "text", group: "Account", half: true, placeholder: "Amit Sharma" },
    { name: "planName", label: "Plan Name", type: "text", group: "Account", half: true, placeholder: "Postpaid 399 Unlimited" },
    { name: "billingFrom", label: "Billing Period From", type: "date", group: "Account", half: true },
    { name: "billingTo", label: "Billing Period To", type: "date", group: "Account", half: true },

    // --- Charges ---
    { name: "rentalCharge", label: "Monthly Rental", type: "number", group: "Charges", half: true, placeholder: "399" },
    { name: "callCharges", label: "Call Charges", type: "number", group: "Charges", half: true, placeholder: "45.50" },
    { name: "dataCharges", label: "Data Charges", type: "number", group: "Charges", half: true, placeholder: "60" },
    { name: "smsCharges", label: "SMS Charges", type: "number", group: "Charges", half: true, placeholder: "12" },
    { name: "tax", label: "GST (18%)", type: "number", group: "Charges", half: true, placeholder: "92.97" },
    { name: "currency", label: "Currency", type: "currency", group: "Charges", half: true },

    // --- Invoice ---
    { name: "invoiceNo", label: "Invoice Number", type: "text", group: "Invoice", half: true, placeholder: "INV-MB-2026-0042" },
    { name: "dueDate", label: "Payment Due Date", type: "date", group: "Invoice", half: true },
  ],
  defaults: {
    operator: "Airtel",
    mobileNumber: "98765 43210",
    customerName: "Amit Sharma",
    planName: "Postpaid 399 Unlimited",
    billingFrom: "",
    billingTo: "",
    rentalCharge: "399",
    callCharges: "45.50",
    dataCharges: "60",
    smsCharges: "12",
    tax: "92.97",
    currency: "INR",
    invoiceNo: "INV-MB-2026-0042",
    dueDate: "",
  },
};
