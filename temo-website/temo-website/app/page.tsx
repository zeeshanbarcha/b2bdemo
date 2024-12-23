import { ProductCard } from "@/components/product-card"
import { CategoriesSection } from "@/components/categories-section"
import { products } from "@/lib/dummy-data"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#46783E] py-20 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">Shop, Save, Earn</h1>
          <p className="mt-4 text-lg md:text-xl">Unlock Rewards with 7-Eleven India Online</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">Shop by Category</h2>
          <CategoriesSection />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Flash Sale ⚡</h2>
            <div className="flex items-center gap-4">
              <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
                <div className="flex flex-col p-2 bg-neutral-100 rounded-lg">
                  <span className="countdown font-mono text-2xl">7</span>
                  <span className="text-xs">hrs</span>
                </div>
                <div className="flex flex-col p-2 bg-neutral-100 rounded-lg">
                  <span className="countdown font-mono text-2xl">22</span>
                  <span className="text-xs">min</span>
                </div>
                <div className="flex flex-col p-2 bg-neutral-100 rounded-lg">
                  <span className="countdown font-mono text-2xl">42</span>
                  <span className="text-xs">sec</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
