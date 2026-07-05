import { GeneratorConfig } from "@/types/generator";

export const gstInvoiceConfig: GeneratorConfig = {
  slug: "gst-invoice",
  name: "GST Invoice",
  title: "GST Invoice Generator — GST Tax Invoice Maker with CGST/SGST & IGST",
  description:
    "Create a fully compliant GST tax invoice in seconds. Add seller and buyer GSTIN, place of supply and line items, choose CGST+SGST or IGST, and download a print-ready PDF with the taxable value, tax breakup and grand total.",
  icon: "fa-file-invoice",
  category: "Commerce & Business",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Tax Invoice" },
    { id: "template-2", label: "Simple Invoice" },
  ],
  fields: [
    // --- Seller ---
    {
      name: "sellerName",
      label: "Seller / Business Name",
      type: "text",
      group: "Seller",
      placeholder: "Sharma Enterprises Pvt. Ltd.",
    },
    {
      name: "sellerGstin",
      label: "Seller GSTIN",
      type: "text",
      group: "Seller",
      half: true,
      placeholder: "29ABCDE1234F1Z5",
    },
    {
      name: "sellerState",
      label: "Seller State",
      type: "text",
      group: "Seller",
      half: true,
      placeholder: "Karnataka (29)",
    },
    {
      name: "sellerAddress",
      label: "Seller Address",
      type: "textarea",
      group: "Seller",
      placeholder: "14, MG Road, Indiranagar, Bengaluru, Karnataka - 560038",
    },

    // --- Buyer ---
    {
      name: "buyerName",
      label: "Buyer / Client Name",
      type: "text",
      group: "Buyer",
      placeholder: "Verma Trading Co.",
    },
    {
      name: "buyerGstin",
      label: "Buyer GSTIN",
      type: "text",
      group: "Buyer",
      half: true,
      placeholder: "27PQRST5678G2Z9",
    },
    {
      name: "buyerState",
      label: "Buyer State",
      type: "text",
      group: "Buyer",
      half: true,
      placeholder: "Maharashtra (27)",
    },
    {
      name: "buyerAddress",
      label: "Buyer Address",
      type: "textarea",
      group: "Buyer",
      placeholder: "302, Linking Road, Bandra West, Mumbai, Maharashtra - 400050",
    },

    // --- Invoice ---
    {
      name: "invoiceNo",
      label: "Invoice No.",
      type: "text",
      group: "Invoice",
      half: true,
      placeholder: "INV-2026-0042",
    },
    { name: "invoiceDate", label: "Invoice Date", type: "date", group: "Invoice", half: true },
    {
      name: "placeOfSupply",
      label: "Place of Supply",
      type: "text",
      group: "Invoice",
      placeholder: "Maharashtra (27)",
    },

    // --- Items ---
    {
      name: "items",
      label: "Line Items",
      type: "items",
      group: "Items",
      addLabel: "Add Item",
      columns: [
        { key: "desc", label: "Description", type: "text", grow: 3 },
        { key: "hsn", label: "HSN/SAC", type: "text", grow: 1 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "rate", label: "Rate", type: "number", grow: 1 },
      ],
    },

    // --- Tax ---
    {
      name: "taxType",
      label: "Tax Type",
      type: "select",
      group: "Tax",
      half: true,
      options: [
        { value: "CGST+SGST", label: "CGST + SGST (Intra-state)" },
        { value: "IGST", label: "IGST (Inter-state)" },
      ],
    },
    {
      name: "gstPct",
      label: "GST Rate (%)",
      type: "number",
      group: "Tax",
      half: true,
      placeholder: "18",
    },
    { name: "currency", label: "Currency", type: "currency", group: "Tax", half: true },
  ],
  defaults: {
    sellerName: "Sharma Enterprises Pvt. Ltd.",
    sellerGstin: "29ABCDE1234F1Z5",
    sellerState: "Karnataka (29)",
    sellerAddress: "14, MG Road, Indiranagar, Bengaluru, Karnataka - 560038",
    buyerName: "Verma Trading Co.",
    buyerGstin: "27PQRST5678G2Z9",
    buyerState: "Maharashtra (27)",
    buyerAddress: "302, Linking Road, Bandra West, Mumbai, Maharashtra - 400050",
    invoiceNo: "INV-2026-0042",
    invoiceDate: "",
    placeOfSupply: "Maharashtra (27)",
    items: JSON.stringify([
      { desc: "Cotton T-Shirt (Round Neck)", hsn: "6109", qty: "10", rate: "320" },
      { desc: "Denim Jeans (Slim Fit)", hsn: "6203", qty: "5", rate: "850" },
    ]),
    taxType: "IGST",
    gstPct: "18",
    currency: "INR",
  },
};
