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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { Pencil, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"

interface ChapterAccessFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
})

type FormSchemaType = z.infer<typeof formSchema>

const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
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
        <span>Chapter access setting</span>
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
              <span className="text-xs">Edit access</span>
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
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <div className="leading-none">
                      <FormDescription>
                        Check this box if you want to make this chapter free
                        preview.
                      </FormDescription>
                    </div>
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
          <div className={cn("text-sm mt-2", !initialData.isFree && "italic")}>
            {initialData.isFree
              ? "This chapter is free for preview"
              : "This chapter is not free."}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterAccessForm
