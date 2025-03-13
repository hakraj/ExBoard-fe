import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import AppSidebar from "./sidebar/AppSidebar"
import { Outlet, useLocation } from "react-router-dom"
import { BellDot } from "lucide-react"

const Home = () => {
  const location = useLocation();

  const paths = location.pathname.split("/")

  const currentTab = `${paths[0]}/${paths[1]}/${paths[2]}`

  const capitalize = (str: string) => {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>{capitalize(paths[1])}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={currentTab}>{paths[2] ? capitalize(paths[2]) : "Home"}</BreadcrumbLink>
                </BreadcrumbItem>
                {paths[3] && <BreadcrumbSeparator className="hidden md:block" />}
                <BreadcrumbItem>
                  <BreadcrumbPage>{paths[3] && capitalize(paths[3])}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div>
            <BellDot className='mr-5 cursor-pointer' />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 md:p-12 pt-4 bg-gray-50">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider >
  )
}

export default Home