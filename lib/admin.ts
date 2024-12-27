import { auth } from "@/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function isAdmin() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return false
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    return user?.role === "ADMIN"
  } catch {
    return false
  }
}

export async function adminAuth() {
  if (!(await isAdmin())) {
    return new NextResponse("Forbidden", { status: 403 })
  }
  return null
} 