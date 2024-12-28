import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify ownership before deletion
    const bank = await prisma.bankAccount.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!bank) {
      return new NextResponse("Bank account not found", { status: 404 })
    }

    await prisma.bankAccount.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[USER_BANK_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 