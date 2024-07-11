"use client"

import { Course, Category } from "@prisma/client"
import CourseCard from "./course-card"

type CourseWithProgress = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
}

interface CoursesListProps {
  items: CourseWithProgress[]
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imgUrl={item.imgUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="flex items-center justify-center">
          <span className="text-muted-foreground text-sm font-semibold">
            No Courses Found
          </span>
        </div>
      )}
    </div>
  )
}

export default CoursesList
