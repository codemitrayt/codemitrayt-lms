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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ComboBox from "@/components/ui/combobox"

interface CategoryFormProps {
  initialData: {
    categoryId: string | null
  }
  courseId: string
  options: { label: string; value: string }[]
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required." }),
})

type FormSchemaType = z.infer<typeof formSchema>

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
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

  const selectedCategory = options.find(
    (option) => option.value === initialData.categoryId
  )

  return (
    <div className="mt-6 border shadow-sm shadow-gray-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <span>Course Category</span>
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
              <Pencil className="size-3" />
              <span className="text-xs">Edit category</span>
            </>
          )}
        </Button>
      </div>
      <div className="">
        {isEdit ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ComboBox options={options} {...field} />
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
          <p
            className={cn("text-sm mt-2", !initialData.categoryId && "italic")}
          >
            {initialData?.categoryId ? selectedCategory?.label : "No category"}
          </p>
        )}
      </div>
    </div>
  )
}

export default CategoryForm
