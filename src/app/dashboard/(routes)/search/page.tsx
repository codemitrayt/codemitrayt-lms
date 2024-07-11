import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getCourses } from "actions/get-courses"

import db from "@/lib/db"
import Categories from "./_components/categories"
import CoursesList from "./_components/courses-list"

interface SearchProps {
  searchParams: {
    categoryId: string
    title: string
  }
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  const { userId } = auth()
  if (!userId) return redirect("/")
  const categories = await db.category.findMany({ orderBy: { name: "asc" } })
  const courses = await getCourses({
    userId,
    ...searchParams,
  })
  return (
    <div className="p-6">
      <Categories categories={categories} />
      <div className="mt-4">
        <CoursesList items={courses} />
      </div>
    </div>
  )
}

export default SearchPage
