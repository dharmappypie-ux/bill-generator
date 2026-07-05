// 27 currencies, matching the breadth offered on billgenerator.org (INR … TRY).
export type Currency = { code: string; symbol: string; name: string };

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "रू", name: "Nepalese Rupee" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
];

export const CURRENCY_MAP: Record<string, Currency> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c])
);

export function symbolFor(code: string): string {
  return CURRENCY_MAP[code]?.symbol ?? code;
}

export function formatMoney(amount: number | string, code: string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  const safe = Number.isFinite(n) ? n : 0;
  return `${symbolFor(code)}${safe.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
