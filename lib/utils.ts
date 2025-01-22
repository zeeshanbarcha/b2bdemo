import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Currency = "USD" | "SDG" | "INR" | "AED" | "PYG"

const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  SDG: 601.05,
  INR: 85.79,
  AED: 3.67,
  PYG: 7888.78,
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  SDG: "SDG",
  INR: "₹",
  AED: "AED",
  PYG: "PYG",
}

export function formatPrice(
  price: number, 
  currency: Currency = "USD",
  exchangeRates: Record<Currency, number> = DEFAULT_EXCHANGE_RATES
) {
  // Convert price from INR to target currency
  const rates = exchangeRates || DEFAULT_EXCHANGE_RATES
  const convertedPrice = price * (rates[currency] / rates.USD)

  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
  }).format(convertedPrice)
}
