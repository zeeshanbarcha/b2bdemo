'use client'  
  
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

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
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount)
    : product.price

  return (
    <Card className="group relative overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="group relative">
          <Card className="group relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              {product.discount && (
                <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{product.discount * 100}%
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-20"
                onClick={(e) => {
                  e.preventDefault()
                  // Add to wishlist logic here
                }}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold">₹{discountedPrice.toFixed(2)}</span>
                {product.discount && (
                  <span className="text-sm text-neutral-500 line-through dark:text-neutral-400">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </Link>
    </Card>
  )
}

