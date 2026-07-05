import { GeneratorConfig } from "@/types/generator";

export const bookInvoiceConfig: GeneratorConfig = {
  slug: "book-invoice",
  name: "Book Invoice",
  title: "Book Invoice Generator — Bookstore Bill & Receipt Maker",
  description:
    "Create clean bookstore invoices and receipts in seconds. Add your store details and GSTIN, list books with quantity and price, apply a discount and GST, choose a currency, then download a print-ready PDF.",
  icon: "fa-book",
  category: "Professional & Personal",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Invoice" },
    { id: "template-2", label: "Receipt" },
  ],
  fields: [
    // --- Store ---
    {
      name: "storeName",
      label: "Store Name",
      type: "text",
      group: "Store",
      placeholder: "Sapna Book House",
    },
    {
      name: "address",
      label: "Store Address",
      type: "textarea",
      group: "Store",
      placeholder:
        "No. 11, 3rd Main Road, Gandhi Nagar, Bengaluru, Karnataka 560009",
    },
    {
      name: "gstin",
      label: "GSTIN",
      type: "text",
      group: "Store",
      half: true,
      placeholder: "29AABCS1234L1ZX",
    },
    {
      name: "invoiceNo",
      label: "Invoice Number",
      type: "text",
      group: "Store",
      half: true,
      placeholder: "SBH/2026/04821",
    },
    { name: "date", label: "Invoice Date", type: "date", group: "Store", half: true },

    // --- Customer ---
    {
      name: "customerName",
      label: "Customer Name",
      type: "text",
      group: "Customer",
      placeholder: "Ananya Iyer",
    },

    // --- Items ---
    {
      name: "items",
      label: "Books",
      type: "items",
      group: "Items",
      addLabel: "Add Book",
      columns: [
        { key: "title", label: "Book Title", type: "text", grow: 3 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "rate", label: "Price", type: "number", grow: 1 },
      ],
    },

    // --- Summary ---
    {
      name: "discount",
      label: "Discount",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "120.00",
    },
    {
      name: "gstPct",
      label: "GST (%)",
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
        { value: "Credit Card", label: "Credit Card" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Net Banking", label: "Net Banking" },
      ],
    },
  ],
  defaults: {
    storeName: "Sapna Book House",
    address: "No. 11, 3rd Main Road, Gandhi Nagar, Bengaluru, Karnataka 560009",
    gstin: "29AABCS1234L1ZX",
    invoiceNo: "SBH/2026/04821",
    date: "",
    customerName: "Ananya Iyer",
    items: JSON.stringify([
      { title: "The Psychology of Money — Morgan Housel", qty: "1", rate: "399.00" },
      { title: "Atomic Habits — James Clear", qty: "2", rate: "499.00" },
    ]),
    discount: "120.00",
    gstPct: "5",
    currency: "INR",
    paymentMethod: "UPI",
  },
};
