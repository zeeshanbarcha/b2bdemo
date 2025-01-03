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
      select: { walletBalance: true }
    })

    return NextResponse.json({ balance: user?.walletBalance || 0 })
  } catch (error) {
    console.error("[USER_BALANCE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 