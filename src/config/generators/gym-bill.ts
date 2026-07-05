import { GeneratorConfig } from "@/types/generator";

export const gymBillConfig: GeneratorConfig = {
  slug: "gym-bill",
  name: "Gym Bill",
  title: "Gym Bill Generator — Membership Fee Receipts Online",
  description:
    "Create gym and fitness membership receipts in seconds. Add member details, membership plan, validity period, amount and tax, pick a template and currency, and download a print-ready PDF.",
  icon: "fa-dumbbell",
  category: "Utilities & Services",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Receipt" },
    { id: "template-2", label: "Invoice" },
  ],
  fields: [
    // ---- Member ----
    { name: "gymName", label: "Gym Name", type: "text", group: "Member", half: true, placeholder: "Iron Pulse Fitness" },
    { name: "gymAddress", label: "Gym Address", type: "textarea", group: "Member", placeholder: "Shop 7, MG Road, Indiranagar, Bengaluru 560038" },
    { name: "gymGstin", label: "GSTIN", type: "text", group: "Member", half: true, placeholder: "29ABCDE1234F1Z5" },
    { name: "gymPhone", label: "Phone", type: "text", group: "Member", half: true, placeholder: "+91 98860 12345" },
    { name: "memberName", label: "Member Name", type: "text", group: "Member", half: true, placeholder: "Rohan Mehta" },
    { name: "memberId", label: "Member ID", type: "text", group: "Member", half: true, placeholder: "GYM-2041" },
    {
      name: "membershipType",
      label: "Membership Type",
      type: "select",
      group: "Member",
      half: true,
      options: [
        { value: "Monthly", label: "Monthly" },
        { value: "Quarterly", label: "Quarterly" },
        { value: "Annual", label: "Annual" },
      ],
    },
    { name: "validFrom", label: "Valid From", type: "date", group: "Member", half: true },
    { name: "validTo", label: "Valid To", type: "date", group: "Member", half: true },

    // ---- Payment ----
    { name: "receiptNo", label: "Receipt No.", type: "text", group: "Payment", half: true, placeholder: "RCPT-0098" },
    { name: "date", label: "Receipt Date", type: "date", group: "Payment", half: true },
    { name: "amount", label: "Amount", type: "number", group: "Payment", half: true, placeholder: "12000" },
    { name: "tax", label: "GST (18%)", type: "number", group: "Payment", half: true, placeholder: "2160" },
    { name: "currency", label: "Currency", type: "currency", group: "Payment", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Payment",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Credit/Debit Card", label: "Credit/Debit Card" },
        { value: "Net Banking", label: "Net Banking" },
        { value: "Cheque", label: "Cheque" },
      ],
    },

    // ---- Notes ----
    { name: "note", label: "Footer Note", type: "textarea", group: "Notes", placeholder: "Thank you for being a member! Carry your membership card to every session." },
  ],
  defaults: {
    gymName: "Iron Pulse Fitness",
    gymAddress: "Shop 7, 2nd Floor, 100 Ft Road, Indiranagar, Bengaluru 560038",
    gymGstin: "29ABCDE1234F1Z5",
    gymPhone: "+91 98860 12345",
    memberName: "Rohan Mehta",
    memberId: "GYM-2041",
    membershipType: "Quarterly",
    validFrom: "",
    validTo: "",
    receiptNo: "RCPT-0098",
    date: "",
    amount: "12000",
    tax: "2160",
    currency: "INR",
    paymentMethod: "UPI",
    note: "Thank you for being a member! Carry your membership card to every session.",
  },
};
