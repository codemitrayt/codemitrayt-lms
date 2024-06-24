import { UserButton } from "@clerk/nextjs"

const NavbarRoutes = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div></div>
      <div className="flex items-center space-x-2 justify-center">
        <UserButton />
      </div>
    </div>
  )
}

export default NavbarRoutes
