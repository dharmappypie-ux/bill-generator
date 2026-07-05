import { GeneratorConfig } from "@/types/generator";

export const ecommerceInvoiceConfig: GeneratorConfig = {
  slug: "ecommerce-invoice",
  name: "E-commerce Invoice",
  title: "E-commerce Invoice Generator — Online Order Tax Invoice Maker",
  description:
    "Create realistic online shopping tax invoices in Amazon / Flipkart style. Add seller and buyer details, line items, shipping, discount and GST, pick a currency, then download a clean PDF in seconds.",
  icon: "fa-cart-shopping",
  category: "Commerce & Business",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Tax Invoice" },
    { id: "template-2", label: "Order Receipt" },
  ],
  fields: [
    // --- Seller ---
    {
      name: "sellerName",
      label: "Seller / Store Name",
      type: "text",
      group: "Seller",
      placeholder: "Clicktech Retail Private Limited",
    },
    {
      name: "sellerGstin",
      label: "Seller GSTIN",
      type: "text",
      group: "Seller",
      half: true,
      placeholder: "29AAFCC1234R1ZP",
    },
    {
      name: "sellerAddress",
      label: "Seller Address",
      type: "textarea",
      group: "Seller",
      placeholder:
        "Building No. 12, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
    },

    // --- Order ---
    {
      name: "buyerName",
      label: "Buyer Name",
      type: "text",
      group: "Order",
      placeholder: "Amit Sharma",
    },
    {
      name: "buyerAddress",
      label: "Shipping Address",
      type: "textarea",
      group: "Order",
      placeholder: "Flat 204, Green Acres, Sector 21, Noida, Uttar Pradesh 201301",
    },
    {
      name: "orderId",
      label: "Order ID",
      type: "text",
      group: "Order",
      half: true,
      placeholder: "404-7712398-4451029",
    },
    {
      name: "invoiceNo",
      label: "Invoice Number",
      type: "text",
      group: "Order",
      half: true,
      placeholder: "BLR5-2026-118842",
    },
    { name: "orderDate", label: "Order Date", type: "date", group: "Order", half: true },

    // --- Items ---
    {
      name: "items",
      label: "Order Items",
      type: "items",
      group: "Items",
      addLabel: "Add Item",
      columns: [
        { key: "name", label: "Item", type: "text", grow: 3 },
        { key: "qty", label: "Qty", type: "number", grow: 1 },
        { key: "rate", label: "Unit Price", type: "number", grow: 1 },
      ],
    },

    // --- Summary ---
    {
      name: "shipping",
      label: "Shipping / Delivery",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "49.00",
    },
    {
      name: "discount",
      label: "Discount",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "150.00",
    },
    {
      name: "taxPct",
      label: "GST (%)",
      type: "number",
      group: "Summary",
      half: true,
      placeholder: "18",
    },
    { name: "currency", label: "Currency", type: "currency", group: "Summary", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Summary",
      half: true,
      options: [
        { value: "UPI", label: "UPI" },
        { value: "Credit Card", label: "Credit Card" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Net Banking", label: "Net Banking" },
        { value: "Wallet", label: "Wallet" },
        { value: "Cash on Delivery", label: "Cash on Delivery" },
      ],
    },
  ],
  defaults: {
    sellerName: "Clicktech Retail Private Limited",
    sellerGstin: "29AAFCC1234R1ZP",
    sellerAddress:
      "Building No. 12, Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103",
    buyerName: "Amit Sharma",
    buyerAddress: "Flat 204, Green Acres, Sector 21, Noida, Uttar Pradesh 201301",
    orderId: "404-7712398-4451029",
    invoiceNo: "BLR5-2026-118842",
    orderDate: "",
    items: JSON.stringify([
      { name: "Wireless Bluetooth Earbuds (Black)", qty: "1", rate: "1799.00" },
      { name: "USB-C Fast Charging Cable 1m", qty: "2", rate: "299.00" },
    ]),
    shipping: "49.00",
    discount: "150.00",
    taxPct: "18",
    currency: "INR",
    paymentMethod: "UPI",
  },
};
