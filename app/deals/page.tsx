"use client"

import { useEffect, useState, Suspense } from "react"
import { ProductCard } from "@/components/product-card"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  discount?: number
  category: {
    id: string
    name: string
  }
}

export default function DealsPage() {
  return (
    <Suspense fallback={<DealsSkeleton />}>
      <DealsContent />
    </Suspense>
  )
}

function DealsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="aspect-square w-full bg-gray-200 rounded animate-pulse" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DealsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=10&featured=true`)
        if (!response.ok) throw new Error('Failed to fetch deals')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching deals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Featured Deals</h1>
        <p className="text-neutral-500">
          {products.length} products available
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No deals available at the moment
          </div>
        )}
      </div>
    </div>
  )
} 