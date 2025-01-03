import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        bankAccount: {
          select: {
            bankName: true,
            accountNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(withdrawals)
  } catch (error) {
    console.error("[ADMIN_WITHDRAWALS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 