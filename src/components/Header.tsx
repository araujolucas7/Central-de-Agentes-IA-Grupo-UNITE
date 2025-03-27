
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold bg-gradient-to-r from-unite-200 to-unite-300 bg-clip-text text-transparent">
              Central IA
            </span>
            <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Grupo UNITE
            </span>
          </Link>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {user.name}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-unite-100/30 text-unite-400">
                {user.role}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Link
                to="/perfil"
                className="inline-flex items-center justify-center rounded-full h-8 w-8 text-sm font-medium ring-offset-background transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-slate-800"
              >
                <User className="h-4 w-4" />
                <span className="sr-only">Perfil</span>
              </Link>
              
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-full h-8 w-8 text-sm font-medium ring-offset-background transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
