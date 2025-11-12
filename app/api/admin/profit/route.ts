import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Calculate total profit: sum of (consumption.quantity * product.price) for all products owned by this admin
    const result = await prisma.consumption.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        product: {
          adminId: session.id,
        },
      },
    })

    // Get the total quantity sold
    const totalQuantitySold = result._sum.quantity || 0

    // Calculate total profit by summing (quantity * price) for each consumption
    const consumptions = await prisma.consumption.findMany({
      where: {
        product: {
          adminId: session.id,
        },
      },
      include: {
        product: true,
      },
    })

    const totalProfit = consumptions.reduce((sum, consumption) => {
      return sum + (consumption.quantity * consumption.product.price)
    }, 0)

    return NextResponse.json({
      totalProfit,
      totalQuantitySold,
    })
  } catch (error) {
    console.error("Error calculating profit:", error)
    return NextResponse.json({ error: "Failed to calculate profit" }, { status: 500 })
  }
}
