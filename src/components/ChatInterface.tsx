import { useAuth } from '@/context/AuthContext';
import { addMessageToConversation, fetchConversation, createConversation } from '@/services/api';
import { Agent, Message } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  agent: Agent;
}

export const ChatInterface = ({ agent }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const convId = queryParams.get('conversation');
    
    if (convId) {
      setConversationId(convId);
      loadExistingConversation(convId);
    } else {
      setMessages([]);
      setConversationId(null);
    }
  }, [location.search]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const loadExistingConversation = async (conversationId: string) => {
    if (!user) return;
    
    try {
      setLoadingConversation(true);
      const conversation = await fetchConversation(conversationId);
      
      if (!conversation) {
        toast.error('Conversa não encontrada');
        navigate(`/chat/${agent.slug}`);
        return;
      }
      
      setMessages(conversation.messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Erro ao carregar conversa');
    } finally {
      setLoadingConversation(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      setLoading(true);
      
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const newConversation = await createConversation(user.id, agent.id);
        currentConversationId = newConversation.id;
        setConversationId(currentConversationId);
        
        navigate(`/chat/${agent.slug}?conversation=${currentConversationId}`, { replace: true });
      }
      
      const userMessage = await addMessageToConversation(
        currentConversationId,
        newMessage,
        user.id,
        'user'
      );
      
      if (!userMessage) {
        throw new Error('Failed to send message');
      }
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setNewMessage('');
      
      setTimeout(async () => {
        let responseContent = '';
        
        switch (agent.sector) {
          case 'Marketing':
            responseContent = 'Estou analisando sua estratégia de marketing. Podemos otimizar seu conteúdo para aumentar o engajamento.';
            break;
          case 'Financeiro':
            responseContent = 'Com base nas informações financeiras, recomendo revisar seu fluxo de caixa para identificar oportunidades de economia.';
            break;
          case 'Recursos Humanos':
            responseContent = 'Posso ajudar a desenvolver um plano de treinamento para aumentar a satisfação e retenção de funcionários.';
            break;
          case 'Operações':
            responseContent = 'Vamos revisar seus processos operacionais para identificar pontos de melhoria e aumentar a eficiência.';
            break;
          case 'Vendas':
            responseContent = 'Analisando seu funil de vendas, vejo oportunidades para aumentar a taxa de conversão nas etapas finais.';
            break;
          case 'Tecnologia':
            responseContent = 'Posso recomendar algumas tecnologias que poderiam automatizar processos e aumentar a produtividade da sua equipe.';
            break;
          default:
            responseContent = 'Compreendo sua questão. Estou analisando as possibilidades para fornecer a melhor resposta.';
        }
        
        const agentMessage = await addMessageToConversation(
          currentConversationId,
          responseContent,
          agent.id,
          'agent'
        );
        
        if (!agentMessage) {
          throw new Error('Failed to receive agent response');
        }
        
        setMessages(prevMessages => [...prevMessages, agentMessage]);
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-unite-200 text-white">
            <span className="text-sm font-medium">
              {agent.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {agent.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {agent.sector}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-900/50">
        {loadingConversation ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
              <p className="mt-2 text-sm text-slate-500">Carregando conversa...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="rounded-full bg-unite-100/30 p-3">
              <div className="rounded-full bg-unite-200 p-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              Inicie uma conversa com {agent.name}
            </h3>
            <p className="mt-2 max-w-md text-center text-slate-600 dark:text-slate-400">
              {agent.description}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender_type === 'user'
                      ? 'bg-unite-200 text-white'
                      : 'bg-white dark:bg-slate-800 dark:text-white shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div
                    className={`mt-1 text-right text-xs ${
                      message.sender_type === 'user'
                        ? 'text-white/70'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-end gap-2">
          <textarea
            className="glass-input min-h-[60px] flex-1 resize-none"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || loadingConversation}
          />
          <button
            className="glass-button h-[60px] px-4"
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim() || loadingConversation}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
