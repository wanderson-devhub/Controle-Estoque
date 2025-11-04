import { cookies } from "next/headers"
import type { User } from "@prisma/client"

const SESSION_COOKIE = "inventory_session"

export interface SessionUser {
  id: string
  email: string
  warName: string
  isAdmin: boolean
}

export async function createSession(user: User) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    warName: user.warName,
    isAdmin: user.isAdmin,
  })

  cookieStore.set(SESSION_COOKIE, Buffer.from(sessionData).toString("base64"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  if (!session?.value) return null

  try {
    const data = JSON.parse(Buffer.from(session.value, "base64").toString())
    return data as SessionUser
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })
}
