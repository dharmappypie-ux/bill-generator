import { GeneratorConfig } from "@/types/generator";

export const stationeryBillConfig: GeneratorConfig = {
  slug: "stationery-bill",
  name: "Stationery Bill",
  title: "Stationery Bill Generator — Stationery Shop Bill & GST Invoice Maker",
  description:
    "Create realistic stationery shop bills in seconds. Add pens, notebooks, files and other items with quantities and rates, apply GST, then download a clean printable cash bill or a proper GST tax invoice.",
  icon: "fa-pen",
  category: "Commerce & Business",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Bill" },
    { id: "template-2", label: "GST Invoice" },
  ],
  fields: [
    // --- Shop ---
    {
      name: "shopName",
      label: "Shop Name",
      type: "text",
      group: "Shop",
      placeholder: "Sharma Stationery & Book Depot",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      group: "Shop",
      placeholder: "24, Sadar Bazar, Near Clock Tower, Meerut, Uttar Pradesh - 250001",
    },
    {
      name: "gstin",
      label: "GSTIN",
      type: "text",
      group: "Shop",
      half: true,
      placeholder: "09AABCS1234H1Z7",
    },
    {
      name: "billNo",
      label: "Bill No.",
      type: "text",
      group: "Shop",
      half: true,
      placeholder: "ST-2026-0481",
    },
    { name: "date", label: "Date", type: "date", group: "Shop", half: true },

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
      name: "gstPct",
      label: "GST (%)",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "12",
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
    shopName: "Sharma Stationery & Book Depot",
    address: "24, Sadar Bazar, Near Clock Tower, Meerut, Uttar Pradesh - 250001",
    gstin: "09AABCS1234H1Z7",
    billNo: "ST-2026-0481",
    date: "",
    items: JSON.stringify([
      { name: "Classmate Notebook 200 pg", qty: "6", rate: "65" },
      { name: "Reynolds Ball Pen (Pack of 5)", qty: "2", rate: "50" },
    ]),
    gstPct: "12",
    currency: "INR",
    paymentMethod: "Cash",
  },
};
