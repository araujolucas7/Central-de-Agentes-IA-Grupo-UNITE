
import { AgentCard } from '@/components/AgentCard';
import { useAuth } from '@/context/AuthContext';
import { fetchUserAgents } from '@/services/api';
import { Agent, Sector } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<Sector | 'all'>('all');
  
  useEffect(() => {
    const loadAgents = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userAgents = await fetchUserAgents(user.id);
        setAgents(userAgents);
      } catch (error) {
        console.error('Error loading agents:', error);
        toast.error('Erro ao carregar agentes');
      } finally {
        setLoading(false);
      }
    };
    
    loadAgents();
  }, [user]);
  
  // Get unique sectors from agents
  const sectors = Array.from(new Set(agents.map(agent => agent.sector)));
  
  // Filter agents by selected sector
  const filteredAgents = selectedSector === 'all'
    ? agents
    : agents.filter(agent => agent.sector === selectedSector);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Bem-vindo à Central de Agentes IA, {user?.name}
        </p>
      </div>
      
      {/* Sector filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSector('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedSector === 'all'
              ? 'bg-unite-200 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          Todos
        </button>
        
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedSector === sector
                ? 'bg-unite-200 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
            <p className="mt-4 text-sm text-slate-500">Carregando agentes...</p>
          </div>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="rounded-lg bg-slate-50 py-12 text-center dark:bg-slate-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Nenhum agente encontrado
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Não há agentes disponíveis para o setor selecionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
