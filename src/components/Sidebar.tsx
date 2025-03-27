
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  MessageSquare, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Only show sidebar if user is logged in
  if (!user) return null;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Base navigation items that all users can see
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: Home,
      visible: true
    },
    {
      name: 'Conversas',
      path: '/conversas',
      icon: MessageSquare,
      visible: true
    },
    {
      name: 'Usuários',
      path: '/usuarios',
      icon: Users,
      visible: user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
    },
    {
      name: 'Agentes',
      path: '/agentes',
      icon: Settings,
      visible: user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
    },
    {
      name: 'Estatísticas',
      path: '/estatisticas',
      icon: BarChart3,
      visible: user.role === UserRole.SUPER_ADMIN
    }
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => item.visible);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-unite-200 text-white shadow-lg md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white pt-16 transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 pb-4">
          <div className="mt-8 space-y-1">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-unite-100/40",
                  isActive(item.path)
                    ? "bg-unite-100/50 text-unite-500"
                    : "text-slate-600 hover:text-unite-500 dark:text-slate-400 dark:hover:text-white"
                )}
                onClick={closeSidebar}
              >
                <item.icon className={cn(
                  "mr-2 h-4 w-4",
                  isActive(item.path)
                    ? "text-unite-500"
                    : "text-slate-500 group-hover:text-unite-500 dark:text-slate-400"
                )} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
