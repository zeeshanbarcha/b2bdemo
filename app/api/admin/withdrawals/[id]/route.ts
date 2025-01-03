import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const { status, reason } = await req.json()
    
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: params.id },
      include: { user: true }
    })

    if (!withdrawal) {
      return new NextResponse("Withdrawal not found", { status: 404 })
    }

    if (status === "APPROVED") {
      await prisma.$transaction([
        prisma.withdrawal.update({
          where: { id: params.id },
          data: { status: "APPROVED" }
        }),
        prisma.user.update({
          where: { id: withdrawal.userId },
          data: {
            walletBalance: {
              decrement: withdrawal.amount
            }
          }
        }),
        prisma.notification.create({
          data: {
            userId: withdrawal.userId,
            title: "Withdrawal Approved",
            message: `Your withdrawal request for $${withdrawal.amount.toFixed(2)} has been approved.`,
            type: "WITHDRAWAL"
          }
        })
      ])
    } else if (status === "REJECTED") {
      await prisma.$transaction([
        prisma.withdrawal.update({
          where: { id: params.id },
          data: { status: "REJECTED", reason }
        }),
        prisma.notification.create({
          data: {
            userId: withdrawal.userId,
            title: "Withdrawal Rejected",
            message: `Your withdrawal request for $${withdrawal.amount.toFixed(2)} was rejected. Reason: ${reason}`,
            type: "WITHDRAWAL"
          }
        })
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[WITHDRAWAL_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 