
import { Agent } from '@/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleStartChat = () => {
    navigate(`/chat/${agent.slug}`);
  };

  return (
    <div 
      className="glass-card group relative overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Agent avatar */}
      <div className="flex h-full flex-col p-5">
        <div className="flex items-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-unite-200/20 text-unite-300 transition-colors group-hover:bg-unite-200 group-hover:text-white">
            <span className="text-lg font-semibold">{getInitials(agent.name)}</span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-slate-900 dark:text-white">{agent.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {agent.sector}
            </p>
          </div>
        </div>
        
        {/* Agent description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          {agent.description}
        </p>
        
        {/* Chat button */}
        <div className="mt-auto">
          <button
            onClick={handleStartChat}
            className="glass-button w-full transition-transform duration-300"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(5px)',
              opacity: isHovered ? 1 : 0.9
            }}
          >
            Iniciar Conversa
          </button>
        </div>
      </div>
      
      {/* Background gradient effect */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-unite-100/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
};
