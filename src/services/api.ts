import { Agent, AgentStats, Conversation, Message, Sector, User, UserRole, UserStats } from '@/types';
import { mockAgents, mockConversations, findUserByEmail, initialAdmin } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// User API
export const fetchUsers = async (): Promise<User[]> => {
  return mockUsers;
};

export const fetchUser = async (id: string): Promise<User | undefined> => {
  return mockUsers.find(user => user.id === id);
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const newUser: User = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...user,
  };
  // In a real app, we would add this to the database
  // mockUsers.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | undefined> => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return undefined;
  
  const updatedUser = { ...mockUsers[userIndex], ...userData };
  // In a real app, we would update this in the database
  // mockUsers[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return false;
  
  // In a real app, we would remove this from the database
  // mockUsers.splice(userIndex, 1);
  return true;
};

// Agent API
export const fetchAgents = async (): Promise<Agent[]> => {
  return mockAgents;
};

export const getAllAgents = async (): Promise<Agent[]> => {
  return mockAgents;
};

export const fetchAgent = async (id: string): Promise<Agent | undefined> => {
  return mockAgents.find(agent => agent.id === id);
};

export const fetchAgentById = async (id: string): Promise<Agent | undefined> => {
  return mockAgents.find(agent => agent.id === id);
};

export const fetchAgentBySlug = async (slug: string): Promise<Agent | undefined> => {
  return mockAgents.find(agent => agent.slug === slug);
};

export const fetchAgentsBySector = async (sector: Sector): Promise<Agent[]> => {
  return mockAgents.filter(agent => agent.sector === sector);
};

export const createAgent = async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
  const newAgent: Agent = {
    id: uuidv4(),
    ...agent,
  };
  // In a real app, we would add this to the database
  // mockAgents.push(newAgent);
  return newAgent;
};

export const updateAgent = async (id: string, agentData: Partial<Agent>): Promise<Agent | undefined> => {
  const agentIndex = mockAgents.findIndex(agent => agent.id === id);
  if (agentIndex === -1) return undefined;
  
  const updatedAgent = { ...mockAgents[agentIndex], ...agentData };
  // In a real app, we would update this in the database
  // mockAgents[agentIndex] = updatedAgent;
  return updatedAgent;
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  const agentIndex = mockAgents.findIndex(agent => agent.id === id);
  if (agentIndex === -1) return false;
  
  // In a real app, we would remove this from the database
  // mockAgents.splice(agentIndex, 1);
  return true;
};

// Conversation API
export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  return mockConversations.filter(conversation => conversation.userId === userId);
};

export const fetchConversation = async (id: string): Promise<Conversation | undefined> => {
  return mockConversations.find(conversation => conversation.id === id);
};

export const createConversation = async (userId: string, agentId: string): Promise<Conversation> => {
  const now = new Date().toISOString();
  const newConversation: Conversation = {
    id: uuidv4(),
    userId,
    agentId,
    messages: [],
    startedAt: now,
    lastMessageAt: now,
  };
  // In a real app, we would add this to the database
  // mockConversations.push(newConversation);
  return newConversation;
};

export const addMessageToConversation = async (
  conversationId: string,
  content: string,
  senderId: string,
  senderType: 'user' | 'agent'
): Promise<Message | undefined> => {
  const conversation = mockConversations.find(convo => convo.id === conversationId);
  if (!conversation) return undefined;
  
  const newMessage: Message = {
    id: uuidv4(),
    conversationId,
    content,
    senderId,
    senderType,
    timestamp: new Date().toISOString(),
  };
  
  // In a real app, we would add this to the database and update the conversation
  // conversation.messages.push(newMessage);
  // conversation.lastMessageAt = newMessage.timestamp;
  
  return newMessage;
};

// Message API
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const conversation = mockConversations.find(convo => convo.id === conversationId);
  if (!conversation) return [];
  return conversation.messages;
};

// Authentication API
export const login = async (email: string, password: string): Promise<User | null> => {
  // For demo purposes, let's use the findUserByEmail from mockData
  if (email === initialAdmin.email && password === '12345') {
    return initialAdmin;
  }
  
  const user = findUserByEmail(email);
  return user || null;
};

// Helper function for Dashboard
export const fetchUserAgents = async (userId: string): Promise<Agent[]> => {
  const user = await fetchUser(userId);
  if (!user) return [];
  
  // If user is admin or super admin, return all agents
  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
    return getAllAgents();
  }
  
  // Otherwise return agents for user's sector
  return fetchAgentsBySector(user.sector);
};

