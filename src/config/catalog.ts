import { GeneratorConfig } from "@/types/generator";
import { fuelBillConfig } from "./generators/fuel-bill";
import { rentReceiptConfig } from "./generators/rent-receipt";
import { cabBillConfig } from "./generators/cab-bill";
import { uberBillConfig } from "./generators/uber-bill";
import { olaBillConfig } from "./generators/ola-bill";
import { flightBillConfig } from "./generators/flight-bill";
import { ltaReceiptConfig } from "./generators/lta-receipt";
import { internetBillConfig } from "./generators/internet-bill";
import { wifiBillConfig } from "./generators/wifi-bill";
import { mobileBillConfig } from "./generators/mobile-bill";
import { rechargeBillConfig } from "./generators/recharge-bill";
import { gymBillConfig } from "./generators/gym-bill";
import { restaurantBillConfig } from "./generators/restaurant-bill";
import { hotelBillConfig } from "./generators/hotel-bill";
import { ecommerceInvoiceConfig } from "./generators/ecommerce-invoice";
import { gstInvoiceConfig } from "./generators/gst-invoice";
import { generalBillConfig } from "./generators/general-bill";
import { stationeryBillConfig } from "./generators/stationery-bill";
import { martBillConfig } from "./generators/mart-bill";
import { medicalBillConfig } from "./generators/medical-bill";
import { bookInvoiceConfig } from "./generators/book-invoice";
import { driverSalaryConfig } from "./generators/driver-salary";
import { dailyHelperConfig } from "./generators/daily-helper";
import { schoolReceiptConfig } from "./generators/school-receipt";
import { donationReceiptConfig } from "./generators/donation-receipt";

export interface CatalogItem {
  slug: string;
  name: string;
  icon: string; // Font Awesome solid class
  category: string;
  /** Fully implemented generator. */
  ready?: boolean;
  popular?: boolean;
  blurb?: string;
}

// All generators are now fully implemented (config + preview).
const RAW: CatalogItem[] = [
  // Transportation & Travel
  { slug: "fuel-bill", name: "Fuel Bill", icon: "fa-gas-pump", category: "Transportation & Travel", popular: true, blurb: "Petrol, diesel, CNG & EV receipts for every pump." },
  { slug: "cab-bill", name: "Cab / Taxi Bill", icon: "fa-taxi", category: "Transportation & Travel", popular: true, blurb: "Local taxi and cab trip receipts." },
  { slug: "uber-bill", name: "Uber Bill", icon: "fa-car-side", category: "Transportation & Travel", blurb: "Ride invoices in the Uber style." },
  { slug: "ola-bill", name: "Ola Bill", icon: "fa-car", category: "Transportation & Travel", blurb: "Ola ride receipts with fare breakup." },
  { slug: "flight-bill", name: "Flight Bill", icon: "fa-plane", category: "Transportation & Travel", blurb: "Air-ticket invoices & boarding receipts." },
  { slug: "lta-receipt", name: "LTA Receipt", icon: "fa-train", category: "Transportation & Travel", blurb: "Leave Travel Allowance claim receipts." },

  // Utilities & Services
  { slug: "internet-bill", name: "Internet Invoice", icon: "fa-wifi", category: "Utilities & Services", blurb: "Broadband & internet service invoices." },
  { slug: "wifi-bill", name: "Wi-Fi Bill", icon: "fa-network-wired", category: "Utilities & Services", blurb: "Wi-Fi plan receipts." },
  { slug: "mobile-bill", name: "Mobile Bill", icon: "fa-mobile-screen", category: "Utilities & Services", popular: true, blurb: "Postpaid mobile statements." },
  { slug: "recharge-bill", name: "Recharge Bill", icon: "fa-bolt", category: "Utilities & Services", blurb: "Prepaid recharge receipts." },
  { slug: "gym-bill", name: "Gym Bill", icon: "fa-dumbbell", category: "Utilities & Services", blurb: "Gym & fitness membership receipts." },

  // Commerce & Business
  { slug: "restaurant-bill", name: "Restaurant Bill", icon: "fa-utensils", category: "Commerce & Business", popular: true, blurb: "Itemized food bills with taxes." },
  { slug: "hotel-bill", name: "Hotel Bill", icon: "fa-hotel", category: "Commerce & Business", blurb: "Hotel-room stay invoices." },
  { slug: "ecommerce-invoice", name: "E-commerce Invoice", icon: "fa-cart-shopping", category: "Commerce & Business", blurb: "Online order tax invoices." },
  { slug: "gst-invoice", name: "GST Invoice", icon: "fa-file-invoice", category: "Commerce & Business", popular: true, blurb: "GST-compliant business invoices." },
  { slug: "general-bill", name: "General Bill", icon: "fa-receipt", category: "Commerce & Business", blurb: "Flexible all-purpose bill." },
  { slug: "stationery-bill", name: "Stationery Bill", icon: "fa-pen", category: "Commerce & Business", blurb: "Stationery & office-supply bills." },
  { slug: "mart-bill", name: "Mart Bill", icon: "fa-store", category: "Commerce & Business", blurb: "Supermarket & grocery receipts." },

  // Professional & Personal
  { slug: "medical-bill", name: "Medical Bill", icon: "fa-stethoscope", category: "Professional & Personal", blurb: "Pharmacy & clinic receipts." },
  { slug: "book-invoice", name: "Book Invoice", icon: "fa-book", category: "Professional & Personal", blurb: "Bookstore purchase invoices." },
  { slug: "rent-receipt", name: "Rent Receipt", icon: "fa-house", category: "Professional & Personal", popular: true, blurb: "HRA rent receipts for tax claims." },
  { slug: "driver-salary", name: "Driver Salary Receipt", icon: "fa-id-card", category: "Professional & Personal", blurb: "Monthly driver salary receipts." },
  { slug: "daily-helper", name: "Daily Helper Receipt", icon: "fa-broom", category: "Professional & Personal", blurb: "Household help payment receipts." },
  { slug: "school-receipt", name: "School Receipt", icon: "fa-graduation-cap", category: "Professional & Personal", blurb: "School & tuition fee receipts." },
  { slug: "donation-receipt", name: "Donation Receipt", icon: "fa-hand-holding-heart", category: "Professional & Personal", blurb: "80G-style donation receipts." },
];

