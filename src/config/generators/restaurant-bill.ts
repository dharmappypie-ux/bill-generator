import { GeneratorConfig } from "@/types/generator";

export const restaurantBillConfig: GeneratorConfig = {
  slug: "restaurant-bill",
  name: "Restaurant Bill",
  title: "Restaurant Bill Generator — Food Bill & GST Tax Invoice Maker",
  description:
    "Create realistic restaurant and food bills in seconds. Add your menu items, quantities and rates, apply service charge, CGST and SGST, then download a printable thermal POS slip or a GST tax invoice.",
  icon: "fa-utensils",
  category: "Commerce & Business",
  popular: false,
  hasThemes: true,
  hasCrumple: true,
  templates: [
    { id: "template-1", label: "Thermal Bill" },
    { id: "template-2", label: "GST Tax Invoice" },
  ],
  fields: [
    // --- Restaurant ---
    {
      name: "restaurantName",
      label: "Restaurant Name",
      type: "text",
      group: "Restaurant",
      placeholder: "Spice Garden Family Restaurant",
    },
    {
      name: "address",
      label: "Address",
      type: "textarea",
      group: "Restaurant",
      placeholder: "12, MG Road, Indiranagar, Bengaluru - 560038",
    },
    {
      name: "gstin",
      label: "GSTIN",
      type: "text",
      group: "Restaurant",
      half: true,
      placeholder: "29ABCDE1234F1Z5",
    },
    {
      name: "tableNo",
      label: "Table No.",
      type: "text",
      group: "Restaurant",
      half: true,
      placeholder: "07",
    },
    {
      name: "billNo",
      label: "Bill No.",
      type: "text",
      group: "Restaurant",
      half: true,
      placeholder: "INV-2026-1042",
    },
    { name: "date", label: "Date", type: "date", group: "Restaurant", half: true },
    { name: "time", label: "Time", type: "time", group: "Restaurant", half: true },

    // --- Items ---
    {
      name: "items",
      label: "Menu Items",
      type: "items",
      group: "Items",
      addLabel: "Add Item",
      columns: [
        { key: "name", label: "Item", type: "text", grow: 3 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "rate", label: "Rate", type: "number", grow: 1 },
      ],
    },

    // --- Charges ---
    {
      name: "serviceChargePct",
      label: "Service Charge (%)",
      type: "number",
      group: "Charges",
      half: true,
      placeholder: "5",
    },
    {
      name: "cgstPct",
      label: "CGST (%)",
      type: "number",
      group: "Charges",
      half: true,
      placeholder: "2.5",
    },
    {
      name: "sgstPct",
      label: "SGST (%)",
      type: "number",
      group: "Charges",
      half: true,
      placeholder: "2.5",
    },
    { name: "currency", label: "Currency", type: "currency", group: "Charges", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Charges",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Card", label: "Card" },
        { value: "UPI", label: "UPI" },
        { value: "Online", label: "Online" },
      ],
    },
  ],
  defaults: {
    restaurantName: "Spice Garden Family Restaurant",
    address: "12, MG Road, Indiranagar, Bengaluru - 560038",
    gstin: "29ABCDE1234F1Z5",
    tableNo: "07",
    billNo: "INV-2026-1042",
    date: "",
    time: "",
    items: JSON.stringify([
      { name: "Paneer Butter Masala", qty: "1", rate: "260" },
      { name: "Butter Naan", qty: "4", rate: "45" },
    ]),
    serviceChargePct: "5",
    cgstPct: "2.5",
    sgstPct: "2.5",
    currency: "INR",
    paymentMethod: "UPI",
  },
};
