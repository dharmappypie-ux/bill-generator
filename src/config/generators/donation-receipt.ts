import { GeneratorConfig } from "@/types/generator";

export const donationReceiptConfig: GeneratorConfig = {
  slug: "donation-receipt",
  name: "Donation Receipt",
  title: "Donation Receipt Generator — 80G Tax-Exemption Donation Receipt",
  description:
    "Create 80G-style donation receipts for trusts, NGOs and charitable institutions. Add organisation, donor and donation details, choose a template and currency, and download a print-ready receipt acknowledging the contribution and its eligibility for deduction under section 80G.",
  icon: "fa-hand-holding-heart",
  category: "Professional & Personal",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "80G Receipt" },
    { id: "template-2", label: "Simple Receipt" },
  ],
  fields: [
    // --- Organisation ---
    { name: "orgName", label: "Organisation Name", type: "text", group: "Organisation", placeholder: "Aasha Charitable Trust" },
    { name: "orgAddress", label: "Organisation Address", type: "textarea", group: "Organisation", placeholder: "14, Gandhi Marg, Civil Lines, New Delhi - 110054" },
    { name: "orgPan", label: "Organisation PAN", type: "text", group: "Organisation", half: true, placeholder: "AAATA1234F" },
    { name: "regNo80G", label: "80G Registration No.", type: "text", group: "Organisation", half: true, placeholder: "AAATA1234FF20214" },
    { name: "receiptNo", label: "Receipt No.", type: "text", group: "Organisation", half: true, placeholder: "DN-2026-0117" },
    { name: "date", label: "Receipt Date", type: "date", group: "Organisation", half: true },

    // --- Donor ---
    { name: "donorName", label: "Donor Name", type: "text", group: "Donor", half: true, placeholder: "Rohan Mehta" },
    { name: "donorPan", label: "Donor PAN", type: "text", group: "Donor", half: true, placeholder: "BKLPM7788Q" },
    { name: "donorAddress", label: "Donor Address", type: "textarea", group: "Donor", placeholder: "B-22, Sector 18, Noida, Uttar Pradesh - 201301" },

    // --- Donation ---
    { name: "amount", label: "Donation Amount", type: "number", group: "Donation", half: true, placeholder: "11000" },
    { name: "currency", label: "Currency", type: "currency", group: "Donation", half: true },
    {
      name: "paymentMode",
      label: "Payment Mode",
      type: "select",
      group: "Donation",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Cheque", label: "Cheque" },
        { value: "UPI", label: "UPI" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Credit/Debit Card", label: "Credit/Debit Card" },
        { value: "Demand Draft", label: "Demand Draft" },
      ],
    },
    { name: "purpose", label: "Purpose of Donation", type: "text", group: "Donation", half: true, placeholder: "Corpus / General Fund" },
  ],
  defaults: {
    orgName: "Aasha Charitable Trust",
    orgAddress: "14, Gandhi Marg, Civil Lines, New Delhi - 110054",
    orgPan: "AAATA1234F",
    regNo80G: "AAATA1234FF20214",
    receiptNo: "DN-2026-0117",
    date: "",
    donorName: "Rohan Mehta",
    donorPan: "BKLPM7788Q",
    donorAddress: "B-22, Sector 18, Noida, Uttar Pradesh - 201301",
    amount: "11000",
    currency: "INR",
    paymentMode: "UPI",
    purpose: "General / Charitable Fund",
  },
};
