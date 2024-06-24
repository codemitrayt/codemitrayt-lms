"use client"

import { Book, LayoutDashboard, Search } from "lucide-react"
import SidebarItem from "./sidebar-item"
import { SidebarRouteItem } from "../_types"

const sidebarRoutes: Array<SidebarRouteItem> = [
  {
    icon: LayoutDashboard,
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: Book,
    href: "/dashboard/courses",
    label: "Courses",
    includes: "courses",
  },
  {
    icon: Search,
    href: "/dashboard/search",
    label: "Browse",
    includes: "search",
  },
]

const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full">
      {sidebarRoutes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          href={route.href}
          label={route.label}
          includes={route.includes}
        />
      ))}
    </div>
  )
}

export default SidebarRoutes
