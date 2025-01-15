"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"

const CURRENCIES = [
  { id: "USD", label: "USD ($)" },
  { id: "SDG", label: "SDG (SDG)" },
  { id: "AED", label: "AED (AED)" },
  { id: "INR", label: "INR (₹)" },
  { id: "PYG", label: "PYG (PYG)" }
] as const

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {currency}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CURRENCIES.map((curr) => (
          <DropdownMenuItem 
            key={curr.id}
            onClick={() => setCurrency(curr.id)}
            className="flex items-center justify-between"
          >
            {curr.label}
            {currency === curr.id && <span className="ml-2 text-xs text-muted-foreground">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 