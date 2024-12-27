import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const cartItems = await prisma.cart.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        quantity: true,
        status: true,
        createdAt: true,
        product: {
          select: {
            name: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error fetching cart items:', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 