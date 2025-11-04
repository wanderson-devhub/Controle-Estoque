import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const SESSION_COOKIE = "inventory_session"

export default async function LogoutPage() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })

  redirect("/login")
}