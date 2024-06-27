import db from "@/lib/db"
import { redirect } from "next/navigation"

import IconBadge from "@/components/ui/icon-badge"
import TitleForm from "../_components/title-form"
import { IndianRupee, LayoutDashboard, ListChecks } from "lucide-react"
import DescriptionForm from "../_components/description-form"
import ImageForm from "../_components/image-form"
import CategoryForm from "../_components/category-form"
import PriceForm from "../_components/price-form"

type SingleCoursePage = {
  params: {
    courseId: string
  }
}
const SingleCoursePage = async ({ params }: SingleCoursePage) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  })

  const categories = (
    await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    })
  ).map((category) => {
    return {
      value: category.id,
      label: category.name,
    }
  })

  if (!course) return redirect("/dashboard/courses")

  console.log(categories)

  const courseField = [
    course.title,
    course.description,
    course.imgUrl,
    course.categoryId,
    course.price,
  ]

  const totalFields = courseField.length
  const completedFields = courseField.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`

  return (
    <div className="p-6">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-muted-foreground">
            Completed all fields {completionText}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-16 gap-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h1 className="text-lg font-medium">Customize your course</h1>
            </div>
            <TitleForm initialData={course} courseId={params.courseId} />
            <DescriptionForm initialData={course} courseId={params.courseId} />
            <ImageForm initialData={course} courseId={params.courseId} />
            <CategoryForm
              initialData={course}
              courseId={params.courseId}
              options={categories}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h1 className="text-lg font-medium">Course chapters</h1>
              </div>
              <div>TODO: Chapters</div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={IndianRupee} />
                <h1 className="text-lg font-medium">Sell your course</h1>
              </div>
              <div>
                <PriceForm initialData={course} courseId={params.courseId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCoursePage
