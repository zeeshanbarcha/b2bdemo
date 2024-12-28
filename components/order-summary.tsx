import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface OrderSummaryProps {
  items: {
    id: string
    product: {
      name: string
      price: number
      images: string[]
    }
    quantity: number
    createdAt: Date
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  }[]
  onCheckout?: () => void
  showCheckoutButton?: boolean
  isProcessing?: boolean
}

export function OrderSummary({ items, onCheckout, showCheckoutButton, isProcessing }: OrderSummaryProps) {
  const router = useRouter()
  const shippingFee = 0
  const taxRate = 0
  const tax = items?.length > 0 ? items.reduce((total, item) => total + item.product.price * item.quantity, 0) * taxRate : 0
  const total = items?.length > 0 ? items.reduce((total, item) => total + item.product.price * item.quantity, 0) + shippingFee + tax : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Items ({items?.length})</span>
          <span>{formatPrice(items?.reduce((total, item) => total + item.product.price * item.quantity, 0))}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping Fee</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (0%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <Button 
          className="w-full" 
          onClick={onCheckout}
          disabled={!items?.length || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Order"
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 