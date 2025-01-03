import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const lastWithdrawal = await prisma.withdrawal.findFirst({
      where: {
        userId: session.user.id
      },
      select: {
        amount: true,
        status: true,
        createdAt: true,
        reason: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(lastWithdrawal)
  } catch (error) {
    console.error("[LAST_WITHDRAWAL]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 