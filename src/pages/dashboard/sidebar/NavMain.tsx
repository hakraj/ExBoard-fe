
import { type LucideIcon } from "lucide-react"

// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/AuthProvider";

export function NavMain({
  items,
}: {
  items: {
    title: string,
    url: string,
    icon?: LucideIcon,
    isActive?: boolean,
    admin?: boolean,
    // items?: {
    //   title: string
    //   url: string
    // }[]
  }[]
}) {
  const { user } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (user.role !== 'admin' && item.admin) {
            return null
          } else {
            return (
              // <Collapsible  asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem key={item.title}>
                {/* <CollapsibleTrigger asChild> */}
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span className="text-base">{item.title}</span>
                    {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
                  </a>
                </SidebarMenuButton>
                {/* </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent> */}
              </SidebarMenuItem>
              // </Collapsible>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

