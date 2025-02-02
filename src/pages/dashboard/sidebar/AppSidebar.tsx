import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import { ChevronsUpDown, BookOpen } from "lucide-react"
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
      url: "/dashboard",
      icon: BookOpen,
      isActive: true,
    },
    {
      title: "Exams",
      url: "/exam",
      icon: BookOpen,
    },
    {
      title: "Students",
      url: "#",
      icon: BookOpen,
    },
  ]

  const userInfo = {
    name: "Raji Hakeem",
    email: "hakeemraji1000@gmail.com",
    avatar: "avatar.jpg"
  }

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
                <project.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{project.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar