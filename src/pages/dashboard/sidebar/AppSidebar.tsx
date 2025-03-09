import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import { BookOpen, ChartAreaIcon, Users, FileSpreadsheet } from "lucide-react"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"


const AppSidebar = () => {

  const project = {
    name: "ExBoard",
    logo: BookOpen,
  }

  const navItems = [
    {
      title: "Dashboard",
      url: "home",
      icon: ChartAreaIcon,
      isActive: true,
      admin: true,
    },
    {
      title: "Exams",
      url: "exam",
      icon: BookOpen,
    },
    {
      title: "Users",
      url: "users",
      icon: Users,
      admin: true,
    },
    {
      title: "Results",
      url: "results",
      icon: FileSpreadsheet,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <project.logo className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-xl leading-tight">
                <span className="truncate font-semibold">{project.name}</span>
              </div>
              {/* <ChevronsUpDown className="ml-auto" /> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar