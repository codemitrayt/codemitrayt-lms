"use client"

import { ArrowLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const BackButton = ({ title }: { title: string }) => {
  const router = useRouter()
  return (
    <button
      className="text-sm flex items-center justify-center space-x-2 hover:text-muted-foreground"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="size-3" />
      <span>{title}</span>
    </button>
  )
}

export default BackButton
