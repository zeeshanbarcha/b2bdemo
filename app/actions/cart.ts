"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function checkCartItem(productId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return null

    const cartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    })

    return cartItem
  } catch (error) {
    console.error("Error checking cart item:", error)
    return null
  }
}

export async function addToCart(productId: string, quantity: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const existingItem = await checkCartItem(productId)
    if (existingItem) {
      return { 
        success: false, 
        error: "Already in cart",
        existingItem: true
      }
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return { success: false, error: "Product not found" }
    }

    await prisma.cart.create({
      data: {
        userId: session.user.id,
        productId: productId,
        quantity: quantity,
        price: product.price,
        status: 'PENDING'
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, error: "Failed to add to cart" }
  }
}

export async function updateCartQuantity(productId: string, quantity: number) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    await prisma.cart.update({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
      data: {
        quantity: quantity,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error updating cart quantity:", error)
    return { success: false, error: "Failed to update quantity" }
  }
}

export async function getCartCount() {
  try {
    const session = await auth()
    if (!session?.user?.id) return 0

    const count = await prisma.cart.count({
      where: { userId: session.user.id, status: 'PENDING' },
    })

    return count
  } catch (error) {
    console.error("Error getting cart count:", error)
    return 0
  }
}

export async function getWishlistCount() {
  try {
    const session = await auth()
    if (!session?.user?.id) return 0

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { wishlist: true },
    })

    return user?.wishlist.length || 0
  } catch (error) {
    console.error("Error getting wishlist count:", error)
    return 0
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const cartItem = await prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    if (!cartItem) {
      return { success: false, error: "Cart item not found or not pending" }
    }

    await prisma.cart.delete({
      where: { id: cartItemId }
    })

    return { success: true }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return { success: false, error: "Failed to remove from cart" }
  }
}

export async function processOrder(
  cartItems: string[], 
  paymentDetails: {
    method: string
    transactionId: string
    receiptUrl: string
  },
  deliveryDetails: {
    type: 'home' | 'pickup'
    address?: {
      street: string
      city: string
      state: string
      pincode: string
      phone: string
    }
  },
  additionalInfo?: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    // Update all cart items to PROCESSING status
    await prisma.cart.updateMany({
      where: {
        id: { in: cartItems },
        userId: session.user.id,
        status: 'PENDING'
      },
      data: {
        status: 'PROCESSING',
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.transactionId,
        paymentReceipt: paymentDetails.receiptUrl,
        deliveryType: deliveryDetails.type,
        shippingAddress: deliveryDetails.type === 'home' ? 
          JSON.stringify(deliveryDetails.address) : 
          null,
        additionalInfo: additionalInfo
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Error processing order:", error)
    return { success: false, error: "Failed to process order" }
  }
}