import { GeneratorConfig } from "@/types/generator";

export const rechargeBillConfig: GeneratorConfig = {
  slug: "recharge-bill",
  name: "Recharge Bill",
  title: "Recharge Bill Generator — Prepaid Mobile Recharge Receipt Maker",
  description:
    "Create a realistic prepaid mobile recharge receipt for Airtel, Jio, Vi and BSNL. Enter the operator, mobile number, plan amount, validity, data and talktime, pick a template and currency, and download a print-ready recharge slip in seconds.",
  icon: "fa-bolt",
  category: "Utilities & Services",
  popular: false,
  hasThemes: true,
  hasCrumple: true,
  templates: [
    { id: "template-1", label: "Thermal Slip" },
    { id: "template-2", label: "Receipt Card" },
  ],
  fields: [
    // --- Recharge ---
    {
      name: "operator",
      label: "Operator",
      type: "select",
      group: "Recharge",
      half: true,
      options: [
        { value: "Airtel", label: "Airtel" },
        { value: "Jio", label: "Jio" },
        { value: "Vi", label: "Vi" },
        { value: "BSNL", label: "BSNL" },
      ],
    },
    { name: "mobileNumber", label: "Mobile Number", type: "text", group: "Recharge", half: true, placeholder: "98765 43210" },
    { name: "planAmount", label: "Plan Amount", type: "number", group: "Recharge", half: true, placeholder: "299" },
    { name: "validity", label: "Validity", type: "text", group: "Recharge", half: true, placeholder: "28 Days" },
    { name: "talktime", label: "Talktime", type: "text", group: "Recharge", half: true, placeholder: "Unlimited" },
    { name: "data", label: "Data", type: "text", group: "Recharge", half: true, placeholder: "1.5 GB/Day" },

    // --- Transaction ---
    { name: "txnId", label: "Transaction ID", type: "text", group: "Transaction", half: true, placeholder: "TXN3927461085" },
    { name: "currency", label: "Currency", type: "currency", group: "Transaction", half: true },
    { name: "date", label: "Recharge Date", type: "date", group: "Transaction", half: true },
    { name: "time", label: "Recharge Time", type: "time", group: "Transaction", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Transaction",
      half: true,
      options: [
        { value: "UPI", label: "UPI" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Credit Card", label: "Credit Card" },
        { value: "Net Banking", label: "Net Banking" },
        { value: "Wallet", label: "Wallet" },
      ],
    },
  ],
  defaults: {
    operator: "Airtel",
    mobileNumber: "98765 43210",
    planAmount: "299",
    validity: "28 Days",
    talktime: "Unlimited",
    data: "1.5 GB/Day",
    txnId: "TXN3927461085",
    currency: "INR",
    date: "",
    time: "",
    paymentMethod: "UPI",
  },
};
