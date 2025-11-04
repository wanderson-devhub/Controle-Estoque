import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const includeUnavailable = url.searchParams.get("includeUnavailable") === "true"

    const products = await prisma.product.findMany({
      where: includeUnavailable ? {} : { available: true },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, price, available, imageUrl } = body

    if (id) {
      // Update existing product
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          price: Number.parseFloat(price),
          available,
          imageUrl,
        },
      })
      return NextResponse.json(product)
    } else {
      // Create new product
      const product = await prisma.product.create({
        data: {
          name,
          price: Number.parseFloat(price),
          available,
          imageUrl,
        },
      })
      return NextResponse.json(product)
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
