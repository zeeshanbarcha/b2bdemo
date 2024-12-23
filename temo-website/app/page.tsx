import { MainNav } from "@/components/main-nav"
import { ProductCard } from "@/components/product-card"
import CategoriesSection from "@/components/categories-section"
import { products } from "@/config/products"

export default function Home() {
  return (
    <>
      <MainNav />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600" />
          <div className="relative container py-24 text-white">
            <h1 className="text-4xl font-bold mb-6">Shop, Save, Earn</h1>
            <p className="text-xl mb-8">Unlock Rewards with 7-Eleven India Online</p>
          </div>
        </section>
        
        <CategoriesSection />
        
        <section className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Flash Sale ⚡</h2>
            <div className="flex items-center gap-4">
              <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
                <div className="flex flex-col p-2 bg-neutral-100 rounded-lg">
                  <span className="countdown font-mono text-2xl">
                    <span>7</span>
                  </span>
                  hrs
                </div>
                <div className="flex flex-col p-2 bg-neutral-100 rounded-lg">
                  <span className="countdown font-mono text-2xl">
                    <span>22</span>
                  </span>
                  min
                </div>
                <div className="flex flex-col p-2 bg-neutral-100 rounded-lg">
                  <span className="countdown font-mono text-2xl">
                    <span>42</span>
                  </span>
                  sec
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

