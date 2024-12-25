'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function handleLogout() {
  const cookieStore = cookies()
  
  // Delete all auth-related cookies
  cookieStore.delete("token")
  cookieStore.delete("user")
  
  revalidatePath("/")
  return { success: true }
}