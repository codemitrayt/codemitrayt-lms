"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { CirclePlus, File, Loader2, Trash2, X } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { Attachment, Course } from "@prisma/client"

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1, { message: "Image is required." }),
})

type FormSchemaType = z.infer<typeof formSchema>

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const toggleEditButton = () => setIsEdit((cur) => !cur)

  const onSubmit = async (values: FormSchemaType) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success("Course updated successfully.")
      toggleEditButton()
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  const onDelete = async (attachmentId: string) => {
    try {
      setDeletingId(attachmentId)
      await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`)
      toast.success("Attachment deleted successfully.")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-6 border shadow-sm rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Attachments</span>
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
          ) : (
            <>
              <CirclePlus className="size-3" />
              <span className="text-xs">Add attachment</span>
            </>
          )}
        </Button>
      </div>
      <div className="mt-4">
        {isEdit ? (
          <div>
            <FileUpload
              endpoint="courseAttachments"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url: url })
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Add attachment related to your course.
            </div>
          </div>
        ) : initialData.attachments.length ? (
          <div className="relative space-y-3">
            {initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="p-2 rounded-md flex items-center justify-between bg-muted"
              >
                <div className="flex items-center justify-center space-x-1">
                  <File className="text-sky-500 size-4" />
                  <span className="text-sm line-clamp-1 text-foregorund">
                    {attachment.name}
                  </span>
                </div>

                <button
                  className="text-red-500 hover:text-red-400 transition"
                  onClick={() => onDelete(attachment.id)}
                >
                  {deletingId === attachment.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span className="italic text-sm mt-2">No attachments</span>
        )}
      </div>
    </div>
  )
}

export default AttachmentForm