// Helper function for ConversationList and Statistics
export const fetchUserConversations = async (userId: string): Promise<Conversation[]> => {
  return fetchConversations(userId);
};

// Send message to agent and get response
export const sendMessageToAgent = async (
  userId: string,
  slug: string,
  message: string,
  conversationId?: string
): Promise<{response: Message, conversationId: string, message: Message}> => {
  // In a real app, this would send a request to the agent webhook
  // For now, we'll just simulate a response
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dummy response based on agent and message
  const agent = await fetchAgentBySlug(slug);
  if (!agent) {
    throw new Error("Agent not found");
  }
  
  // Create or get conversation
  let convo: Conversation;
  if (conversationId) {
    const existingConvo = await fetchConversation(conversationId);
    if (!existingConvo) {
      convo = await createConversation(userId, agent.id);
    } else {
      convo = existingConvo;
    }
  } else {
    convo = await createConversation(userId, agent.id);
  }
  
  // Create user message
  const userMessage: Message = {
    id: uuidv4(),
    conversationId: convo.id,
    content: message,
    senderId: userId,
    senderType: 'user',
    timestamp: new Date().toISOString(),
  };
  
  // Create a relevant response based on the agent's sector
  let responseText = `Como assistente do setor de ${agent?.sector || 'desconhecido'}, `;
  
  if (agent?.sector === Sector.MARKETING) {
    responseText += "posso ajudar com estratégias de marketing, campanhas e análise de concorrência.";
  } else if (agent?.sector === Sector.FINANCEIRO) {
    responseText += "posso ajudar com relatórios financeiros, orçamentos e análise de fluxo de caixa.";
  } else if (agent?.sector === Sector.RECURSOS_HUMANOS) {
    responseText += "posso ajudar com processos de recrutamento, clima organizacional e planos de treinamento.";
  } else if (agent?.sector === Sector.OPERACOES) {
    responseText += "posso ajudar com gestão de projetos, controle de qualidade e alocação de tarefas.";
  } else if (agent?.sector === Sector.VENDAS) {
    responseText += "posso ajudar com previsões de vendas, análise de leads e estratégias de vendas.";
  } else if (agent?.sector === Sector.TECNOLOGIA) {
    responseText += "posso ajudar com suporte técnico, documentação e resolução de incidentes.";
  } else {
    responseText += "posso ajudar a responder suas perguntas e fornecer assistência.";
  }
  
  // Add a contextual response to the user's message
  if (message.toLowerCase().includes('olá') || message.toLowerCase().includes('oi')) {
    responseText = `Olá! ${responseText}`;
  } else if (message.toLowerCase().includes('ajuda')) {
    responseText = `Claro, estou aqui para ajudar! ${responseText} Em que posso ser útil hoje?`;
  } else if (message.toLowerCase().includes('obrigado')) {
    responseText = "De nada! Estou sempre à disposição para ajudar. Tem mais alguma questão?";
  } else {
    responseText += " Vou analisar sua solicitação: \"" + message + "\" e voltar com uma resposta apropriada.";
  }
  
  // Create agent response message
  const agentResponseMessage: Message = {
    id: uuidv4(),
    conversationId: convo.id,
    content: responseText,
    senderId: agent.id,
    senderType: 'agent',
    timestamp: new Date().toISOString(),
  };
  
  return {
    response: agentResponseMessage,
    conversationId: convo.id,
    message: userMessage
  };
};

// Statistics API
export const getAgentStatistics = async (): Promise<AgentStats[]> => {
  // In a real app, this would query the database for usage statistics
  // We'll generate some mock stats based on our agents
  
  return mockAgents.map(agent => ({
    agentId: agent.id,
    agentName: agent.name,
    totalConversations: Math.floor(Math.random() * 100),
    totalMessages: Math.floor(Math.random() * 500),
    averageMessagesPerConversation: Math.floor(Math.random() * 10) + 2,
    userCount: Math.floor(Math.random() * 20) + 5,
  }));
};

export const getUserStatistics = async (): Promise<UserStats[]> => {
  // In a real app, this would query the database for usage statistics
  // We'll generate some mock stats based on our users
  
  // Since we don't have mockUsers defined here directly, let's create simple mock stats
  return [
    {
      userId: initialAdmin.id,
      userName: initialAdmin.name,
      totalConversations: Math.floor(Math.random() * 30),
      totalMessages: Math.floor(Math.random() * 200),
      agentsUsed: Math.floor(Math.random() * 5) + 1,
    }
  ];
};

// Mock users data (should be imported from mockData.ts in a real implementation)
const mockUsers = [initialAdmin];
