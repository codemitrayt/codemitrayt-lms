import { LucideIcon } from "lucide-react"

export type SidebarRouteItem = {
  icon: LucideIcon
  href: string
  label: string
  includes?: string
}
