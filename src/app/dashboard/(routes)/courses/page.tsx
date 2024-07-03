import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import db from "@/lib/db"

const CoursesPage = async () => {
  const { userId } = auth()
  if (!userId) return redirect("/")

  const courses = await db.course.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="relative">
      <div className="container mx-auto">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  )
}

export default CoursesPage
