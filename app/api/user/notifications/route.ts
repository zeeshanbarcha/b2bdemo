import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("[USER_NOTIFICATIONS]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await req.json()

    await prisma.notification.update({
      where: { id },
      data: { read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[NOTIFICATION_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 