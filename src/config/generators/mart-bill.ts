import { GeneratorConfig } from "@/types/generator";

export const martBillConfig: GeneratorConfig = {
  slug: "mart-bill",
  name: "Mart Bill",
  title: "Mart Bill Generator — Supermarket & Grocery POS Receipt Maker",
  description:
    "Create realistic supermarket, grocery and mart bills in seconds. Add your products with MRP and selling rate, and the bill auto-calculates the total along with the amount your customer saved. Download a printable thermal POS receipt or a detailed itemised bill.",
  icon: "fa-store",
  category: "Commerce & Business",
  popular: false,
  hasThemes: true,
  hasCrumple: true,
  templates: [
    { id: "template-1", label: "POS Receipt" },
    { id: "template-2", label: "Detailed Bill" },
  ],
  fields: [
    // --- Store ---
    {
      name: "storeName",
      label: "Store Name",
      type: "text",
      group: "Store",
      placeholder: "More Supermarket",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      group: "Store",
      placeholder: "Shop 4, Sector 18 Market, Noida, Uttar Pradesh - 201301",
    },
    {
      name: "gstin",
      label: "GSTIN",
      type: "text",
      group: "Store",
      half: true,
      placeholder: "09AABCM1234L1ZP",
    },
    {
      name: "billNo",
      label: "Bill No.",
      type: "text",
      group: "Store",
      half: true,
      placeholder: "INV-2026-58213",
    },
    {
      name: "cashier",
      label: "Cashier",
      type: "text",
      group: "Store",
      half: true,
      placeholder: "Rahul",
    },
    { name: "date", label: "Date", type: "date", group: "Store", half: true },
    { name: "time", label: "Time", type: "time", group: "Store", half: true },

    // --- Items ---
    {
      name: "items",
      label: "Products",
      type: "items",
      group: "Items",
      addLabel: "Add Product",
      columns: [
        { key: "name", label: "Product", type: "text", grow: 3 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "mrp", label: "MRP", type: "number", grow: 1 },
        { key: "rate", label: "Rate", type: "number", grow: 1 },
      ],
    },

    // --- Summary ---
    { name: "currency", label: "Currency", type: "currency", group: "Summary", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Summary",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
        { value: "UPI", label: "UPI" },
        { value: "Wallet", label: "Wallet" },
      ],
    },
  ],
  defaults: {
    storeName: "More Supermarket",
    address: "Shop 4, Sector 18 Market, Noida, Uttar Pradesh - 201301",
    gstin: "09AABCM1234L1ZP",
    billNo: "INV-2026-58213",
    cashier: "Rahul",
    date: "",
    time: "",
    items: JSON.stringify([
      { name: "Aashirvaad Atta 5kg", qty: "1", mrp: "285", rate: "255" },
      { name: "Amul Gold Milk 1L", qty: "2", mrp: "70", rate: "66" },
    ]),
    currency: "INR",
    paymentMethod: "UPI",
  },
};
