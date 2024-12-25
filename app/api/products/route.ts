import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || ""
    const sort = searchParams.get("sort") || "newest"
    const featured = searchParams.get("featured") === "true"
    const flashSale = searchParams.get("flashSale") === "true"

    const skip = (page - 1) * limit

    const where = {
      ...(category && { categoryId: category }),
      ...(featured && { featured: true }),
      ...(flashSale && { flashSale: true }),
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      ...(sort === "newest" && { createdAt: "desc" }),
      ...(sort === "price-low" && { price: "asc" }),
      ...(sort === "price-high" && { price: "desc" }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const product = await prisma.product.create({
      data: json,
      include: {
        category: true,
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    )
  }
} 