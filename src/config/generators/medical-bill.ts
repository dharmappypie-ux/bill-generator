import { GeneratorConfig } from "@/types/generator";

export const medicalBillConfig: GeneratorConfig = {
  slug: "medical-bill",
  name: "Medical Bill",
  title: "Medical Bill Generator — Pharmacy / Medical Store Bill & GST Invoice Maker",
  description:
    "Create realistic pharmacy and medical store bills in seconds. Add medicines with batch numbers, quantities and rates, apply GST and discount, then download a clean printable medical bill or a compact cash receipt.",
  icon: "fa-stethoscope",
  category: "Professional & Personal",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Pharmacy Bill" },
    { id: "template-2", label: "Receipt" },
  ],
  fields: [
    // --- Pharmacy ---
    {
      name: "logo",
      label: "Pharmacy Logo",
      type: "logo",
      group: "Pharmacy",
      logos: [
        { id: "cross", label: "Pharmacy Cross", src: "/pharma/cross.svg" },
        { id: "apollo", label: "Apollo Style", src: "/pharma/apollo.svg" },
        { id: "medplus", label: "MedPlus Style", src: "/pharma/medplus.svg" },
        { id: "rx", label: "Rx / Chemist", src: "/pharma/rx.svg" },
      ],
    },
    {
      name: "pharmacyName",
      label: "Pharmacy Name",
      type: "text",
      group: "Pharmacy",
      placeholder: "Apollo Medical & General Store",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      group: "Pharmacy",
      placeholder: "15, Station Road, Opp. City Hospital, Pune, Maharashtra - 411001",
    },
    {
      name: "gstin",
      label: "GSTIN",
      type: "text",
      group: "Pharmacy",
      half: true,
      placeholder: "27AABCA1234M1Z9",
    },
    {
      name: "dlNo",
      label: "Drug Licence No.",
      type: "text",
      group: "Pharmacy",
      half: true,
      placeholder: "MH-PNE-20B-123456 / 21B-123457",
    },
    {
      name: "billNo",
      label: "Bill No.",
      type: "text",
      group: "Pharmacy",
      half: true,
      placeholder: "MED-2026-1187",
    },
    { name: "date", label: "Date", type: "date", group: "Pharmacy", half: true },

    // --- Patient ---
    {
      name: "patientName",
      label: "Patient Name",
      type: "text",
      group: "Patient",
      half: true,
      placeholder: "Rohan Deshmukh",
    },
    {
      name: "doctorName",
      label: "Doctor Name",
      type: "text",
      group: "Patient",
      half: true,
      placeholder: "Dr. S. Kulkarni (MD)",
    },

    // --- Items ---
    {
      name: "items",
      label: "Medicines",
      type: "items",
      group: "Items",
      addLabel: "Add Medicine",
      columns: [
        { key: "name", label: "Medicine", type: "text", grow: 3 },
        { key: "batch", label: "Batch", type: "text", grow: 1 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "rate", label: "Rate", type: "number", grow: 1 },
      ],
    },

    // --- Summary ---
    {
      name: "gstPct",
      label: "GST (%)",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "12",
    },
    {
      name: "discount",
      label: "Discount (%)",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "5",
    },
    { name: "currency", label: "Currency", type: "currency", group: "Summary", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Summary",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Card", label: "Card" },
        { value: "Credit", label: "Credit" },
      ],
    },
  ],
  defaults: {
    logo: "cross",
    pharmacyName: "Apollo Medical & General Store",
    address: "15, Station Road, Opp. City Hospital, Pune, Maharashtra - 411001",
    gstin: "27AABCA1234M1Z9",
    dlNo: "MH-PNE-20B-123456 / 21B-123457",
    billNo: "MED-2026-1187",
    date: "",
    patientName: "Rohan Deshmukh",
    doctorName: "Dr. S. Kulkarni (MD)",
    items: JSON.stringify([
      { name: "Dolo 650 Tablet (Strip of 15)", batch: "DL2291", qty: "2", rate: "32" },
      { name: "Azithral 500 Tablet (Strip of 5)", batch: "AZ8842", qty: "1", rate: "118" },
    ]),
    gstPct: "12",
    discount: "5",
    currency: "INR",
    paymentMethod: "UPI",
  },
};
