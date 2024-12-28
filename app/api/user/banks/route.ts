import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const banks = await prisma.bankAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(banks)
  } catch (error) {
    console.error("[USER_BANKS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { bankName, accountName, accountNumber, routingNumber } = body

    const bank = await prisma.bankAccount.create({
      data: {
        userId: session.user.id,
        bankName,
        accountName,
        accountNumber,
        routingNumber
      }
    })

    return NextResponse.json(bank)
  } catch (error) {
    console.error("[USER_BANKS_CREATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 