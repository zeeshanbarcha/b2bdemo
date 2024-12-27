"use client"

import { useState, useEffect } from "react"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/admin/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async (id: string, data: any) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error()
      
      toast.success("Product updated successfully")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <ProductsTable 
        products={products} 
        onUpdate={handleUpdateProduct} 
      />
    </div>
  )
} 