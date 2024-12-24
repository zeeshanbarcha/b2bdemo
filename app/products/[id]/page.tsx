"use client"

import { notFound } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, Star } from "lucide-react"
import { products } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import { ImageGallery } from "@/components/image-gallery"

export interface Product {
  id: string
  name: string
  price: number
  images: string[]
  discount?: number
  description: string
  specifications?: Record<string, string>
  reviews?: Array<{
    name: string
    rating: number
    comment: string
  }>
}

interface PageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const product = products.find((p) => p.id === params.id)
  const relatedProducts = products.slice(0, 4)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Main Section */}
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">
              ₹{product.price * (1 - (product.discount || 0))}
            </span>
            {product.discount && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">1</span>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button size="lg" className="w-full">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          {/* Specifications */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Specifications</h2>
            <div className="mt-4 rounded-lg border">
              <table className="w-full">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{key}</td>
                      <td className="px-4 py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>
        <div className="space-y-6">
          {product.reviews?.map((review, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{review.name}</span>
              </div>
              <p className="mt-2 text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}