import { GeneratorConfig } from "@/types/generator";

export const schoolReceiptConfig: GeneratorConfig = {
  slug: "school-receipt",
  name: "School Fee Receipt",
  title: "School Fee Receipt Generator — Tuition & Term Fee Bill Maker",
  description:
    "Create professional school fee receipts in seconds. Add your school details, student name, class and roll number, list fee heads like tuition, transport and exam fees, pick a currency, then download a print-ready PDF.",
  icon: "fa-graduation-cap",
  category: "Professional & Personal",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Fee Receipt" },
    { id: "template-2", label: "Compact" },
  ],
  fields: [
    // --- School ---
    {
      name: "schoolName",
      label: "School Name",
      type: "text",
      group: "School",
      placeholder: "St. Xavier's High School",
    },
    {
      name: "address",
      label: "School Address",
      type: "textarea",
      group: "School",
      placeholder:
        "Plot 14, Sector 21, Nerul, Navi Mumbai, Maharashtra 400706",
    },
    {
      name: "receiptNo",
      label: "Receipt Number",
      type: "text",
      group: "School",
      half: true,
      placeholder: "SXHS/2026-27/00471",
    },
    { name: "date", label: "Receipt Date", type: "date", group: "School", half: true },

    // --- Student ---
    {
      name: "studentName",
      label: "Student Name",
      type: "text",
      group: "Student",
      half: true,
      placeholder: "Aarav Sharma",
    },
    {
      name: "className",
      label: "Class / Section",
      type: "text",
      group: "Student",
      half: true,
      placeholder: "VIII - B",
    },
    {
      name: "rollNo",
      label: "Roll Number",
      type: "text",
      group: "Student",
      half: true,
      placeholder: "27",
    },
    {
      name: "session",
      label: "Academic Session",
      type: "text",
      group: "Student",
      half: true,
      placeholder: "2026-27",
    },

    // --- Fees ---
    {
      name: "items",
      label: "Fee Heads",
      type: "items",
      group: "Fees",
      addLabel: "Add Fee Head",
      columns: [
        { key: "head", label: "Fee Head", type: "text", grow: 3 },
        { key: "amount", label: "Amount", type: "number", grow: 1 },
      ],
    },

    // --- Summary ---
    { name: "currency", label: "Currency", type: "currency", group: "Summary", half: true },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      group: "Summary",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Cheque", label: "Cheque" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Credit Card", label: "Credit Card" },
        { value: "Net Banking", label: "Net Banking" },
        { value: "DD", label: "Demand Draft" },
      ],
    },
  ],
  defaults: {
    schoolName: "St. Xavier's High School",
    address: "Plot 14, Sector 21, Nerul, Navi Mumbai, Maharashtra 400706",
    receiptNo: "SXHS/2026-27/00471",
    date: "",
    studentName: "Aarav Sharma",
    className: "VIII - B",
    rollNo: "27",
    session: "2026-27",
    items: JSON.stringify([
      { head: "Tuition Fee", amount: "12500.00" },
      { head: "Transport Fee", amount: "3200.00" },
      { head: "Examination Fee", amount: "800.00" },
    ]),
    currency: "INR",
    paymentMode: "UPI",
  },
};
