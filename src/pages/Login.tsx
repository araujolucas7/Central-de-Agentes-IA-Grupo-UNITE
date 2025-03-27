
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { user, login, loading } = useAuth();
  const [email, setEmail] = useState('teste@teste.com.br');
  const [password, setPassword] = useState('12345');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return;
    
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-unite-50 to-white px-4 dark:from-slate-900 dark:to-slate-800">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-unite-200 to-unite-300 bg-clip-text text-transparent">
          Central de Agentes IA
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Grupo UNITE
        </p>
      </div>
      
      <div className="glass-card w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Login
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full"
                required
              />
            </div>
            
            <button
              type="submit"
              className="glass-button w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span className="ml-2">Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>Usuário de teste: teste@teste.com.br</p>
            <p>Senha: 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
