import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"
import CourseSidebarItem from "./course-sidebar-item"

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & { userProgress: UserProgress[] | null })[]
  }
  progress: number
}

const CourseSidebar = async ({ course, progress }: CourseSidebarProps) => {
  const { userId } = auth()
  if (!userId) return redirect("/")

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
      </div>

      <div className="flex flex-col w-full">
        {course.chapters.map((chapters) => (
          <CourseSidebarItem
            key={chapters.id}
            chapterId={chapters.id}
            label={chapters.title}
            isCompleted={!!chapters.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapters.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}

export default CourseSidebar
