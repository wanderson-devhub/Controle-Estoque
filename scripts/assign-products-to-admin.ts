import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Find the first admin
  const admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  })

  if (!admin) {
    console.log("No admin found")
    return
  }

  // Assign all products without adminId to this admin
  const result = await prisma.product.updateMany({
    where: { adminId: null },
    data: { adminId: admin.id },
  })

  console.log(`Assigned ${result.count} products to admin ${admin.warName}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
