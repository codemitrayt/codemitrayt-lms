import { PrismaClient } from "@prisma/client"
const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "CPP" },
        { name: "Web Development" },
        { name: "Full Stack Development" },
        { name: "Data Structure and Algorithm" },
      ],
    })
    console.log("Success")
  } catch (error) {
    console.log("Error seeding the database categories", error)
    process.exit(1)
  } finally {
    await database.$disconnect()
  }
}

main()