// Registry of fully-implemented generators.
const CONFIGS: Record<string, GeneratorConfig> = {
  "fuel-bill": fuelBillConfig,
  "rent-receipt": rentReceiptConfig,
  "cab-bill": cabBillConfig,
  "uber-bill": uberBillConfig,
  "ola-bill": olaBillConfig,
  "flight-bill": flightBillConfig,
  "lta-receipt": ltaReceiptConfig,
  "internet-bill": internetBillConfig,
  "wifi-bill": wifiBillConfig,
  "mobile-bill": mobileBillConfig,
  "recharge-bill": rechargeBillConfig,
  "gym-bill": gymBillConfig,
  "restaurant-bill": restaurantBillConfig,
  "hotel-bill": hotelBillConfig,
  "ecommerce-invoice": ecommerceInvoiceConfig,
  "gst-invoice": gstInvoiceConfig,
  "general-bill": generalBillConfig,
  "stationery-bill": stationeryBillConfig,
  "mart-bill": martBillConfig,
  "medical-bill": medicalBillConfig,
  "book-invoice": bookInvoiceConfig,
  "driver-salary": driverSalaryConfig,
  "daily-helper": dailyHelperConfig,
  "school-receipt": schoolReceiptConfig,
  "donation-receipt": donationReceiptConfig,
};

// A generator is "ready" when it has a registered config.
export const CATALOG: CatalogItem[] = RAW.map((c) => ({ ...c, ready: Boolean(CONFIGS[c.slug]) }));

export const CATEGORIES = [
  "Transportation & Travel",
  "Utilities & Services",
  "Commerce & Business",
  "Professional & Personal",
];

export function getConfig(slug: string): GeneratorConfig | null {
  return CONFIGS[slug] ?? null;
}

export function catalogBySlug(slug: string): CatalogItem | undefined {
  return CATALOG.find((c) => c.slug === slug);
}

export const POPULAR = CATALOG.filter((c) => c.popular);
export const READY = CATALOG.filter((c) => c.ready);
