"use client"
import qs from "query-string"
import { Category } from "@prisma/client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface CategoryItemPros {
  category: Category
}

const CategoryItem = ({ category }: CategoryItemPros) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const paramsCategoryId = searchParams.get("categoryId")
  const paramsTitle = searchParams.get("title")

  const isSelected = paramsCategoryId === category.id

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: isSelected ? null : category.id,
          title: paramsTitle,
        },
      },
      { skipEmptyString: true, skipNull: true }
    )
    router.push(url)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center hover:border-sky-700 transition",
        isSelected && "bg-sky-200/20 border-sky-700"
      )}
    >
      <span className="truncate">{category.name}</span>
    </button>
  )
}

export default CategoryItem
