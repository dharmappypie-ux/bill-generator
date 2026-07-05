import { GeneratorConfig } from "@/types/generator";

export const cabBillConfig: GeneratorConfig = {
  slug: "cab-bill",
  name: "Cab / Taxi Bill",
  title: "Cab & Taxi Bill Generator — Trip Receipt Maker",
  description:
    "Create realistic local taxi and cab trip receipts in seconds. Add pickup and drop, distance, fare breakup and payment mode, then download a printable thermal slip or GST tax invoice.",
  icon: "fa-taxi",
  category: "Transportation & Travel",
  popular: false,
  hasThemes: false,
  hasCrumple: false,
  templates: [
    { id: "template-1", label: "Thermal Slip" },
    { id: "template-2", label: "Tax Invoice" },
  ],
  fields: [
    // --- Trip Details ---
    { name: "companyName", label: "Cab / Operator Name", type: "text", group: "Trip Details", placeholder: "Sri Sai Cabs" },
    { name: "driverName", label: "Driver Name", type: "text", group: "Trip Details", half: true, placeholder: "Ramesh Kumar" },
    { name: "vehicleNo", label: "Vehicle Number", type: "text", group: "Trip Details", half: true, placeholder: "KA 01 AB 4521" },
    { name: "pickup", label: "Pickup Location", type: "text", group: "Trip Details", placeholder: "Kempegowda Intl Airport, Bengaluru" },
    { name: "drop", label: "Drop Location", type: "text", group: "Trip Details", placeholder: "MG Road, Bengaluru" },
    { name: "distanceKm", label: "Distance (km)", type: "number", group: "Trip Details", half: true, placeholder: "18.5" },
    { name: "durationMin", label: "Duration (min)", type: "number", group: "Trip Details", half: true, placeholder: "42" },
    { name: "date", label: "Trip Date", type: "date", group: "Trip Details", half: true },
    { name: "time", label: "Trip Time", type: "time", group: "Trip Details", half: true },

    // --- Fare ---
    { name: "baseFare", label: "Base Fare", type: "number", group: "Fare", half: true, placeholder: "50" },
    { name: "perKmRate", label: "Rate per km", type: "number", group: "Fare", half: true, placeholder: "16" },
    { name: "waitingCharge", label: "Waiting Charge", type: "number", group: "Fare", half: true, placeholder: "30" },
    { name: "tax", label: "Tax (GST 5%)", type: "number", group: "Fare", half: true, placeholder: "18.40" },
    { name: "currency", label: "Currency", type: "currency", group: "Fare", half: true },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      group: "Fare",
      half: true,
      options: [
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" },
        { value: "Card", label: "Card" },
      ],
    },
    { name: "invoiceNo", label: "Invoice Number", type: "text", group: "Fare", half: true, placeholder: "CAB-2026-0042" },
  ],
  defaults: {
    companyName: "Sri Sai Cabs",
    driverName: "Ramesh Kumar",
    vehicleNo: "KA 01 AB 4521",
    pickup: "Kempegowda Intl Airport, Bengaluru",
    drop: "MG Road, Bengaluru",
    distanceKm: "18.5",
    durationMin: "42",
    date: "",
    time: "",
    baseFare: "50",
    perKmRate: "16",
    waitingCharge: "30",
    tax: "18.40",
    currency: "INR",
    paymentMethod: "Online",
    invoiceNo: "CAB-2026-0042",
  },
};
