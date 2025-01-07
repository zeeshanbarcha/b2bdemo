"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function addToWishlist(productId: string) {
  try {
    const session = await auth()
    console.log(session)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }
    await prisma.user.update({
      where: { id: String(session.user.id) },
      data: {
        wishlist: {
          connect: { id: productId }
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return { success: false, error: "Failed to add to wishlist" }
  }
}

export async function removeFromWishlist(productId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    await prisma.user.update({
      where: { id: String(session.user.id) },
      data: {
        wishlist: {
          disconnect: { id: productId }
        }
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return { success: false, error: "Failed to remove from wishlist" }
  }
}

export async function getWishlist() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.findUnique({
      where: { id: String(session.user.id) },
      include: {
        wishlist: {
          include: {
            category: true
          }
        }
      }
    })

    return { success: true, data: user?.wishlist || [] }
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return { success: false, error: "Failed to fetch wishlist" }
  }
}

export async function checkWishlistItem(productId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: String(session.user.id) },
      include: {
        wishlist: {
          where: { id: productId },
          select: { id: true }
        }
      }
    })

    return user?.wishlist[0] || null
  } catch (error) {
    console.error("Error checking wishlist item:", error)
    return null
  }
} 