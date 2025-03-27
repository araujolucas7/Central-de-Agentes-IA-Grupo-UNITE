
import { Agent, Message } from '@/types';
import { sendMessageToAgent } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  agent: Agent;
  initialMessages?: Message[];
  conversationId?: string;
}

export const ChatInterface = ({ 
  agent, 
  initialMessages = [], 
  conversationId 
}: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !user) return;
    
    try {
      setIsLoading(true);
      
      const result = await sendMessageToAgent(
        user.id,
        agent.slug,
        inputValue,
        currentConversationId
      );
      
      setCurrentConversationId(result.conversationId);
      
      // Add the user message and agent response to the chat
      setMessages(prev => [...prev, result.message, result.response]);
      
      // Clear the input
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-slate-50 shadow-sm dark:bg-slate-900/50">
      {/* Chat header */}
      <div className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-unite-200 text-white">
            <span className="text-sm font-medium">
              {agent.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{agent.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{agent.sector}</p>
          </div>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 subtle-scrollbar">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-unite-100/50 p-3">
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
                className="h-6 w-6 text-unite-300"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              Inicie uma conversa
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Envie uma mensagem para começar a conversar com {agent.name}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderType === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={
                  message.senderType === 'user'
                    ? 'chat-bubble-user'
                    : 'chat-bubble-agent'
                }
              >
                <div className="mb-1 flex justify-between text-xs opacity-70">
                  <span>
                    {message.senderType === 'user' ? 'Você' : agent.name}
                  </span>
                  <span className="ml-2">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="glass-input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="glass-button flex h-10 min-w-10 items-center justify-center"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
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
                className="lucide lucide-send-horizontal"
              >
                <path d="m3 3 3 9-3 9 19-9Z" />
                <path d="M6 12h16" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
