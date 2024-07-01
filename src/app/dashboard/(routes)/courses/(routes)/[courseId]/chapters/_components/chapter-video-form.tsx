"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import MuxPlayer from "@mux/mux-player-react"

import { Button } from "@/components/ui/button"

import { FileUpload } from "@/components/ui/file-upload"
import { CirclePlus, Pencil, Video, X } from "lucide-react"
import { Chapter, MuxData } from "@prisma/client"

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

type FormSchemaType = z.infer<typeof formSchema>

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)
  const toggleEditButton = () => setIsEdit((cur) => !cur)

  const onSubmit = async (values: FormSchemaType) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      )
      toast.success("Course chapter updated successfully.")
      toggleEditButton()
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <div className="mt-6 border shadow-sm rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter video</span>
        <Button
          className="flex items-center gap-x-2"
          variant="ghost"
          onClick={toggleEditButton}
        >
          {isEdit ? (
            <>
              <X className="size-3" />
              <span className="text-xs">Cancel</span>
            </>
          ) : !initialData.videoUrl ? (
            <>
              <CirclePlus className="size-3" />
              <span className="text-xs">Add video</span>
            </>
          ) : (
            <>
              <Pencil className="size-3" />
              <span className="text-xs">Edit video</span>
            </>
          )}
        </Button>
      </div>
      <div className="mt-4">
        {isEdit ? (
          <div>
            <FileUpload
              endpoint="chapterVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videoUrl: url })
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Upload video related to chapter.
            </div>
          </div>
        ) : initialData.videoUrl ? (
          <div className="relative aspect-video">
            <MuxPlayer playbackId={initialData.muxData?.playbackId || ""} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 rounded-md bg-muted">
            <Video className="size-10 text-sky-500" />
          </div>
        )}
      </div>
      {initialData.videoUrl && isEdit && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a few minutes to process. Refresh the page if does not
          appear.
        </div>
      )}
    </div>
  )
}

export default ChapterVideoForm
