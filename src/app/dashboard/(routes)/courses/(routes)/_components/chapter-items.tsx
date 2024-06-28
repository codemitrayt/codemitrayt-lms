"user client"

import { Chapter } from "@prisma/client"
import { Grid, Pencil } from "lucide-react"

type ChpaterItemsProps = {
  chapters: Chapter[]
  courseId: string
}
const ChapterItems = ({ chapters, courseId }: ChpaterItemsProps) => {
  return (
    <div className="flex flex-col space-y-3">
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          className="bg-muted rounded-md border px-3 py-2 flex items-center justify-between"
        >
          <div className="flex items-center justify-center space-x-2">
            <Grid className="text-muted-foreground size-4" />
            <span className="text-sm font-medium"> {chapter.title}</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <button className="flex items-center justify-center">
              <Pencil className="text-sky-700 hover:text-sky-600 size-4 transition" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChapterItems
