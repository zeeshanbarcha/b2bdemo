"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface OrderItem {
  id: string
  quantity: number
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
  createdAt: string
}

export function OrdersContent() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const { currency, exchangeRates } = useCurrency()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error()
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusTranslation = (status: string) => {
    return t.dashboard.orderStatus[status.toLowerCase() as keyof typeof t.dashboard.orderStatus]
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || colors.PENDING
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.dashboard.orders}</h1>
        <p className="text-muted-foreground">
          {t.dashboard.orderHistory}
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-muted-foreground">
              {t.dashboard.noOrders}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {t.dashboard.orderDate}: {new Date(order.createdAt).toLocaleDateString(language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={order.product.images[0]}
                      alt={order.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-medium">{order.product.name}</p>
                      <p className="text-sm text-neutral-600">
                        {t.dashboard.quantity}: {order.quantity}
                      </p>
                      {order.status && (
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusTranslation(order.status)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(order.product.price * order.quantity, currency, exchangeRates)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}