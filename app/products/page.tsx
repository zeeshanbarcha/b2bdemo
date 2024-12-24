import { products } from "@/lib/dummy-data"
import { ProductCard } from "@/components/product-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-muted-foreground">Browse our collection of products</p>
      </div>

      {/* Filters and Sort */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food & Beverages</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="household">Household</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex gap-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}