"use client"

import { useEffect, useState, Suspense } from "react"
import { ProductCard } from "@/components/product-card"
import { CategoriesSection } from "@/components/categories-section"
import Link from "next/link"
import { FlashSaleTimer } from "@/components/flash-sale-timer"

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

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const [featuredResponse, newResponse] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_API_URL + "/products?limit=5&featured=true"),
        fetch(process.env.NEXT_PUBLIC_API_URL + "/products?limit=10&sort=newest")
      ])

      const [featuredData, newData] = await Promise.all([
        featuredResponse.json(),
        newResponse.json()
      ])

      if (!featuredResponse.ok || !newResponse.ok) {
        throw new Error("Failed to fetch products")
      }

      setFeaturedProducts(featuredData.products)
      setNewProducts(newData.products)
    } catch (error) {
      console.error("Error fetching products:", error)
      setFeaturedProducts([])
      setNewProducts([])
    } finally {
      setLoading(false)
    }
  }

  const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="aspect-square rounded-lg bg-muted" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    </div>
  )

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070"
            alt="Shopping background with bags"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 dark:from-primary/80 dark:to-background/95" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-[650px]">
            <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
              Shop, Save, Earn
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/90 md:text-xl">
              Unlock Rewards with 7-Eleven India Online
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="inline-flex items-center rounded-md bg-background/10 px-6 py-3 text-sm font-medium text-primary-foreground backdrop-blur hover:bg-background/20"
              >
                Shop Now
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-background/90"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-foreground">Shop by Category</h2>
          <CategoriesSection />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
            <Link 
              href="/products?featured=true" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading
              ? Array(5).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">Flash Sale ⚡</h2>
              <FlashSaleTimer />
            </div>
            <Link 
              href="/products?flashSale=true" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading
              ? Array(5).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold text-foreground">New Arrivals</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading
              ? Array(10).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : newProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>
    </div>
  )
}
