"use client"

import { createContext, useContext, useState, useEffect } from "react"

type Currency = "USD" | "SDG" | "INR"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  exchangeRates: Record<Currency, number>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  SDG: 601.05,
  INR: 85.79,
}

const STORAGE_KEY = 'app-currency'

function getInitialCurrency(): Currency {
  if (typeof window === 'undefined') return 'USD'
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Currency
    return stored && ['USD', 'SDG', 'INR'].includes(stored) ? stored : 'USD'
  } catch {
    return 'USD'
  }
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [currency, setCurrency] = useState<Currency>('USD')
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_EXCHANGE_RATES)

  // Handle initial hydration
  useEffect(() => {
    const initialCurrency = getInitialCurrency()
    setCurrency(initialCurrency)
    setMounted(true)
  }, [])

  // Persist currency selection to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, currency)
    }
  }, [currency, mounted])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <CurrencyContext.Provider value={{ currency: 'USD', setCurrency, exchangeRates }}>
        {children}
      </CurrencyContext.Provider>
    )
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider")
  return context
} 