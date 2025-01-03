"use client"

import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus, Star, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { ImageGallery } from "@/components/image-gallery"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { addToCart, checkCartItem, updateCartQuantity } from "@/app/actions/cart"
import { useCurrency } from "@/contexts/currency-context"
import { formatPrice } from "@/lib/utils"

interface Product {
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
  category: {
    id: string
    name: string
  }
}

interface PageProps {
  params: {
    id: string
  }
}

function ProductSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square rounded-lg bg-neutral-100" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}

export default function ProductPage({ params }: PageProps) {
  const router = useRouter()
  const { user, refreshCounts } = useAuth()
  const { currency, exchangeRates } = useCurrency()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [addingToCart, setAddingToCart] = useState(false)
  const [isInCart, setIsInCart] = useState(false)

  const displayPrice = (price: number) => formatPrice(price, currency, exchangeRates)

  useEffect(() => {
    fetchProduct()
    if (user) {
      checkIfInCart()
    }
  }, [params.id, user])

  const checkIfInCart = async () => {
    const existingItem = await checkCartItem(params.id)
    setIsInCart(!!existingItem)
  }

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/products/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setProduct(data)
      fetchRelatedProducts(data.category.id)
    } catch (error) {
      console.error("Error fetching product:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (categoryId: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/products?category=${categoryId}&limit=4`)
      const data = await response.json()
      setRelatedProducts(data.products.filter((p: Product) => p.id !== params.id))
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }

    if (!product) return

    try {
      setAddingToCart(true)
      const result = await addToCart(product.id, quantity)
      if (result.success) {
        toast.success("Added to cart successfully")
        refreshCounts()
        router.push('/dashboard/orders')
      } else {
        if (result.existingItem) {
          setIsInCart(true)
        }
        toast.error(result.error || "Failed to add to cart")
      }
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductSkeleton />
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  const discountedPrice = product.price * (1 - (product.discount || 0))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">
              {displayPrice(discountedPrice)}
            </span>
            {product.discount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {displayPrice(product.price)}
                </span>
                <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                  {product.discount * 100}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={addingToCart || isInCart}
          >
            {addingToCart ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-5 w-5" />
            )}
            {addingToCart ? "Adding to Cart..." : isInCart ? "Already in Cart" : "Add to Cart"}
          </Button>

          {product.specifications && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="mt-4 rounded-lg border">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-0">
                        <td className="px-4 py-2 font-medium">{key}</td>
                        <td className="px-4 py-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {product.reviews && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-current" : ""
                        }`}
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
      )}
    </div>
  )
}