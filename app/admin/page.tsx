import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"
import { Header } from "@/components/header"
import { AdminUsersList } from "@/components/admin-users-list"
import { AdminProductsSold } from "@/components/admin-products-sold"
import { AdminProfitSummary } from "@/components/admin-profit-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Settings, DollarSign } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export default async function AdminPage() {
  const session = await getSession()

  if (!session || !session.isAdmin) {
    redirect("/login")
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.id },
  })

  if (!admin) {
    redirect("/login")
  }

  // Calculate total profit
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

  const totalQuantitySold = consumptions.reduce((sum, consumption) => {
    return sum + consumption.quantity
  }, 0)

  // Get current date in Portuguese format
  const currentDate = new Date()
  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ]
  const formattedDate = `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]}`

  return (
    <div className="min-h-screen bg-background">
      <Header userName={admin.warName} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Link href="/admin/products">
            <Button className="gap-2 hover-lift">
              <Settings className="h-4 w-4" />
              Gerenciar Produtos
            </Button>
          </Link>
        </div>
        <h5 className="text-xl font-bold pb-2">{formattedDate}</h5>

        {/* Profit Summary Card */}
        <div className="mb-8">
          <AdminProfitSummary initialProfit={totalProfit} initialQuantity={totalQuantitySold} />
        </div>

        {/* Products Sold Section */}
        <div className="mb-8">
          <AdminProductsSold adminId={admin.id} />
        </div>

        <AdminUsersList adminId={admin.id} />
      </main>
    </div>
  )
}
