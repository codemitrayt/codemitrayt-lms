"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

import SearchInput from "./search-input"
import ModeToggle from "./mode-toggle"

const NavbarRoutes = () => {
  const pathname = usePathname()
  const isSearchPage = pathname.includes("/search")

  return (
    <div className="flex items-center justify-between w-full">
      <div className="relative">
        <div className="hidden md:block">{isSearchPage && <SearchInput />}</div>
      </div>
      <div className="flex items-center space-x-4 justify-center">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}

export default NavbarRoutes
