
import { Agent, Conversation, Message, Sector, User, UserRole } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Initial Admin User
export const initialAdmin: User = {
  id: 'admin-1',
  name: 'Administrador Inicial',
  email: 'teste@teste.com.br',
  role: UserRole.SUPER_ADMIN,
  sector: Sector.TECNOLOGIA,
  createdAt: new Date().toISOString()
};

// Mock Users
export const mockUsers: User[] = [
  initialAdmin,
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@unite.com.br',
    role: UserRole.USER,
    sector: Sector.MARKETING,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-2',
    name: 'Maria Souza',
    email: 'maria@unite.com.br',
    role: UserRole.USER,
    sector: Sector.FINANCEIRO,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-3',
    name: 'Pedro Oliveira',
    email: 'pedro@unite.com.br',
    role: UserRole.ADMIN,
    sector: Sector.RECURSOS_HUMANOS,
    createdAt: new Date().toISOString()
  }
];

// Mock Agents
export const mockAgents: Agent[] = [
  // Marketing
  {
    id: 'agent-1',
    name: 'Estrategista de Campanhas',
    description: 'Planejamento e otimização de campanhas de marketing',
    sector: Sector.MARKETING,
    slug: 'estrategista-campanhas'
  },
  {
    id: 'agent-2',
    name: 'Social Media',
    description: 'Geração de conteúdo e estratégias para redes sociais',
    sector: Sector.MARKETING,
    slug: 'social-media'
  },
  {
    id: 'agent-3',
    name: 'Copywriting Rápido',
    description: 'Textos persuasivos para campanhas e materiais',
    sector: Sector.MARKETING,
    slug: 'copywriting-rapido'
  },
  {
    id: 'agent-4',
    name: 'Análise de Concorrência',
    description: 'Benchmarking e análise competitiva',
    sector: Sector.MARKETING,
    slug: 'analise-concorrencia'
  },

  // Financeiro
  {
    id: 'agent-5',
    name: 'Relatórios Financeiros',
    description: 'Geração e análise de relatórios financeiros',
    sector: Sector.FINANCEIRO,
    slug: 'relatorios-financeiros'
  },
  {
    id: 'agent-6',
    name: 'Planejamento Orçamentário',
    description: 'Auxílio na criação e gestão de orçamentos',
    sector: Sector.FINANCEIRO,
    slug: 'planejamento-orcamentario'
  },
  {
    id: 'agent-7',
    name: 'Fluxo de Caixa',
    description: 'Análise e projeções de fluxo de caixa',
    sector: Sector.FINANCEIRO,
    slug: 'fluxo-caixa'
  },
  {
    id: 'agent-8',
    name: 'Gestão de Custos',
    description: 'Estratégias para otimização de custos',
    sector: Sector.FINANCEIRO,
    slug: 'gestao-custos'
  },

  // Recursos Humanos
  {
    id: 'agent-9',
    name: 'Recrutador Virtual',
    description: 'Auxílio em processos seletivos e triagem de candidatos',
    sector: Sector.RECURSOS_HUMANOS,
    slug: 'recrutador-virtual'
  },
  {
    id: 'agent-10',
    name: 'Clima Organizacional',
    description: 'Análise e estratégias para melhorar o ambiente de trabalho',
    sector: Sector.RECURSOS_HUMANOS,
    slug: 'clima-organizacional'
  },
  {
    id: 'agent-11',
    name: 'Plano de Treinamento',
    description: 'Criação de planos de desenvolvimento para colaboradores',
    sector: Sector.RECURSOS_HUMANOS,
    slug: 'plano-treinamento'
  },
  {
    id: 'agent-12',
    name: 'Gestor de Benefícios',
    description: 'Análise e sugestões para pacotes de benefícios',
    sector: Sector.RECURSOS_HUMANOS,
    slug: 'gestor-beneficios'
  },

  // Operações
  {
    id: 'agent-13',
    name: 'Projetos',
    description: 'Gestão e acompanhamento de projetos',
    sector: Sector.OPERACOES,
    slug: 'projetos'
  },
  {
    id: 'agent-14',
    name: 'Qualidade',
    description: 'Processos de qualidade e melhoria contínua',
    sector: Sector.OPERACOES,
    slug: 'qualidade'
  },
  {
    id: 'agent-15',
    name: 'Checklist Diário',
    description: 'Verificações diárias de operações',
    sector: Sector.OPERACOES,
    slug: 'checklist-diario'
  },
  {
    id: 'agent-16',
    name: 'Distribuidor de Tarefas',
    description: 'Organização e distribuição de tarefas na equipe',
    sector: Sector.OPERACOES,
    slug: 'distribuidor-tarefas'
  },

  // Vendas
  {
    id: 'agent-17',
    name: 'Previsão de Vendas',
    description: 'Análise e projeções de vendas',
    sector: Sector.VENDAS,
    slug: 'previsao-vendas'
  },
  {
    id: 'agent-18',
    name: 'Análise de Leads',
    description: 'Qualificação e estratégias para leads',
    sector: Sector.VENDAS,
    slug: 'analise-leads'
  },
  {
    id: 'agent-19',
    name: 'Script de Vendas',
    description: 'Criação de scripts persuasivos',
    sector: Sector.VENDAS,
    slug: 'script-vendas'
  },
  {
    id: 'agent-20',
    name: 'CRM Helper',
    description: 'Assistência para gestão de relacionamento com clientes',
    sector: Sector.VENDAS,
    slug: 'crm-helper'
  },

  // Tecnologia
  {
    id: 'agent-21',
    name: 'Suporte Técnico',
    description: 'Auxílio na resolução de problemas técnicos',
    sector: Sector.TECNOLOGIA,
    slug: 'suporte-tecnico'
  },
  {
    id: 'agent-22',
    name: 'Documentação',
    description: 'Criação e gestão de documentação técnica',
    sector: Sector.TECNOLOGIA,
    slug: 'documentacao'
  },
  {
    id: 'agent-23',
    name: 'Gerador de Testes',
    description: 'Criação de casos de teste para software',
    sector: Sector.TECNOLOGIA,
    slug: 'gerador-testes'
  },
  {
    id: 'agent-24',
    name: 'Incidentes',
    description: 'Gestão e resolução de incidentes',
    sector: Sector.TECNOLOGIA,
    slug: 'incidentes'
  }
];

