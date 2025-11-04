import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, warName, rank, company, phone } = await request.json()

    // Validate input
    if (!email || !password || !warName || !rank || !company || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        warName,
        rank,
        company,
        phone,
      },
    })

    // Create session
    await createSession(user)

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, warName: user.warName } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
