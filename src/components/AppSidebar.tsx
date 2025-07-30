import { BarChart3, FileText, Target, Settings, TrendingUp } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Campaigns", url: "/campaigns", icon: Target },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => 
    path === "/" ? currentPath === "/" : currentPath.startsWith(path)

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar 
      className="border-r border-glass-border bg-sidebar/95 backdrop-blur-xl mt-14 sm:mt-16"
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-surface/90">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-2 sm:px-4 sm:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        onClick={handleNavClick}
                        className={`flex items-center gap-3 rounded-lg px-2 py-2 sm:px-3 sm:py-2 text-sm font-medium transition-all hover:bg-sidebar-accent ${
                          active
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                            : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className={`${state === "collapsed" ? "sr-only" : ""} truncate`}>
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}