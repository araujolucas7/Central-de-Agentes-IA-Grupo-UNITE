
import { useAuth } from '@/context/AuthContext';
import { fetchAgentById, fetchUserConversations } from '@/services/api';
import { Agent, Conversation } from '@/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ConversationList = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [agents, setAgents] = useState<Record<string, Agent>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await fetchUserConversations(user.id);
        setConversations(data);
        
        // Load agent details for each conversation
        const agentMap: Record<string, Agent> = {};
        for (const conversation of data) {
          if (!agentMap[conversation.agent_id]) {
            const agent = await fetchAgentById(conversation.agent_id);
            if (agent) {
              agentMap[conversation.agent_id] = agent;
            }
          }
        }
        setAgents(agentMap);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Erro ao carregar conversas');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    const messages = conversation.messages;
    if (!messages.length) return 'Sem mensagens';
    
    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.substring(0, 60);
    return preview.length < lastMessage.content.length
      ? `${preview}...`
      : preview;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Histórico de Conversas
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Veja suas conversas anteriores com os agentes de IA
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
            <p className="mt-4 text-sm text-slate-500">Carregando conversas...</p>
          </div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center shadow-sm dark:bg-slate-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Nenhuma conversa encontrada
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Você ainda não iniciou nenhuma conversa com os agentes.
          </p>
          <Link to="/" className="glass-button mt-4 inline-block">
            Explorar Agentes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => {
            const agent = agents[conversation.agent_id];
            if (!agent) return null;
            
            return (
              <Link
                key={conversation.id}
                to={`/chat/${agent.slug}?conversation=${conversation.id}`}
                className="block transition-all hover:shadow-md"
              >
                <div className="glass-card flex items-start p-4">
                  <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-unite-200 text-white">
                    <span className="text-sm font-medium">
                      {agent.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900 truncate dark:text-white">
                        {agent.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(conversation.last_message_at)}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm text-slate-600 truncate dark:text-slate-300">
                      {getLastMessagePreview(conversation)}
                    </p>
                    
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-unite-100/20 text-unite-400">
                        {agent.sector}
                      </span>
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                        {conversation.messages.length} mensagens
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 self-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
