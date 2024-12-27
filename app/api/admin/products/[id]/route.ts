import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin"
import { updateProductField } from "@/app/actions/products"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await adminAuth()
    if (authError) return authError

    const body = await req.json()
    const result = await updateProductField(params.id, body)
    
    if (!result.success) {
      return new NextResponse(result.error, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 