import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"

const wishlistItems = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    inStock: true,
  },
  {
    id: "2",
    name: "Denim Jeans",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop",
    inStock: true,
  },
  {
    id: "3",
    name: "Leather Jacket",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
    inStock: false,
  },
]

export default function WishlistPage() {
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
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex flex-1 items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="font-bold">{item.price}</p>
                  {!item.inStock && (
                    <p className="text-sm text-red-600">Out of stock</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove from wishlist</span>
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2"
                    disabled={!item.inStock}
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
