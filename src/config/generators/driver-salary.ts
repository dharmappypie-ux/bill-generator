import { GeneratorConfig } from "@/types/generator";

export const driverSalaryConfig: GeneratorConfig = {
  slug: "driver-salary",
  name: "Driver Salary Receipt",
  title: "Driver Salary Receipt Generator — Monthly Salary Slips Online",
  description:
    "Generate a monthly driver salary receipt with a revenue stamp area. Enter employer, driver, month, salary and advance details, choose a template and currency, and download a print-ready PDF.",
  icon: "fa-id-card",
  category: "Professional & Personal",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Standard Receipt" },
    { id: "template-2", label: "Bordered Form" },
  ],
  fields: [
    { name: "employerName", label: "Employer Name", type: "text", group: "Details", half: true, placeholder: "Rajesh Mehta" },
    { name: "driverName", label: "Driver Name", type: "text", group: "Details", half: true, placeholder: "Ramesh Kumar" },
    { name: "month", label: "Salary Month", type: "text", group: "Details", half: true, placeholder: "May 2026" },
    {
      name: "designation",
      label: "Designation",
      type: "select",
      group: "Details",
      half: true,
      options: [
        { value: "Driver", label: "Driver" },
        { value: "Personal Driver", label: "Personal Driver" },
        { value: "Commercial Driver", label: "Commercial Driver" },
        { value: "Chauffeur", label: "Chauffeur" },
        { value: "Delivery Driver", label: "Delivery Driver" },
      ],
    },

    { name: "salaryAmount", label: "Salary Amount", type: "number", group: "Amount", half: true, placeholder: "18000" },
    { name: "advanceDeducted", label: "Advance Deducted", type: "number", group: "Amount", half: true, placeholder: "2000" },
    { name: "currency", label: "Currency", type: "currency", group: "Amount", half: true },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      group: "Amount",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "UPI", label: "UPI" },
        { value: "Cheque", label: "Cheque" },
      ],
    },
    { name: "receiptNo", label: "Receipt No.", type: "text", group: "Amount", half: true, placeholder: "DS-0042" },
    { name: "date", label: "Receipt Date", type: "date", group: "Amount", half: true },
  ],
  defaults: {
    employerName: "Rajesh Mehta",
    driverName: "Ramesh Kumar",
    month: "May 2026",
    designation: "Personal Driver",
    salaryAmount: "18000",
    advanceDeducted: "2000",
    currency: "INR",
    paymentMode: "Cash",
    receiptNo: "DS-0042",
    date: "",
  },
};
