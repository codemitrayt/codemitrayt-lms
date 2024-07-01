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

import { Pencil, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { Input } from "@/components/ui/input"

interface ChapterTitleFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Chapter title is required." }),
})

type FormSchemaType = z.infer<typeof formSchema>

const ChapterTitleForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
    },
  })

  const router = useRouter()
  const { isSubmitting, isValid } = form.formState
  const [isEditing, setIsEditing] = useState(false)
  const toggleEditButton = () => setIsEditing((cur) => !cur)

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
    <div className="relative mt-6 border shadow-sm rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Chapter title</span>
        <Button
          className="flex items-center gap-x-2"
          variant="ghost"
          onClick={toggleEditButton}
        >
          {isEditing ? (
            <>
              <X className="size-3" />
              <span className="text-xs">Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="size-3" />
              <span className="text-xs">Edit title</span>
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        {isEditing ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introuduction to AI'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end">
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className={cn("text-sm mt-2", !initialData.title && "italic")}>
            {initialData.title ? initialData.title : "No title"}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterTitleForm
