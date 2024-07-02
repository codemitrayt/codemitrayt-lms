"use client"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
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
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingWhileChangeVisibility, setIsLoadingWhileChangeVisibility] =
    useState(false)

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

  const handleChapterVisibility = async () => {
    try {
      setIsLoadingWhileChangeVisibility(true)
      if (!isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        )
        toast.success("Chpater published successfully.")
        confetti.onOpen()
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        )
        toast.success("Chpater unpublished successfully.")
      }
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong.")
    } finally {
      setIsLoadingWhileChangeVisibility(false)
    }
  }
  return (
    <div className="flex items-center justify-center space-x-3">
      <Button
        disabled={disabled || isLoading || isLoadingWhileChangeVisibility}
        onClick={handleChapterVisibility}
        variant="outline"
        size="sm"
        className="space-x-1"
      >
        {isLoadingWhileChangeVisibility && (
          <Loader2 className="size-5 animate-spin" />
        )}
        <span>{isPublished ? "Unpublish" : "Publish"}</span>
      </Button>

      <button
        onClick={onDelete}
        disabled={isLoading || isLoadingWhileChangeVisibility}
      >
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
