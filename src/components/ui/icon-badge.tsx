import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const iconVariance = cva("", {
  variants: {
    type: {
      default: "text-sky-500",
      success: "text-green-500",
    },
    size: {
      default: "size-5",
      sm: "size-4",
    },
  },
  defaultVariants: {
    type: "default",
    size: "default",
  },
})

type IconVariance = VariantProps<typeof iconVariance>
interface IconBadge extends IconVariance {
  icon: LucideIcon
}

const IconBadge = ({ icon: Icon, type, size }: IconBadge) => {
  return (
    <div className="flex items-center justify-center rounded-full h-8 w-8 bg-sky-50 p-1 shadow-sm shadow-gray-400">
      <Icon className={cn(iconVariance({ type, size }))} />
    </div>
  )
}

export default IconBadge
