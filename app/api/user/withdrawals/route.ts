import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { amount, bankAccountId } = await req.json()

    // Start a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Get current user balance
      const user = await tx.user.findUnique({
        where: { id: session.user.id },
        select: { walletBalance: true }
      })

      if (!user || user.walletBalance < amount) {
        throw new Error("Insufficient balance")
      }

      // Create withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: session.user.id,
          bankAccountId,
          amount,
          status: "PENDING"
        }
      })

      // Update user's wallet balance
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          walletBalance: {
            decrement: amount
          }
        }
      })

      return withdrawal
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[WITHDRAWAL_CREATE]", error)
    if (error.message === "Insufficient balance") {
      return new NextResponse("Insufficient balance", { status: 400 })
    }
    return new NextResponse("Internal error", { status: 500 })
  }
} 