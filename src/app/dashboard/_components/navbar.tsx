import MobileSidebar from "./mobile-sidebar"
import NavbarRoutes from "@/components/navbar-routes"

const Navbar = () => {
  return (
    <div className="px-4 border-b shadow-sm flex items-center bg-background h-[60px]">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  )
}

export default Navbar
