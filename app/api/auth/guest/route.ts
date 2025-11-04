import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    if (!type || !["client", "admin"].includes(type)) {
      return NextResponse.json({ error: "Type must be 'client' or 'admin'" }, { status: 400 })
    }

    // Find or create guest user
    const guestEmail = type === "admin" ? "admin-guest@example.com" : "guest@example.com"

    let user = await prisma.user.findUnique({
      where: { email: guestEmail },
    })

    // If guest user doesn't exist, create it
    if (!user) {
      const hashedPassword = await bcrypt.hash("guest123", 10)

      user = await prisma.user.create({
        data: {
          email: guestEmail,
          password: hashedPassword,
          warName: type === "admin" ? "Admin Guest" : "Guest User",
          rank: "Guest",
          company: "Test Company",
          phone: "11999999999",
          isAdmin: type === "admin",
          pixKey: type === "admin" ? undefined : "guest@pix",
        },
      })

      // Add some sample consumptions for client guest
      if (type === "client") {
        const products = await prisma.product.findMany()

        if (products.length > 0) {
          // Add sample data
          for (let i = 0; i < Math.min(3, products.length); i++) {
            await prisma.consumption.create({
              data: {
                userId: user.id,
                productId: products[i].id,
                quantity: Math.floor(Math.random() * 5) + 1,
              },
            })
          }
        }
      }
    }

    await createSession(user)

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, warName: user.warName, isAdmin: user.isAdmin } },
      { status: 200 },
    )
  } catch (error) {
    console.error("Guest login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
