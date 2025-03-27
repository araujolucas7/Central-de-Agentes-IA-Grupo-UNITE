
import { useAuth } from '@/context/AuthContext';
import { Agent, Conversation, User, UserRole } from '@/types';
import { fetchUsers, getAllAgents, fetchUserConversations } from '@/services/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AgentStats {
  agentId: string;
  agentName: string;
  totalConversations: number;
  totalMessages: number;
}

interface UserStats {
  userId: string;
  userName: string;
  totalConversations: number;
  totalMessages: number;
}

interface SectorStats {
  sector: string;
  conversationCount: number;
}

const COLORS = ['#9b87f5', '#7e69ab', '#5a4f8d', '#3b356e', '#1a1f2c', '#8E9196'];

const Statistics = () => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const [agentStats, setAgentStats] = useState<AgentStats[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [sectorStats, setSectorStats] = useState<SectorStats[]>([]);
  
  // Make sure only super admin can access this page
  if (currentUser?.role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="flex h-full min-h-[70vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Acesso Restrito
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Apenas administradores gerais podem acessar esta página
        </p>
      </div>
    );
  }
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all data
        const [usersData, agentsData] = await Promise.all([
          fetchUsers(),
          getAllAgents()
        ]);
        
        setUsers(usersData);
        setAgents(agentsData);
        
        // Load all conversations for all users
        const allConversations: Conversation[] = [];
        for (const user of usersData) {
          const userConversations = await fetchUserConversations(user.id);
          allConversations.push(...userConversations);
        }
        
        setConversations(allConversations);
        
        // Process statistics
        calculateStats(usersData, agentsData, allConversations);
      } catch (error) {
        console.error('Error loading statistics data:', error);
        toast.error('Erro ao carregar dados estatísticos');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const calculateStats = (
    users: User[],
    agents: Agent[],
    conversations: Conversation[]
  ) => {
    // Calculate agent statistics
    const agentStatsMap = new Map<string, AgentStats>();
    
    agents.forEach(agent => {
      agentStatsMap.set(agent.id, {
        agentId: agent.id,
        agentName: agent.name,
        totalConversations: 0,
        totalMessages: 0
      });
    });
    
    // Calculate user statistics
    const userStatsMap = new Map<string, UserStats>();
    
    users.forEach(user => {
      userStatsMap.set(user.id, {
        userId: user.id,
        userName: user.name,
        totalConversations: 0,
        totalMessages: 0
      });
    });
    
    // Calculate sector statistics
    const sectorStatsMap = new Map<string, SectorStats>();
    
    agents.forEach(agent => {
      const sector = agent.sector;
      if (!sectorStatsMap.has(sector)) {
        sectorStatsMap.set(sector, {
          sector,
          conversationCount: 0
        });
      }
    });
    
    // Process conversations
    conversations.forEach(conversation => {
      // Update agent stats
      const agentStat = agentStatsMap.get(conversation.agent_id);
      if (agentStat) {
        agentStat.totalConversations++;
        agentStat.totalMessages += conversation.messages.length;
      }
      
      // Update user stats
      const userStat = userStatsMap.get(conversation.user_id);
      if (userStat) {
        userStat.totalConversations++;
        userStat.totalMessages += conversation.messages.length;
      }
      
      // Update sector stats
      const agent = agents.find(a => a.id === conversation.agent_id);
      if (agent) {
        const sectorStat = sectorStatsMap.get(agent.sector);
        if (sectorStat) {
          sectorStat.conversationCount++;
        }
      }
    });
    
    // Convert maps to arrays and sort by usage
    setAgentStats(
      Array.from(agentStatsMap.values())
        .sort((a, b) => b.totalConversations - a.totalConversations)
    );
    
    setUserStats(
      Array.from(userStatsMap.values())
        .sort((a, b) => b.totalConversations - a.totalConversations)
    );
    
    setSectorStats(
      Array.from(sectorStatsMap.values())
        .sort((a, b) => b.conversationCount - a.conversationCount)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
          <p className="mt-4 text-sm text-slate-500">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Estatísticas
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Análise de uso da plataforma por agentes, usuários e setores
        </p>
      </div>
      
      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Total de Usuários
          </h3>
          <p className="mt-2 text-3xl font-bold text-unite-300">{users.length}</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Total de Agentes
          </h3>
          <p className="mt-2 text-3xl font-bold text-unite-300">{agents.length}</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Total de Conversas
          </h3>
          <p className="mt-2 text-3xl font-bold text-unite-300">{conversations.length}</p>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Total de Mensagens
          </h3>
          <p className="mt-2 text-3xl font-bold text-unite-300">
            {conversations.reduce((total, conv) => total + conv.messages.length, 0)}
          </p>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Agent usage chart */}
        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
            Uso por Agente
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agentStats.slice(0, 10)} // Show top 10 agents
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="agentName" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalConversations" name="Conversas" fill="#9b87f5" />
                <Bar dataKey="totalMessages" name="Mensagens" fill="#7e69ab" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* User usage chart */}
        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
            Uso por Usuário
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userStats.slice(0, 10)} // Show top 10 users
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="userName" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalConversations" name="Conversas" fill="#9b87f5" />
                <Bar dataKey="totalMessages" name="Mensagens" fill="#7e69ab" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Sector distribution chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-white">
            Distribuição por Setor
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="conversationCount"
                  nameKey="sector"
                  label={({ sector, conversationCount, percent }) => 
                    `${sector}: ${conversationCount} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {sectorStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
