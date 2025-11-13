import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"
import { Header } from "@/components/header"
import { AdminUsersList } from "@/components/admin-users-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Settings, DollarSign } from "lucide-react"

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

        {/* Profit Summary Card 
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-300 dark:to-emerald-200 dark:border-green-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <DollarSign className="h-5 w-5" />
                Lucro Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-2">
                R$ {formatPrice(totalProfit)}
              </div>
              <p className="text-sm text-green-700 dark:text-green-900">
                Total de {totalQuantitySold} produtos vendidos
              </p>
            </CardContent>
          </Card>
        </div>
        */}

        <AdminUsersList adminId={admin.id} />
      </main>
    </div>
  )
}
