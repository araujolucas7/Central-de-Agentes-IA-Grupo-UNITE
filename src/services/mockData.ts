
import { Agent, Conversation, Message, Sector, User, UserRole } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.SUPER_ADMIN,
    sector: Sector.TECNOLOGIA,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: UserRole.USER,
    sector: Sector.MARKETING,
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Manager User',
    email: 'manager@example.com',
    role: UserRole.ADMIN,
    sector: Sector.FINANCEIRO,
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'HR User',
    email: 'hr@example.com',
    role: UserRole.USER,
    sector: Sector.RECURSOS_HUMANOS,
    created_at: '2023-01-04T00:00:00Z'
  }
];

// Mock agents
export const agents: Agent[] = [
  {
    id: '1',
    name: 'Marketing Expert',
    description: 'Especialista em estratégias de marketing e branding.',
    sector: Sector.MARKETING,
    slug: 'marketing-expert',
    avatar: '/agents/marketing.jpg'
  },
  {
    id: '2',
    name: 'Financial Advisor',
    description: 'Consultoria financeira para decisões de negócios.',
    sector: Sector.FINANCEIRO,
    slug: 'financial-advisor',
    avatar: '/agents/finance.jpg'
  },
  {
    id: '3',
    name: 'HR Assistant',
    description: 'Ajuda com gestão de pessoas e processos de RH.',
    sector: Sector.RECURSOS_HUMANOS,
    slug: 'hr-assistant',
    avatar: '/agents/hr.jpg'
  },
  {
    id: '4',
    name: 'Operations Manager',
    description: 'Otimização de processos operacionais.',
    sector: Sector.OPERACOES,
    slug: 'operations-manager',
    avatar: '/agents/operations.jpg'
  },
  {
    id: '5',
    name: 'Sales Consultant',
    description: 'Especialista em técnicas de vendas e negociação.',
    sector: Sector.VENDAS,
    slug: 'sales-consultant',
    avatar: '/agents/sales.jpg'
  },
  {
    id: '6',
    name: 'Tech Support',
    description: 'Suporte técnico e soluções de tecnologia.',
    sector: Sector.TECNOLOGIA,
    slug: 'tech-support',
    avatar: '/agents/tech.jpg'
  }
];

// Mock messages
export const messages: Message[] = [
  {
    id: '1',
    conversation_id: '1',
    content: 'Olá! Como posso ajudar com suas estratégias de marketing?',
    sender_id: '1', // Marketing Expert agent
    sender_type: 'agent',
    timestamp: '2023-05-01T10:00:00Z'
  },
  {
    id: '2',
    conversation_id: '1',
    content: 'Preciso de ajuda para criar uma campanha para um novo produto.',
    sender_id: '2', // Regular User
    sender_type: 'user',
    timestamp: '2023-05-01T10:05:00Z'
  },
  {
    id: '3',
    conversation_id: '1',
    content: 'Que tipo de produto você está lançando? Podemos começar definindo o público-alvo.',
    sender_id: '1', // Marketing Expert agent
    sender_type: 'agent',
    timestamp: '2023-05-01T10:10:00Z'
  },
  {
    id: '4',
    conversation_id: '1',
    content: 'É um aplicativo de produtividade para profissionais de marketing.',
    sender_id: '2', // Regular User
    sender_type: 'user',
    timestamp: '2023-05-01T10:15:00Z'
  }
];

// Mock conversations
export const conversations: Conversation[] = [
  {
    id: '1',
    user_id: '2', // Regular User
    agent_id: '1', // Marketing Expert
    messages: messages.filter(m => m.conversation_id === '1'),
    started_at: '2023-05-01T10:00:00Z',
    last_message_at: '2023-05-01T10:15:00Z'
  }
];

// Mock function to simulate login
export const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // This is just a simple simulation; in a real app, you would verify credentials securely
  const user = users.find(u => u.email === email);
  
  if (user && password === '12345') {
    return { ...user };
  }
  
  return null;
};

// Helper function to generate fake data for testing
export const generateMockConversation = (userId: string, agentId: string): Conversation => {
  const conversationId = uuidv4();
  
  const mockMessages: Message[] = [
    {
      id: uuidv4(),
      conversation_id: conversationId,
      content: 'Olá! Como posso ajudar você hoje?',
      sender_id: agentId,
      sender_type: 'agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: uuidv4(),
      conversation_id: conversationId,
      content: 'Preciso de algumas informações sobre esse assunto.',
      sender_id: userId,
      sender_type: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() // 25 minutes ago
    },
    {
      id: uuidv4(),
      conversation_id: conversationId,
      content: 'Claro, ficarei feliz em ajudar. Que informações você precisa?',
      sender_id: agentId,
      sender_type: 'agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() // 20 minutes ago
    }
  ];
  
  return {
    id: conversationId,
    user_id: userId,
    agent_id: agentId,
    messages: mockMessages,
    started_at: mockMessages[0].timestamp,
    last_message_at: mockMessages[mockMessages.length - 1].timestamp
  };
};
