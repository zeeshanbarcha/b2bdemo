"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { NotFound } from "@/components/ui/not-found"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  discount?: number
  category: { id: string; name: string }
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-neutral-200" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="h-4 w-1/2 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductsList() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [sort, setSort] = useState("newest")

  useEffect(() => {
    fetchProducts()
  }, [page, category, sort])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        ...(category !== "all" && { category }),
        sort,
      })
      
      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error)
      
      setProducts(data.products)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ProductsSkeleton />
  }

  if (products.length === 0) {
    return <NotFound message="No products found" />
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
} 