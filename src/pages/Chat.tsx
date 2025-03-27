
import { ChatInterface } from '@/components/ChatInterface';
import { fetchAgentBySlug } from '@/services/api';
import { Agent } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {
  const { slug } = useParams<{ slug: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAgent = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const agentData = await fetchAgentBySlug(slug);
        
        if (!agentData) {
          toast.error('Agente não encontrado');
          navigate('/');
          return;
        }
        
        setAgent(agentData);
      } catch (error) {
        console.error('Error loading agent:', error);
        toast.error('Erro ao carregar agente');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadAgent();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex h-full min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
          <p className="mt-4 text-sm text-slate-500">Carregando agente...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex h-full min-h-[70vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Agente não encontrado
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          O agente solicitado não está disponível
        </p>
        <button
          onClick={() => navigate('/')}
          className="glass-button mt-4"
        >
          Voltar para Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-9rem)]">
      <div className="flex h-full flex-col">
        <ChatInterface agent={agent} />
      </div>
    </div>
  );
};

export default Chat;
