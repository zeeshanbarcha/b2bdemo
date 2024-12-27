"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Loader2 } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { getWishlist, removeFromWishlist } from "@/app/actions/wishlist"
import { addToCart, checkCartItem } from "@/app/actions/cart"
import { toast } from "react-hot-toast"
import { Product } from "@prisma/client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function WishlistPage() {
  return (
    <Suspense fallback={<WishlistSkeleton />}>
      <WishlistContent />
    </Suspense>
  )
}

function WishlistSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded mt-2 animate-pulse" />
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WishlistContent() {
  const router = useRouter()
  const { refreshCounts } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})
  const [inCartItems, setInCartItems] = useState<Record<string, boolean>>({})

  const checkCartStatus = async (productId: string) => {
    const cartItem = await checkCartItem(productId)
    setInCartItems(prev => ({ ...prev, [productId]: !!cartItem }))
  }

  const fetchWishlist = async () => {
    const response = await getWishlist()
    if (response.success) {
      setWishlistItems(response.data || [])
      // Check cart status for each item
      response.data?.forEach(item => checkCartStatus(item.id))
    } else {
      toast.error("Failed to fetch wishlist")
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    const response = await removeFromWishlist(productId)
    if (response.success) {
      setWishlistItems(prev => prev.filter(item => item.id !== productId))
      toast.success("Removed from wishlist")
      refreshCounts()
    } else {
      toast.error("Failed to remove from wishlist")
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(prev => ({ ...prev, [product.id]: true }))
      const result = await addToCart(product.id, 1)
      
      if (result.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== product.id))
        await removeFromWishlist(product.id)
        toast.success("Added to cart successfully")
        await refreshCounts()
        wishlistItems.forEach(item => checkCartStatus(item.id))
        router.push('/dashboard/orders')
      } else {
        if (result.existingItem) {
          toast.error("Item already in cart")
        } else {
          toast.error(result.error || "Failed to add to cart")
        }
      }
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }))
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
                    disabled={addingToCart[item.id] || item.inStock === 0 || inCartItems[item.id]}
                    onClick={() => handleAddToCart(item)}
                  >
                    {addingToCart[item.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                    {addingToCart[item.id] 
                      ? "Adding..." 
                      : inCartItems[item.id] 
                        ? "In Cart" 
                        : "Add to Cart"}
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
