"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Switch } from "../ui/switch"
import { useRouter } from "next/navigation"

interface ProductsTableProps {
  products: {
    id: string
    name: string
    price: number
    images: string[]
    inStock: number
    featured: boolean
    flashSale: boolean
    discount: number | null
  }[]
  onUpdate: (id: string, data: Partial<ProductsTableProps['products'][0]>) => Promise<void>
}

export function ProductsTable({ products, onUpdate }: ProductsTableProps) {
  const router = useRouter()
  const [updating, setUpdating] = useState<Record<string, boolean>>({})

  const handleUpdate = async (id: string, data: Partial<ProductsTableProps['products'][0]>) => {
    try {
      setUpdating(prev => ({ ...prev, [id]: true }))
      await onUpdate(id, data)
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }))
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Flash Sale</TableHead>
          <TableHead>Discount %</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{product.name}</span>
              </div>
            </TableCell>
            <TableCell>{formatPrice(product.price)}</TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.inStock}
                onChange={(e) => handleUpdate(product.id, { inStock: parseInt(e.target.value) })}
                className="w-20"
                disabled={updating[product.id]}
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={product.featured}
                onCheckedChange={(checked) => handleUpdate(product.id, { featured: checked })}
                disabled={updating[product.id]}
                className="data-[state=checked]:bg-primary"
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={product.flashSale}
                onCheckedChange={(checked) => handleUpdate(product.id, { flashSale: checked })}
                disabled={updating[product.id]}
                className="data-[state=checked]:bg-primary"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.discount || ''}
                onChange={(e) => handleUpdate(product.id, { 
                  discount: e.target.value ? parseInt(e.target.value) : null 
                })}
                className="w-20"
                placeholder="0"
                disabled={updating[product.id]}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/products/new?id=${product.id}`)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit product</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 