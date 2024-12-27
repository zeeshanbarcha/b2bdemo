"use client"

import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

interface CartItem {
  id: string
  product: {
    name: string
    price: number
    images: string[]
  }
  quantity: number
  createdAt: Date
}

export function RecentOrders() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/cart', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart items')
      }
      
      const data = await response.json()
      // Sort by date and take only the latest 2 items
      const sortedItems = data.sort((a: CartItem, b: CartItem) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 2)
      
      setCartItems(sortedItems)
    } catch (error) {
      console.error('Error fetching cart items:', error)
      setError('Failed to load cart items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-lg border p-4"
        >
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 justify-between">
            <div className="space-y-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-neutral-600">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      ))}

      {cartItems.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          No items in cart
        </div>
      )}
    </div>
  )
}
