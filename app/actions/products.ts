"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

export async function createProduct(data: {
  name: string
  description: string
  price: number
  categoryId: string
  inStock: number
  discount?: number
}) {
  try {
    const product = await prisma.product.create({
      data,
      include: {
        category: true,
      },
    })
    return { success: true, data: product }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Failed to create product" }
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string
    description?: string
    price?: number
    categoryId?: string
    inStock?: number
    discount?: number
  }
) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    })
    revalidatePath("/products")
    revalidatePath(`/products/${id}`)
    return { success: true, data: product }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Failed to update product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    })
    revalidatePath("/products")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}

export async function getProducts(options: {
  page?: number
  limit?: number
  search?: string
  category?: string
}) {
  try {
    const { page = 1, limit = 10, search = "", category = "" } = options
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
          { description: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
        ],
      }),
      ...(category && { categoryId: category }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ])

    return {
      success: true,
      data: {
        products,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { success: false, error: "Failed to fetch products" }
  }
} 