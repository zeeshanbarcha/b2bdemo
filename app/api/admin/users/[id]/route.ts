import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin"
import prisma from "@/lib/prisma"
import bcrypt, { hash } from "bcrypt"
  
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const body = await req.json()
    const updateData: any = {}

    // Only include fields that are provided
    if (body.email) updateData.email = body.email
    if (body.walletBalance) updateData.walletBalance = parseFloat(body.walletBalance)
    if (body.role) updateData.role = body.role
    if (body.password && body.password.trim() !== '') {
      updateData.password = await hash(body.password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        walletBalance: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[ADMIN_USER_UPDATE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 