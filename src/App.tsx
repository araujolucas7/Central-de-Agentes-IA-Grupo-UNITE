
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { MainLayout } from "@/layouts/MainLayout";
import { lazy, Suspense } from "react";

// Pages
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Lazy loaded pages for better performance
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Chat = lazy(() => import("@/pages/Chat"));
const ConversationList = lazy(() => import("@/pages/ConversationList"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const AgentManagement = lazy(() => import("@/pages/AgentManagement"));
const Statistics = lazy(() => import("@/pages/Statistics"));

// Loading fallback for lazy loaded pages
const LazyLoadingFallback = () => (
  <div className="flex h-96 items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
      <p className="text-sm text-slate-500">Carregando...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="/chat/:slug"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <Chat />
                  </Suspense>
                }
              />
              <Route
                path="/conversas"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <ConversationList />
                  </Suspense>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <UserManagement />
                  </Suspense>
                }
              />
              <Route
                path="/agentes"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <AgentManagement />
                  </Suspense>
                }
              />
              <Route
                path="/estatisticas"
                element={
                  <Suspense fallback={<LazyLoadingFallback />}>
                    <Statistics />
                  </Suspense>
                }
              />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
