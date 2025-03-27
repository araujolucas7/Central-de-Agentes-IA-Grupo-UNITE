
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
  createdAt: string;
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
  conversationId: string;
  content: string;
  senderId: string;
  senderType: 'user' | 'agent';
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  messages: Message[];
  startedAt: string;
  lastMessageAt: string;
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
