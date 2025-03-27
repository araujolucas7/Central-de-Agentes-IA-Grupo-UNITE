
import { Agent, Conversation, Message, Sector, User, UserRole } from '@/types';
import { 
  authenticateUser, 
  createUser, 
  getAllAgents, 
  getAgentById, 
  getAgentsBySector, 
  getAgentBySlug,
  getConversationById, 
  getUserConversations, 
  mockAgents, 
  mockUsers, 
  mockConversations,
  sendMessageToAgent as mockSendMessageToAgent
} from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Later this would be replaced with real API calls to Supabase

export const login = async (email: string, password: string): Promise<User | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  return authenticateUser(email, password);
};

export const register = async (
  name: string,
  email: string,
  password: string,
  sector: Sector,
  isAdmin: boolean
): Promise<User> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return createUser({
    name,
    email,
    role: isAdmin ? UserRole.SUPER_ADMIN : UserRole.USER,
    sector
  });
};

export const fetchUserAgents = async (userId: string): Promise<Agent[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Admins can see all agents
  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
    return getAllAgents();
  }
  
  // Regular users can only see agents from their sector
  return getAgentsBySector(user.sector);
};

export const fetchAgent = async (agentId: string): Promise<Agent | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return getAgentById(agentId) || null;
};

export const fetchAgentBySlug = async (slug: string): Promise<Agent | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return getAgentBySlug(slug) || null;
};

export const fetchUserConversations = async (userId: string): Promise<Conversation[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return getUserConversations(userId);
};

export const fetchConversation = async (conversationId: string): Promise<Conversation | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return getConversationById(conversationId) || null;
};

export const sendMessageToAgent = async (
  userId: string,
  agentSlug: string,
  message: string,
  conversationId?: string
): Promise<{ 
  message: Message, 
  response: Message,
  conversationId: string 
}> => {
  // In a real app, this would call the agent's webhook
  const result = await mockSendMessageToAgent(agentSlug, message, conversationId);
  
  // Create or find conversation
  let conversation: Conversation;
  const agent = await fetchAgentBySlug(agentSlug);
  
  if (!agent) {
    throw new Error('Agent not found');
  }
  
  if (conversationId) {
    const existingConversation = mockConversations.find(c => c.id === conversationId);
    if (existingConversation) {
      conversation = existingConversation;
    } else {
      conversation = {
        id: result.id_conversa,
        userId,
        agentId: agent.id,
        startedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messages: []
      };
      mockConversations.push(conversation);
    }
  } else {
    conversation = {
      id: result.id_conversa,
      userId,
      agentId: agent.id,
      startedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      messages: []
    };
    mockConversations.push(conversation);
  }
  
  // Create user message
  const userMessage: Message = {
    id: `msg-${uuidv4()}`,
    conversationId: conversation.id,
    content: message,
    senderId: userId,
    senderType: 'user',
    timestamp: new Date().toISOString()
  };
  
  // Create agent response
  const agentMessage: Message = {
    id: `msg-${uuidv4()}`,
    conversationId: conversation.id,
    content: result.response,
    senderId: agent.id,
    senderType: 'agent',
    timestamp: new Date(Date.now() + 500).toISOString() // slightly later
  };
  
  // Add messages to conversation
  conversation.messages.push(userMessage);
  conversation.messages.push(agentMessage);
  conversation.lastMessageAt = agentMessage.timestamp;
  
  return {
    message: userMessage,
    response: agentMessage,
    conversationId: conversation.id
  };
};

export const fetchUsers = async (): Promise<User[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockUsers;
};

export const fetchUserById = async (userId: string): Promise<User | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockUsers.find(u => u.id === userId) || null;
};

export const updateUser = async (userId: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser = {
    ...mockUsers[userIndex],
    ...data
  };
  
  mockUsers[userIndex] = updatedUser;
  
  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  mockUsers.splice(userIndex, 1);
};

export const createAgent = async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newAgent: Agent = {
    ...agent,
    id: `agent-${mockAgents.length + 1}`
  };
  
  mockAgents.push(newAgent);
  
  return newAgent;
};

export const updateAgent = async (agentId: string, data: Partial<Omit<Agent, 'id'>>): Promise<Agent> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const agentIndex = mockAgents.findIndex(a => a.id === agentId);
  
  if (agentIndex === -1) {
    throw new Error('Agent not found');
  }
  
  const updatedAgent = {
    ...mockAgents[agentIndex],
    ...data
  };
  
  mockAgents[agentIndex] = updatedAgent;
  
  return updatedAgent;
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const agentIndex = mockAgents.findIndex(a => a.id === agentId);
  
  if (agentIndex === -1) {
    throw new Error('Agent not found');
  }
  
  mockAgents.splice(agentIndex, 1);
};
