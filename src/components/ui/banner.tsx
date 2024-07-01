"use client"

import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const bannerVariant = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success:
          "bg-emerald-200/80 border-emerald-800 text-primary text-secondary",
      },
    },

    defaultVariants: {
      variant: "warning",
    },
  }
)

interface BannerProps extends VariantProps<typeof bannerVariant> {
  label: string
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
}

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant === "warning" ? "warning" : "success"]
  return (
    <div className={cn(bannerVariant({ variant }))}>
      <Icon className="size-4 mr-2" />
      {label}
    </div>
  )
}
