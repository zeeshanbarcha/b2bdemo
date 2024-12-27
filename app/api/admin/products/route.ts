import { adminAuth } from "@/lib/admin"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("[ADMIN_PRODUCTS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const body = await req.json()
    const product = await prisma.product.create({
      data: body
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[ADMIN_PRODUCTS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 