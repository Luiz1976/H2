import { Brain, BarChart3, User, Sparkles, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    description: "Explore testes psicológicos"
  },
  { 
    title: "Resultados", 
    url: "/resultados", 
    icon: BarChart3,
    description: "Visualize seus resultados"
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
      className="border-r border-border/50 bg-gradient-subtle backdrop-blur-sm"
      collapsible="icon"
    >
      <div className="flex h-full flex-col relative">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex h-16 items-center justify-between px-4 border-b border-border/50">
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-accent-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  HumaniQ
                </h1>
                <p className="text-xs text-muted-foreground/80">
                  Psicologia Avançada
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-full animate-fade-in">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          )}
          <SidebarTrigger className="hover:bg-accent/50 transition-colors duration-200" />
        </div>

        <SidebarContent className="flex-1 py-6 relative">
          <SidebarGroup>
            <SidebarGroupLabel className={`${isCollapsed ? "sr-only" : "px-3 text-xs font-semibold text-muted-foreground/70 mb-2"}`}>
              Navegação Principal
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-1">
              <SidebarMenu>
                {items.map((item, index) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover-scale ${
                            active 
                              ? "bg-gradient-primary text-primary-foreground font-medium shadow-glow" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-elegant"
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                          title={item.title}
                        >
                          {/* Active indicator */}
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full animate-scale-in" />
                          )}
                          
                          {/* Icon with animation */}
                          <div className={`relative flex items-center justify-center transition-transform duration-200 ${
                            active ? "scale-110" : "group-hover:scale-105"
                          }`}>
                            <item.icon className="h-5 w-5 shrink-0" />
                            {active && (
                              <div className="absolute inset-0 bg-primary-foreground/20 rounded-lg animate-pulse" />
                            )}
                          </div>
                          
                          {/* Text content */}
                          {!isCollapsed && (
                            <div className="flex flex-col animate-fade-in">
                              <span className="font-medium">{item.title}</span>
                              <span className={`text-xs transition-colors duration-200 ${
                                active ? "text-primary-foreground/80" : "text-muted-foreground group-hover:text-foreground/70"
                              }`}>
                                {item.description}
                              </span>
                            </div>
                          )}
                          
                          {/* Arrow indicator */}
                          {!isCollapsed && (
                            <ChevronRight className={`h-4 w-4 ml-auto transition-all duration-200 ${
                              active ? "opacity-100 rotate-90" : "opacity-0 group-hover:opacity-60"
                            }`} />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Decorative element */}
          {!isCollapsed && (
            <div className="mt-8 px-3 animate-fade-in">
              <div className="p-4 rounded-xl bg-gradient-card border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Dica</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete mais testes para obter insights mais precisos sobre sua personalidade.
                </p>
              </div>
            </div>
          )}
        </SidebarContent>

        {/* Footer */}
        <div className="relative p-4 border-t border-border/50">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30 animate-fade-in hover:shadow-elegant transition-all duration-300">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Usuário Demo</div>
                <div className="text-xs text-muted-foreground">Modo de teste</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center animate-fade-in">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}