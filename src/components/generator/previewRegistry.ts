import type { ComponentType } from "react";
import type { PreviewProps } from "@/types/generator";

import FuelBillPreview from "./previews/FuelBillPreview";
import RentReceiptPreview from "./previews/RentReceiptPreview";
import CabBillPreview from "./previews/CabBillPreview";
import UberBillPreview from "./previews/UberBillPreview";
import OlaBillPreview from "./previews/OlaBillPreview";
import FlightBillPreview from "./previews/FlightBillPreview";
import LtaReceiptPreview from "./previews/LtaReceiptPreview";
import InternetBillPreview from "./previews/InternetBillPreview";
import WifiBillPreview from "./previews/WifiBillPreview";
import MobileBillPreview from "./previews/MobileBillPreview";
import RechargeBillPreview from "./previews/RechargeBillPreview";
import GymBillPreview from "./previews/GymBillPreview";
import RestaurantBillPreview from "./previews/RestaurantBillPreview";
import HotelBillPreview from "./previews/HotelBillPreview";
import EcommerceInvoicePreview from "./previews/EcommerceInvoicePreview";
import GstInvoicePreview from "./previews/GstInvoicePreview";
import GeneralBillPreview from "./previews/GeneralBillPreview";
import StationeryBillPreview from "./previews/StationeryBillPreview";
import MartBillPreview from "./previews/MartBillPreview";
import MedicalBillPreview from "./previews/MedicalBillPreview";
import BookInvoicePreview from "./previews/BookInvoicePreview";
import DriverSalaryPreview from "./previews/DriverSalaryPreview";
import DailyHelperPreview from "./previews/DailyHelperPreview";
import SchoolReceiptPreview from "./previews/SchoolReceiptPreview";
import DonationReceiptPreview from "./previews/DonationReceiptPreview";

// Maps a generator slug to its live-preview renderer.
export const PREVIEWS: Record<string, ComponentType<PreviewProps>> = {
  "fuel-bill": FuelBillPreview,
  "rent-receipt": RentReceiptPreview,
  "cab-bill": CabBillPreview,
  "uber-bill": UberBillPreview,
  "ola-bill": OlaBillPreview,
  "flight-bill": FlightBillPreview,
  "lta-receipt": LtaReceiptPreview,
  "internet-bill": InternetBillPreview,
  "wifi-bill": WifiBillPreview,
  "mobile-bill": MobileBillPreview,
  "recharge-bill": RechargeBillPreview,
  "gym-bill": GymBillPreview,
  "restaurant-bill": RestaurantBillPreview,
  "hotel-bill": HotelBillPreview,
  "ecommerce-invoice": EcommerceInvoicePreview,
  "gst-invoice": GstInvoicePreview,
  "general-bill": GeneralBillPreview,
  "stationery-bill": StationeryBillPreview,
  "mart-bill": MartBillPreview,
  "medical-bill": MedicalBillPreview,
  "book-invoice": BookInvoicePreview,
  "driver-salary": DriverSalaryPreview,
  "daily-helper": DailyHelperPreview,
  "school-receipt": SchoolReceiptPreview,
  "donation-receipt": DonationReceiptPreview,
};

export function getPreview(slug: string): ComponentType<PreviewProps> | null {
  return PREVIEWS[slug] ?? null;
}
