import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MessageSquare,
  Database,
  Package,
  Settings,
  Store,
  Users,
  Trophy,
  Briefcase,
  ChevronDown,
  Cpu,
  BookOpen,
  Download,
  Sliders,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ to, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link to={to} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

interface NavSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function NavSection({ title, icon, children, defaultOpen = true }: NavSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "" : "-rotate-90"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 space-y-1 mt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">PRISM</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-4">
            {/* Main */}
            <NavSection title="Model" icon={<Cpu className="h-4 w-4" />}>
              <NavItem
                to="/app/chat"
                icon={<MessageSquare className="h-4 w-4" />}
                label="Chat"
                isActive={isActive("/app/chat") || isActive("/app")}
                onClick={onClose}
              />
            </NavSection>

            {/* Knowledge */}
            <NavSection title="Knowledge" icon={<BookOpen className="h-4 w-4" />}>
              <NavItem
                to="/app/bundles"
                icon={<Package className="h-4 w-4" />}
                label="Bundles"
                isActive={isActive("/app/bundles")}
                onClick={onClose}
              />
              <NavItem
                to="/app/datasets"
                icon={<Database className="h-4 w-4" />}
                label="Dataset Packs"
                isActive={isActive("/app/datasets")}
                onClick={onClose}
              />
            </NavSection>

            {/* Downloads */}
            <NavSection title="Downloads" icon={<Download className="h-4 w-4" />} defaultOpen={false}>
              <NavItem
                to="/app/marketplace"
                icon={<Store className="h-4 w-4" />}
                label="Marketplace"
                isActive={isActive("/app/marketplace")}
                onClick={onClose}
              />
              <NavItem
                to="/app/rooms"
                icon={<Users className="h-4 w-4" />}
                label="Community Rooms"
                isActive={isActive("/app/rooms")}
                onClick={onClose}
              />
            </NavSection>

            {/* Advanced */}
            <NavSection title="Advanced" icon={<Sliders className="h-4 w-4" />} defaultOpen={false}>
              <NavItem
                to="/app/jobs"
                icon={<Briefcase className="h-4 w-4" />}
                label="Jobs"
                isActive={isActive("/app/jobs")}
                onClick={onClose}
              />
              <NavItem
                to="/app/competitions"
                icon={<Trophy className="h-4 w-4" />}
                label="Competitions"
                isActive={isActive("/app/competitions")}
                onClick={onClose}
              />
              <NavItem
                to="/app/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                isActive={isActive("/app/settings")}
                onClick={onClose}
              />
            </NavSection>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
