
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Home,
  MessageSquare,
  Book,
  Smile,
  Moon,
  LogOut,
  Weight,
  Award,
  GamepadIcon,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "AI Chat",
    href: "/chat",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Journal",
    href: "/journal",
    icon: <Book className="h-5 w-5" />,
  },
  {
    title: "Mood Tracker",
    href: "/mood-tracker",
    icon: <Smile className="h-5 w-5" />,
  },
  {
    title: "BMI Calculator",
    href: "/bmi-calculator",
    icon: <Weight className="h-5 w-5" />,
  },
  {
    title: "Relaxation",
    href: "/relaxation",
    icon: <Moon className="h-5 w-5" />,
  },
  {
    title: "Games",
    href: "/dashboard?tab=games",
    icon: <GamepadIcon className="h-5 w-5" />,
  },
  {
    title: "Rewards",
    href: "/dashboard?tab=rewards",
    icon: <Award className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const isActive = (href: string) => {
    if (href.includes("?tab=")) {
      const tabValue = href.split("?tab=")[1];
      return location.pathname === "/dashboard" && location.search.includes(`tab=${tabValue}`);
    }
    return location.pathname === href;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="group fixed inset-y-0 left-0 z-30 flex h-full w-[70px] hover:w-64 md:w-64 flex-col bg-sidebar dark:bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Logo className="overflow-hidden transition-all group-hover:opacity-100 md:opacity-100 opacity-0" />
        <div className="md:hidden group-hover:hidden absolute top-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity">
          <Logo size="sm" />
        </div>
      </div>
      
      <ScrollArea className="flex-1 overflow-auto">
        <nav className="flex-1 space-y-1 px-2 py-3 transition-all">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center space-x-3 rounded-md px-3 py-2 transition-all group-hover:justify-start md:justify-start justify-center ${
                isActive(item.href)
                  ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span className="text-current">{item.icon}</span>
              <span className="text-sm opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100">
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center md:justify-start group-hover:justify-start space-x-3">
            <ThemeToggle />
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="md:flex hidden">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-3 flex items-center overflow-hidden py-1.5 px-1">
          <div className="flex w-full items-center overflow-hidden md:overflow-visible">
            <div className="flex flex-1 items-center gap-3 overflow-hidden rounded-md bg-sidebar-accent/50 p-2 md:max-w-none max-w-0 group-hover:max-w-full transition-all duration-300">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1 overflow-hidden md:opacity-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{user?.email || "user@example.com"}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 md:hidden group-hover:flex hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
