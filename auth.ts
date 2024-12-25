import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { User } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function auth() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(JWT_SECRET)
    )

    return {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        name: payload.name as string | null,
        role: payload.role as string,
        image: payload.image as string | null,
        walletBalance: payload.walletBalance as number
      }
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function generateToken(user: Omit<User, "password">) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image,
    walletBalance: user.walletBalance
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(new TextEncoder().encode(JWT_SECRET))
  return token
}