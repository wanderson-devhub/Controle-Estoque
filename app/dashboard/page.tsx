import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"
import { Header } from "@/components/header"
import { ConsumptionList } from "@/components/consumption-list"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.isAdmin) {
    redirect("/admin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      consumptions: {
        include: { product: true },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  const total = user.consumptions.reduce((sum, c) => sum + c.quantity * c.product.price, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.warName} pixKey={user.pixKey || undefined} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-professional hover-lift animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total a Pagar</p>
                <p className="text-3xl font-bold text-primary">R$ {total.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Itens Consumidos</p>
                <p className="text-3xl font-bold">{user.consumptions.length}</p>
              </div>
            </div>
          </div>
        </div>

        <ConsumptionList initialConsumptions={user.consumptions} userId={user.id} />
      </main>
    </div>
  )
}
