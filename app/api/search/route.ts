import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
    })

    return NextResponse.json({
      suggestions: suggestions.map((s) => ({
        id: s.id,
        name: s.name,
        image: s.images[0],
        category: s.category.name,
      })),
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ suggestions: [] })
  }
} 