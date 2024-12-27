import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            Order: true
          }
        },
        Order: {
          where: {
            status: 'DELIVERED'
          },
          select: {
            total: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const usersWithTotalSpent = users.map(user => ({
      ...user,
      totalSpent: user.Order.reduce((sum, order) => sum + (order.total || 0), 0),
      Order: undefined
    }))

    return NextResponse.json(usersWithTotalSpent)
  } catch (error) {
    console.error("[ADMIN_USERS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 