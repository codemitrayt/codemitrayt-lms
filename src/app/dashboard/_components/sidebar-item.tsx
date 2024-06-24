"use client"

import { cn } from "@/lib/utils"
import { SidebarRouteItem } from "../_types"
import { usePathname, useRouter } from "next/navigation"

type SidebarItem = SidebarRouteItem
const SidebarItem = ({ icon: Icon, href, label, includes }: SidebarItem) => {
  const pathname = usePathname()
  const router = useRouter()
  const isActive =
    pathname === href || pathname.includes(includes ? includes : "?")
  const handleOnClick = () => router.push(href)
  return (
    <button
      onClick={handleOnClick}
      className={cn(
        "flex items-center gap-x-2 text-foreground text-md font-semibold pl-6 py-4 hover:text-foreground/80 cursor-pointer hover:bg-muted transition",
        isActive && "bg-muted border-r-4 border-muted-foreground"
      )}
    >
      <Icon size={22} className={cn("text-foreground")} />
      <span>{label}</span>
    </button>
  )
}

export default SidebarItem
