
export enum UserRole {
  USER = 'USUARIO_COMUM',
  ADMIN = 'ADMINISTRADOR',
  SUPER_ADMIN = 'ADMINISTRADOR_GERAL'
}

export enum Sector {
  MARKETING = 'Marketing',
  FINANCEIRO = 'Financeiro',
  RECURSOS_HUMANOS = 'Recursos Humanos',
  OPERACOES = 'Operações',
  VENDAS = 'Vendas',
  TECNOLOGIA = 'Tecnologia'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sector: Sector;
  created_at: string; // Changed from createdAt to match database
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  sector: Sector;
  slug: string;
  avatar?: string;
}

export interface Message {
  id: string;
  conversation_id: string; // Changed from conversationId to match database
  content: string;
  sender_id: string; // Changed from senderId to match database
  sender_type: 'user' | 'agent'; // Changed from senderType to match database
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string; // Changed from userId to match database
  agent_id: string; // Changed from agentId to match database
  messages: Message[];
  started_at: string; // Changed from startedAt to match database
  last_message_at: string; // Changed from lastMessageAt to match database
}

export interface AgentStats {
  agentId: string;
  agentName: string;
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  userCount: number;
}

export interface UserStats {
  userId: string;
  userName: string;
  totalConversations: number;
  totalMessages: number;
  agentsUsed: number;
}
