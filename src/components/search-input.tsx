"use client"

import { Search } from "lucide-react"
import { debounce } from "lodash"
import qs from "query-string"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Input } from "./ui/input"

const SearchInput = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("categoryId")

  const onChange = (value: string) => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: categoryId ? null : categoryId,
          title: value,
        },
      },
      { skipEmptyString: true, skipNull: true }
    )
    router.push(url)
  }

  return (
    <div className="relative">
      <Search className="size-4 absolute top-3 left-3 text-slate-600" />
      <Input
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus:border-sky-700 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Search for a course"
        onChange={debounce(
          (event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value),
          200
        )}
      />
    </div>
  )
}

export default SearchInput
