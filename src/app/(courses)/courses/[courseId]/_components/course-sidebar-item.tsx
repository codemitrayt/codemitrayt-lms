"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, Lock, PlayCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface CourseSidebarItemProps {
  chapterId: string
  label: string
  isCompleted: boolean
  courseId: string
  isLocked: boolean
}

const CourseSidebarItem = ({
  chapterId,
  label,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle
  const isActive = pathname?.includes(chapterId)

  const onClick = () => {
    return router.push(`/courses/${courseId}/chapters/${chapterId}`)
  }

  return (
    <button onClick={onClick} type="button">
      <div
        className={cn(
          "flex items-center h-full justify-between space-x-3 text-muted-foreground text-sm font-[500] pl-6 transition hover:text-muted-foreground hover:bg-muted",

          isActive &&
            "text-foreground bg-muted hover:bg-muted hover:text-foreground",
          isCompleted && "text-emerald-700 hover:text-emerald-700",
          isActive && isCompleted && "bg-emerald-200/20"
        )}
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            className={cn(
              "text-muted-foreground",
              isActive && "text-foreground",
              isCompleted && "text-emerald-700"
            )}
            size={22}
          />
          {label}
        </div>

        <div
          className={cn(
            "ml-auto opacity-0 border-2 border-foreground h-full transition-all",
            isActive && "opacity-100",
            isCompleted && "opacity-100 border border-emerald-700"
          )}
        />
      </div>
    </button>
  )
}

export default CourseSidebarItem
