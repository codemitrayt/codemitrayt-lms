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

import { Pencil, PlusCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Chapter, Course } from "@prisma/client"
import { Input } from "@/components/ui/input"
import ChaptersList from "./chapters-list"

interface ChapterTitleFormProps {
  initialData: Course & { chapters: Chapter[] }
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Chpater title is required." }),
})

type FormSchemaType = z.infer<typeof formSchema>

const ChapterTitleForm = ({ initialData, courseId }: ChapterTitleFormProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const router = useRouter()
  const { isSubmitting, isValid } = form.formState
  const [isCreating, setIsCreating] = useState(false)
  const toggleCreateButton = () => setIsCreating((cur) => !cur)

  const onSubmit = async (values: FormSchemaType) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success("Course chapter created successfully.")
      toggleCreateButton()
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  const onReorder = (updatedData: { id: string; position: number }[]) => {
    console.log(updatedData)
  }

  return (
    <div className="mt-6 border shadow-sm rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course chapters</span>
        <Button
          className="flex items-center gap-x-2"
          variant="ghost"
          onClick={toggleCreateButton}
        >
          {isCreating ? (
            <>
              <X className="size-3" />
              <span className="text-xs">Cancel</span>
            </>
          ) : (
            <>
              <PlusCircle className="size-3" />
              <span className="text-xs">Add chapter</span>
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        {isCreating ? (
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
                  Create
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div
            className={cn(
              "text-sm mt-2",
              !initialData?.chapters.length && "italic"
            )}
          >
            {initialData?.chapters.length ? (
              <ChaptersList
                chapters={initialData.chapters}
                courseId={courseId}
                onReorder={onReorder}
              />
            ) : (
              "No chapters"
            )}
          </div>
        )}
      </div>

      <div className="text-xs mt-2 text-muted-foreground">
        Drag and drop to render chapters.
      </div>
    </div>
  )
}

export default ChapterTitleForm