// Mock Conversations and Messages
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userId: 'user-1',
    agentId: 'agent-1',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    lastMessageAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        content: 'Olá, preciso de ajuda com uma campanha de marketing',
        senderId: 'user-1',
        senderType: 'user',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        content: 'Olá! Estou aqui para ajudar com sua campanha. Pode me contar mais detalhes sobre o objetivo e público-alvo?',
        senderId: 'agent-1',
        senderType: 'agent',
        timestamp: new Date(Date.now() - 3550000).toISOString()
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        content: 'Quero aumentar as vendas do nosso novo produto para profissionais de TI',
        senderId: 'user-1',
        senderType: 'user',
        timestamp: new Date(Date.now() - 3500000).toISOString()
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        content: 'Ótimo! Para profissionais de TI, recomendo focar em canais como LinkedIn, fóruns especializados e eventos do setor. Podemos criar uma estratégia com conteúdo técnico relevante, demonstrações do produto e casos de sucesso. Qual é o principal diferencial do seu produto?',
        senderId: 'agent-1',
        senderType: 'agent',
        timestamp: new Date(Date.now() - 3450000).toISOString()
      }
    ]
  }
];

// Helper functions for mock API
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const authenticateUser = (email: string, password: string): User | null => {
  // In a real app, you'd check the password too
  if (email === 'teste@teste.com.br' && password === '12345') {
    return initialAdmin;
  }
  // For demo purposes, let any user in our mock data log in with any password
  const user = mockUsers.find(user => user.email === email);
  return user || null;
};

export const getAgentsBySector = (sector: Sector): Agent[] => {
  return mockAgents.filter(agent => agent.sector === sector);
};

export const getAllAgents = (): Agent[] => {
  return mockAgents;
};

export const getAgentById = (id: string): Agent | undefined => {
  return mockAgents.find(agent => agent.id === id);
};

export const getAgentBySlug = (slug: string): Agent | undefined => {
  return mockAgents.find(agent => agent.slug === slug);
};

export const getUserConversations = (userId: string): Conversation[] => {
  return mockConversations.filter(conv => conv.userId === userId);
};

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find(conv => conv.id === id);
};

export const createUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const newUser = {
    ...userData,
    id: `user-${mockUsers.length + 1}`,
    createdAt: new Date().toISOString()
  };
  mockUsers.push(newUser);
  return newUser;
};

export const sendMessageToAgent = async (agentSlug: string, message: string, conversationId?: string): Promise<{
  response: string;
  id_conversa: string;
}> => {
  // Simulate API call to agent webhook
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newConversationId = conversationId || uuidv4();
  
  // Mock response based on agent
  let response = "Desculpe, não entendi sua pergunta. Pode reformular?";
  
  const agent = getAgentBySlug(agentSlug);
  if (agent) {
    switch (agent.sector) {
      case Sector.MARKETING:
        response = "Baseado na sua solicitação, sugiro que desenvolvamos uma campanha focada em ROI e métricas claras de conversão. Vamos trabalhar em uma estratégia multiplataforma que combine conteúdo técnico e benefícios práticos do produto.";
        break;
      case Sector.FINANCEIRO:
        response = "Analisando sua situação financeira, recomendo focar em otimização de custos operacionais e renegociação de contratos com fornecedores. Podemos estabelecer KPIs específicos para acompanhar a evolução ao longo do próximo trimestre.";
        break;
      case Sector.RECURSOS_HUMANOS:
        response = "Para melhorar o engajamento dos colaboradores, sugiro implementar um programa de reconhecimento por metas atingidas e criar canais de feedback anônimo. Vamos desenvolver um cronograma de implementação em fases.";
        break;
      case Sector.OPERACOES:
        response = "Com base na sua descrição do fluxo de trabalho atual, identifico gargalos na etapa de aprovação. Sugiro automatizar esse processo e redistribuir responsabilidades para equilibrar melhor a carga de trabalho da equipe.";
        break;
      case Sector.VENDAS:
        response = "Após análise do histórico de vendas, recomendo segmentar os leads por tamanho de empresa e setor de atuação, criando abordagens personalizadas para cada grupo. Vamos priorizar os segmentos com maior taxa de conversão histórica.";
        break;
      case Sector.TECNOLOGIA:
        response = "Baseado no seu problema, sugiro implementar uma solução de monitoramento preventivo que identifique anomalias antes que se tornem incidentes críticos. Podemos começar com um teste piloto na infraestrutura principal.";
        break;
    }
  }
  
  return {
    response,
    id_conversa: newConversationId
  };
};
