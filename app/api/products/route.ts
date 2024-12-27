import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") || "newest"
    const query = searchParams.get("q")
    const featured = searchParams.get("featured") === "true"
    const flashSale = searchParams.get("flashSale") === "true"
    const limit = parseInt(searchParams.get("limit") || "12")

    const where = {
      ...(category && category !== "all" ? { categoryId: category } : {}),
      ...(featured ? { featured: true } : {}),
      ...(flashSale ? { flashSale: true } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" as const } },
              { description: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          ...(sort === "newest"
            ? { createdAt: "desc" }
            : sort === "price-asc"
            ? { price: "asc" }
            : sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" }),
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
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