"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { CirclePlus, ImageIcon, Pencil, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"
import { FileUpload } from "@/components/ui/file-upload"

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
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgUrl: initialData?.imgUrl || "",
    },
  })

  const router = useRouter()
  const { isSubmitting, isValid } = form.formState
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
    <div className="mt-6 border shadow-sm shadow-gray-100 rounded-md p-4">
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
            <ImageIcon className="h-10 w-10 text-sky-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageForm
