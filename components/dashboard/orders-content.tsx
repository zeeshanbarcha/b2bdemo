"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ArrowUpDown, Loader2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"
import { removeFromCart } from "@/app/actions/cart"
import { OrderSummary } from "@/components/order-summary"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  product: {
    name: string
    price: number
    images: string[]
  }
  quantity: number
  createdAt: Date
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
}

export function OrdersContent() {
  const router = useRouter()
  const { refreshCounts } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [removing, setRemoving] = useState<Record<string, boolean>>({})

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cart')
      if (!response.ok) throw new Error('Failed to fetch cart items')
      const data = await response.json()
      setCartItems(data)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  const sortedItems = [...cartItems].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
  })

  const handleRemove = async (itemId: string) => {
    try {
      setRemoving(prev => ({ ...prev, [itemId]: true }))
      const result = await removeFromCart(itemId)
      
      if (result.success) {
        setCartItems(prev => prev.filter(item => item.id !== itemId))
        toast.success("Item removed from cart")
        refreshCounts()
      } else {
        toast.error(result.error || "Failed to remove item")
      }
    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setRemoving(prev => ({ ...prev, [itemId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-neutral-500">Manage your orders and track deliveries</p>
        </div>
        <Button variant="outline" onClick={toggleSort} className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort by {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="grid gap-4">
            {sortedItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    Order #{item.id.slice(0, 8)}
                  </CardTitle>
                  <span className="text-sm text-neutral-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-neutral-600">
                          Quantity: {item.quantity}
                        </p>
                        {item.status && (
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            {
                              'PENDING': 'bg-yellow-100 text-yellow-800',
                              'PROCESSING': 'bg-blue-100 text-blue-800',
                              'SHIPPED': 'bg-purple-100 text-purple-800',
                              'DELIVERED': 'bg-green-100 text-green-800',
                              'CANCELLED': 'bg-red-100 text-red-800'
                            }[item.status]
                          }`}>
                            {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={removing[item.id]}
                            onClick={() => handleRemove(item.id)}
                          >
                            {removing[item.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                            <span className="sr-only">Remove from cart</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {cartItems.length === 0 && (
              <div className="text-center py-8 text-neutral-500">
                No orders found
              </div>
            )}
          </div>
        </div>

        <div>
          <OrderSummary onCheckout={() => router.push('/dashboard/checkout')} items={sortedItems.filter(item => item.status === 'PENDING')} />
        </div>
      </div>
    </div>
  )
}