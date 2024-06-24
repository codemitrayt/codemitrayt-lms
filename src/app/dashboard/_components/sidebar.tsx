import Logo from "@/components/logo"
import SidebarRoutes from "./sidebar-routes"

const Sidebar = () => {
  return (
    <div className="h-full border-r shadow-sm overflow-y-auto flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col">
        <SidebarRoutes />
      </div>
    </div>
  )
}

export default Sidebar
