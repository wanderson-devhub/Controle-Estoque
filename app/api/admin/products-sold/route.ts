import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all consumptions for products owned by this admin, grouped by product
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

    // Aggregate by product
    const productSales = consumptions.reduce((acc, consumption) => {
      const productId = consumption.product.id
      if (!acc[productId]) {
        acc[productId] = {
          product: consumption.product,
          totalQuantity: 0,
          totalProfit: 0,
        }
      }
      acc[productId].totalQuantity += consumption.quantity
      acc[productId].totalProfit += consumption.quantity * consumption.product.price
      return acc
    }, {} as Record<string, { product: any; totalQuantity: number; totalProfit: number }>)

    // Convert to array and sort by totalProfit descending
    const sortedProducts = Object.values(productSales).sort((a, b) => b.totalProfit - a.totalProfit)

    return NextResponse.json(sortedProducts)
  } catch (error) {
    console.error("Error fetching products sold:", error)
    return NextResponse.json({ error: "Failed to fetch products sold" }, { status: 500 })
  }
}
