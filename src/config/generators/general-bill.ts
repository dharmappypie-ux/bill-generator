import { GeneratorConfig } from "@/types/generator";

export const generalBillConfig: GeneratorConfig = {
  slug: "general-bill",
  name: "General Bill",
  title: "General Bill Generator — Free All-Purpose Invoice & Bill Maker",
  description:
    "Create a flexible all-purpose bill for any shop, service or sale. Add your business details, customer, line items with quantity and rate, then apply discount and tax. Download a clean printable bill or a compact thermal POS slip in seconds.",
  icon: "fa-receipt",
  category: "Commerce & Business",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Bill" },
    { id: "template-2", label: "Thermal" },
  ],
  fields: [
    // --- Business ---
    {
      name: "businessName",
      label: "Business Name",
      type: "text",
      group: "Business",
      placeholder: "Sharma General Store",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      group: "Business",
      placeholder: "Shop 14, Main Bazaar Road, Karol Bagh, New Delhi - 110005",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      group: "Business",
      half: true,
      placeholder: "+91 98110 22334",
    },
    {
      name: "billNo",
      label: "Bill No.",
      type: "text",
      group: "Business",
      half: true,
      placeholder: "BILL-2026-0457",
    },
    { name: "date", label: "Date", type: "date", group: "Business", half: true },

    // --- Customer ---
    {
      name: "customerName",
      label: "Customer Name",
      type: "text",
      group: "Customer",
      half: true,
      placeholder: "Rohit Verma",
    },
    {
      name: "customerPhone",
      label: "Customer Phone",
      type: "text",
      group: "Customer",
      half: true,
      placeholder: "+91 99100 55667",
    },

    // --- Items ---
    {
      name: "items",
      label: "Items",
      type: "items",
      group: "Items",
      addLabel: "Add Item",
      columns: [
        { key: "name", label: "Item", type: "text", grow: 3 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "rate", label: "Rate", type: "number", grow: 1 },
      ],
    },

    // --- Summary ---
    {
      name: "discount",
      label: "Discount",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "50",
    },
    {
      name: "taxPct",
      label: "Tax (%)",
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
        { value: "Online", label: "Online" },
      ],
    },
  ],
  defaults: {
    businessName: "Sharma General Store",
    address: "Shop 14, Main Bazaar Road, Karol Bagh, New Delhi - 110005",
    phone: "+91 98110 22334",
    billNo: "BILL-2026-0457",
    date: "",
    customerName: "Rohit Verma",
    customerPhone: "+91 99100 55667",
    items: JSON.stringify([
      { name: "Tata Salt 1kg", qty: "2", rate: "28" },
      { name: "Aashirvaad Atta 5kg", qty: "1", rate: "265" },
    ]),
    discount: "50",
    taxPct: "0",
    currency: "INR",
    paymentMethod: "UPI",
  },
};
