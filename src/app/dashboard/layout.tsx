import Navbar from "./_components/navbar"
import Sidebar from "./_components/sidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="fixed md:pl-60 inset-y-0 w-full z-50 h-[60px]">
        <Navbar />
      </div>
      <div className="hidden md:block fixed h-full w-60 inset-y-0 z-50 bg-background">
        <Sidebar />
      </div>
      <main className="md:pl-60 h-full pt-[60px]"> {children}</main>
    </div>
  )
}

export default DashboardLayout
