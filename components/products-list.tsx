"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
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

function ProductsListContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [sort, setSort] = useState("newest")
  const query = searchParams.get("q") || ""

  useEffect(() => {
    fetchProducts()
  }, [page, category, sort, query])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        ...(category !== "all" && { category }),
        sort,
        ...(query && { q: query }),
      })
      
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/products?${params}`)
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      // Scroll to top when changing pages
      window.scrollTo(0, 0)
    }
  }

  if (loading) {
    return <ProductsSkeleton />
  }

  if (products.length === 0) {
    return <NotFound message="No products found" />
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export function ProductsList() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsListContent />
    </Suspense>
  )
} 