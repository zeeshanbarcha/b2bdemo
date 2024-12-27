'use client'  
  
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import { addToWishlist, getWishlist, removeFromWishlist } from "@/app/actions/wishlist"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    images: string[]
    price: number
    discount?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { user, refreshCounts } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount)
    : product.price

  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        const response = await getWishlist()
        if (response.success && response.data) {
          setIsInWishlist(response.data.some((item) => item.id === product.id))
        }
      }
    }
    checkWishlist()
  }, [user, product.id])

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Please sign in to add items to your wishlist")
      return
    }
    
    try {
      if (isInWishlist) {
        const result = await removeFromWishlist(product.id)
        if (result.success) {
          setIsInWishlist(false)
          toast.success("Removed from wishlist")
          refreshCounts()
        } else {
          toast.error(result.error || "Failed to remove from wishlist")
        }
      } else {
        const result = await addToWishlist(product.id)
        if (result.success) {
          setIsInWishlist(true)
          toast.success("Added to wishlist")
          refreshCounts()
        } else {
          toast.error(result.error || "Failed to add to wishlist")
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <Card className="group relative h-full">
      <Link href={`/products/${product.id}`}>
        <div className="flex h-full flex-col">
          <CardContent className="flex-none p-0">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              {product.discount && (
                <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{product.discount * 100}%
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-2 top-2 z-20 ${isInWishlist ? 'text-red-500 hover:text-red-600' : ''}`}
                onClick={handleWishlist}
              >
                <Heart className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-1 flex-col items-start gap-2 p-4">
            <h3 className="line-clamp-2 min-h-[40px] text-sm font-medium">
              {product.name}
            </h3>
            <div className="mt-auto flex items-center gap-2">
              <span className="font-bold">₹{discountedPrice.toFixed(2)}</span>
              {product.discount && (
                <span className="text-sm text-neutral-500 line-through dark:text-neutral-400">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </CardFooter>
        </div>
      </Link>
    </Card>
  )
}

