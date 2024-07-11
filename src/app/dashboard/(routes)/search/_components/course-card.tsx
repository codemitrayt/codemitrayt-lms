"use client"

import IconBadge from "@/components/ui/icon-badge"
import { formatPrice } from "@/lib/format"
import { BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CourseCardProps {
  id: string
  title: string
  imgUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
}
const CourseCard = ({
  id,
  title,
  imgUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={imgUrl} alt="course-img" fill className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-camp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength === 1
                  ? chaptersLength + " Chapter"
                  : chaptersLength + " Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>TODO: progress</div>
          ) : (
            <div className="text-md md:text-sm font-medium text-foreground">
              {formatPrice(price)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
