"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getWishlist, removeFromWishlist } from "@/app/actions/wishlist"
import { toast } from "react-hot-toast"
import { Product } from "@prisma/client"
import Image from "next/image"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])

  const fetchWishlist = async () => {
    const response = await getWishlist()
    if (response.success) {
      setWishlistItems(response.data || [])
    } else {
      toast.error("Failed to fetch wishlist")
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    const response = await removeFromWishlist(productId)
    if (response.success) {
      fetchWishlist()
      toast.success("Removed from wishlist")
    } else {
      toast.error("Failed to remove from wishlist")
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className="text-neutral-500">
          {wishlistItems.length} items in your wishlist
        </p>
      </div>

      <div className="grid gap-4">
        {wishlistItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <Image
                src={item.images[0] || "/placeholder.png"}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-lg object-cover h-16"
                priority
              />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="font-bold">${item.price.toFixed(2)}</p>
                  {item.inStock === 0 && (
                    <p className="text-sm text-red-600">Out of stock</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2"
                    disabled={item.inStock === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
