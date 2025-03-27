
import { User } from '@/types';
import { login as apiLogin } from '@/services/api';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('unite_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('unite_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await apiLogin(email, password);
      
      if (user) {
        setUser(user);
        localStorage.setItem('unite_user', JSON.stringify(user));
        toast.success('Login realizado com sucesso!');
        return true;
      } else {
        toast.error('Email ou senha inválidos');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unite_user');
    toast.success('Logout realizado com sucesso');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
