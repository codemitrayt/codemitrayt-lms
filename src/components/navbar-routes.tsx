import { UserButton } from "@clerk/nextjs"
import ModeToggle from "./mode-toggle"

const NavbarRoutes = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div></div>
      <div className="flex items-center space-x-4 justify-center">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  )
}

export default NavbarRoutes
