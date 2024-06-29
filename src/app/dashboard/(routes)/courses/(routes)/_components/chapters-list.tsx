"user client"

import { Chapter } from "@prisma/client"
import { Grip, Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ChpaterItemsProps = {
  chapters: Chapter[]
  courseId: string
  onReorder: (value: { id: string; position: number }[]) => void
}
const ChaptersList = ({
  chapters: items,
  courseId,
  onReorder,
}: ChpaterItemsProps) => {
  const [chapters, setChapters] = useState(items)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setChapters(items)
  }, [items])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)
    setChapters(items)
    const bulkUpdateData = updatedChapters.map((chapter) => {
      return {
        id: chapter.id,
        position: items.findIndex((item) => item.id === chapter.id),
      }
    })

    onReorder(bulkUpdateData)
  }

  if (!isMounted) return false

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "border rounded-md",
                      chapter.isPublished ? "bg-muted" : "bg-muted/20"
                    )}
                  >
                    <div
                      className="flex items-center justify-between"
                      {...provided.dragHandleProps}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <button className="flex items-center justify-center hover:bg-muted rounded-tl-md rounded-bl-md p-3 border-r">
                          <Grip className="size-4" />
                        </button>
                        <span className="text-sm font-medium line-clamp-1 text-foregorund">
                          {chapter.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Badge
                          className={cn(
                            "text-[10px] px-3 py-[0.5px]",
                            chapter.isFree
                              ? "bg-green-400 hover:bg-green-400"
                              : "bg-blue-400 hover:bg-blue-400"
                          )}
                        >
                          {chapter.isFree ? "Free" : "Premium"}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-[10px] px-3 py-[0.5px]",
                            chapter.isPublished
                              ? "bg-green-400 hover:bg-green-400"
                              : "bg-blue-400 hover:bg-blue-400"
                          )}
                        >
                          {chapter.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent"
                        >
                          <Pencil className="size-3 text-green-500 hover:text-green-500/90" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList
