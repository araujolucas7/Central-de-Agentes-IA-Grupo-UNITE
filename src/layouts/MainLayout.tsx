
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export const MainLayout = () => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
          <p className="text-sm text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 md:pl-64">
          <div className="container mx-auto py-6 px-4 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
