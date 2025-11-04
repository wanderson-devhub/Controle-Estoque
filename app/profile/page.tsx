import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"
import { Header } from "@/components/header"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.warName} />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>
        <ProfileForm user={user} />
      </main>
    </div>
  )
}
