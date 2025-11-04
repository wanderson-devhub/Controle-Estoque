import { type NextRequest, NextResponse } from "next/server"
import { clearSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  await clearSession()
  revalidatePath("/", "layout")
  return NextResponse.json({ success: true })
}
