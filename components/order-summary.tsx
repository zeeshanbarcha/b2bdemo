"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { useCurrency } from "@/contexts/currency-context"

interface OrderSummaryProps {
  items: any[]
  onCheckout?: () => void
  showCheckoutButton?: boolean
  isProcessing?: boolean
}

export function OrderSummary({ 
  items, 
  onCheckout, 
  showCheckoutButton = false, 
  isProcessing = false 
}: OrderSummaryProps) {
  const { currency, exchangeRates } = useCurrency()
  
  const subtotal = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)

  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal, currency, exchangeRates)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>{formatPrice(tax, currency, exchangeRates)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(total, currency, exchangeRates)}</span>
          </div>
        </div>
      </CardContent>
      {onCheckout && showCheckoutButton && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={onCheckout}
            disabled={items.length === 0 || isProcessing}
          >
            {isProcessing ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
} 