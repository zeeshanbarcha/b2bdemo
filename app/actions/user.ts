'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from "@/auth"

export async function handleLogout() {
  const cookieStore = cookies()
  
  // Delete all auth-related cookies
  cookieStore.delete("token")
  cookieStore.delete("user")
  
  revalidatePath("/")
  return { success: true }
}

export async function updateUser(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
  country?: string | null
  image?: string | null
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        image: data.image,
      }
    })
    return { success: true, data: user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
} 