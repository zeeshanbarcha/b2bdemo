import { adminAuth } from "@/lib/admin"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const [
      orders,
      totalProducts,
      totalUsers,
      recentSales,
      weeklyData
    ] = await Promise.all([
      prisma.cart.findMany({
        select: {
          quantity: true,
          product: {
            select: {
              price: true
            }
          },
          status: true
        }
      }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.cart.findMany({
        where: {
          NOT: {
            status: 'PENDING'
          }
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          },
          product: {
            select: {
              name: true,
              price: true
            }
          }
        }
      }),
      prisma.cart.groupBy({
        by: ['createdAt'],
        where: {
          NOT: {
            status: 'PENDING'
          },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: {
          quantity: true
        }
      })
    ])

    const revenue = orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => sum + (order.quantity * order.product.price), 0)

    const totalOrders = orders.filter(order => order.status !== 'PENDING').length

    const overview = weeklyData.map(day => ({
      name: new Date(day.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
      total: day._sum.quantity || 0
    }))

    return NextResponse.json({
      totalRevenue: revenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentSales,
      overview
    })
  } catch (error) {
    console.error("[ADMIN_STATS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 