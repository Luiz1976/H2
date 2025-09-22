import { Brain, BarChart3, User, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { 
    title: "Testes", 
    url: "/testes", 
    icon: Brain,
  },
  { 
    title: "Resultados", 
    url: "/resultados", 
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className="border-none bg-card/50 backdrop-blur-xl"
      collapsible="icon"
    >
      <div className="flex h-full flex-col">
        {/* Header - Logo e Toggle */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-border/10">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  HumaniQ
                </h1>
                <p className="text-xs text-muted-foreground">
                  Psicologia Digital
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-full">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          )}
          <SidebarTrigger className="h-9 w-9 hover:bg-accent/50 rounded-xl transition-colors" />
        </div>

        {/* Navigation */}
        <SidebarContent className="flex-1 px-4 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={`group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                            active 
                              ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                          }`}
                          title={item.title}
                        >
                          <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                            active ? "scale-110" : "group-hover:scale-105"
                          }`} />
                          {!isCollapsed && (
                            <span className="font-medium text-sm">
                              {item.title}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <div className="p-4 border-t border-border/10">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-accent/20 hover:bg-accent/30 transition-colors">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  Demo User
                </div>
                <div className="text-xs text-muted-foreground">
                  Modo Teste
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}