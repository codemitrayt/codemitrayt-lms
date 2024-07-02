"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"

import { FileUpload } from "@/components/ui/file-upload"
import { CirclePlus, ImageIcon, Pencil, X } from "lucide-react"

interface ImageFormProps {
  initialData: {
    imgUrl: string | null
  }
  courseId: string
}

const formSchema = z.object({
  imgUrl: z.string().min(1, { message: "Image is required." }),
})

type FormSchemaType = z.infer<typeof formSchema>

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)
  const toggleEditButton = () => setIsEdit((cur) => !cur)

  const onSubmit = async (values: FormSchemaType) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success("Course updated successfully.")
      toggleEditButton()
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <div className="mt-6 border shadow-sm rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Image</span>
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
          ) : !initialData.imgUrl ? (
            <>
              <CirclePlus className="size-3" />
              <span className="text-xs">Add image</span>
            </>
          ) : (
            <>
              <Pencil className="size-3" />
              <span className="text-xs">Edit image</span>
            </>
          )}
        </Button>
      </div>
      <div className="mt-4">
        {isEdit ? (
          <div>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imgUrl: url })
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-2">
              16:9 aspect ratio recommnded
            </div>
          </div>
        ) : initialData.imgUrl ? (
          <div className="relative aspect-video">
            <Image
              alt="upload-image"
              fill
              className="object-cover rounded-md"
              src={initialData.imgUrl}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 rounded-md bg-muted">
            <ImageIcon className="size-10 text-sky-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageForm
