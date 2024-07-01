"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface ChapterActionsProps {
  disabled: boolean
  isPublished: boolean
  courseId: string
  chapterId: string
}
const ChapterActions = ({
  disabled,
  isPublished,
  courseId,
  chapterId,
}: ChapterActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success("Chapter deleted successfully")
      router.refresh()
      router.push(`/dashboard/courses/${courseId}`)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const onPublish = async () => {}
  return (
    <div className="flex items-center justify-center space-x-3">
      <Button
        disabled={disabled || isLoading}
        onClick={() => {}}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <button onClick={onDelete}>
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Trash2 className="text-red-500 hover:text-red-400 transition size-5" />
        )}
      </button>
    </div>
  )
}

export default ChapterActions
