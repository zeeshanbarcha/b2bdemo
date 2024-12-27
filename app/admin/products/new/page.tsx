"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { createProductSchema } from "@/app/validations/products"
import { ImageUpload } from "@/components/image-upload"
import { Loader2 } from "lucide-react"

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "home", name: "Home & Kitchen" },
  { id: "fashion", name: "Fashion" },
  { id: "computers", name: "Computers" },
  { id: "automotive", name: "Car & Motorbike" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "sports", name: "Sports, Fitness & Outdoors" },
]

export default function ProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const isEditing = Boolean(productId)

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEditing)
  const [images, setImages] = useState<string[]>([])
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/products/${productId}`)
      const data = await response.json()

      if (!response.ok) throw new Error()

      setProduct(data)
      setImages(data.images)
    } catch (error) {
      toast.error("Failed to fetch product")
      router.push('/admin/products')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      categoryId: formData.get('categoryId') as string,
      inStock: parseInt(formData.get('inStock') as string),
      images,
      featured: formData.get('featured') === 'on',
      flashSale: formData.get('flashSale') === 'on',
      discount: formData.get('discount') ? parseFloat(formData.get('discount') as string) : null,
    }

    try {
      setLoading(true)
      const validatedData = await createProductSchema.validate(data)

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/admin/products${isEditing ? `/${productId}` : ''}`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      })

      if (!response.ok) throw new Error()

      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`)
      router.push('/admin/products')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} product`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{isEditing ? 'Edit' : 'New'} Product</h2>
        <p className="text-muted-foreground">
          {isEditing ? 'Edit your product details' : 'Add a new product to your store'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label>Product Images (Max 5)</Label>
          <ImageUpload
            value={images}
            onChange={(urls) => setImages(urls)}
            maxImages={5}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={product?.price}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              name="categoryId"
              defaultValue={product?.category?.id || ""}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inStock">Stock</Label>
            <Input
              id="inStock"
              name="inStock"
              type="number"
              defaultValue={product?.inStock}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              defaultValue={product?.discount}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product?.description}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              name="featured"
              defaultChecked={product?.featured || false}
              onCheckedChange={(checked) => {
                const input = document.createElement('input')
                input.type = 'hidden'
                input.name = 'featured'
                input.value = checked ? 'on' : 'off'
                document.querySelector('form')?.appendChild(input)
              }}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="flashSale"
              name="flashSale"
              defaultChecked={product?.flashSale || false}
              onCheckedChange={(checked) => {
                const input = document.createElement('input')
                input.type = 'hidden'
                input.name = 'flashSale'
                input.value = checked ? 'on' : 'off'
                document.querySelector('form')?.appendChild(input)
              }}
            />
            <Label htmlFor="flashSale">Flash Sale</Label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 