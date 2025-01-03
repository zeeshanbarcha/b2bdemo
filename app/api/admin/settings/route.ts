import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { adminAuth } from "@/lib/admin"

export async function POST(req: Request) {
  try {
    const { withdrawalThreshold } = await req.json()
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const authError = await adminAuth()
    if (authError) return authError
    
    await prisma.systemSettings.upsert({
      where: { key: 'withdrawalThreshold' },
      update: { 
        value: withdrawalThreshold.toString(),
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      create: {
        key: 'withdrawalThreshold',
        value: withdrawalThreshold.toString(),
        createdBy: session.user.id,
        updatedBy: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ADMIN_SETTINGS]", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const authError = await adminAuth()
    if (authError) return authError
    
    const settings = await prisma.systemSettings.findFirst({
      where: { key: 'withdrawalThreshold' },
      include: {
        admin: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({
      withdrawalThreshold: settings ? parseFloat(settings.value) : 1500,
      lastUpdatedBy: settings?.admin
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
} 