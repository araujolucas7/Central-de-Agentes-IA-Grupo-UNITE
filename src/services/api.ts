import { Agent, AgentStats, Conversation, Message, Sector, User, UserRole, UserStats } from '@/types';
import { initialAdmin } from './mockData';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// User API
export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data as User[];
};

export const fetchUser = async (id: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching user:', error);
    return undefined;
  }
  
  return data as User;
};

export const createUser = async (name: string, email: string, password: string, sector: Sector, isSuperAdmin: boolean = false): Promise<User> => {
  let role = UserRole.USER;
  if (isSuperAdmin) {
    role = UserRole.SUPER_ADMIN;
  } else if (password === 'admin') { // Simple check for admin role
    role = UserRole.ADMIN;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{
      name,
      email,
      role,
      sector
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  return data as User;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user:', error);
    return undefined;
  }
  
  return data as User;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }
  
  return true;
};

// Agent API
export const fetchAgents = async (): Promise<Agent[]> => {
  const { data, error } = await supabase.from('agents').select('*');
  
  if (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
  
  return data as Agent[];
};

export const getAllAgents = async (): Promise<Agent[]> => {
  return fetchAgents();
};

export const fetchAgent = async (id: string): Promise<Agent | undefined> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching agent:', error);
    return undefined;
  }
  
  return data as Agent;
};

export const fetchAgentById = async (id: string): Promise<Agent | undefined> => {
  return fetchAgent(id);
};

export const fetchAgentBySlug = async (slug: string): Promise<Agent | undefined> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching agent by slug:', error);
    return undefined;
  }
  
  return data as Agent;
};

export const fetchAgentsBySector = async (sector: Sector): Promise<Agent[]> => {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('sector', sector);
  
  if (error) {
    console.error('Error fetching agents by sector:', error);
    throw error;
  }
  
  return data as Agent[];
};

export const createAgent = async (agent: Omit<Agent, 'id'>): Promise<Agent> => {
  const { data, error } = await supabase
    .from('agents')
    .insert([{
      name: agent.name,
      description: agent.description,
      sector: agent.sector,
      slug: agent.slug,
      avatar: agent.avatar
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
  
  return data as Agent;
};

export const updateAgent = async (id: string, agentData: Partial<Agent>): Promise<Agent | undefined> => {
  const { data, error } = await supabase
    .from('agents')
    .update(agentData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating agent:', error);
    return undefined;
  }
  
  return data as Agent;
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('agents')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting agent:', error);
    return false;
  }
  
  return true;
};

// Conversation API
export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      messages:messages(*)
    `)
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
  
  return data as unknown as Conversation[];
};

export const fetchConversation = async (id: string): Promise<Conversation | undefined> => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      messages:messages(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching conversation:', error);
    return undefined;
  }
  
  return data as unknown as Conversation;
};

export const createConversation = async (userId: string, agentId: string): Promise<Conversation> => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('conversations')
    .insert([{
      user_id: userId,
      agent_id: agentId,
      started_at: now,
      last_message_at: now
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
  
  return { ...data, messages: [] } as Conversation;
};

export const addMessageToConversation = async (
  conversationId: string,
  content: string,
  senderId: string,
  senderType: 'user' | 'agent'
): Promise<Message | undefined> => {
  // First, insert the message
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      content,
      sender_id: senderId,
      sender_type: senderType
    }])
    .select()
    .single();
  
  if (messageError) {
    console.error('Error adding message to conversation:', messageError);
    return undefined;
  }
  
  // Then, update the conversation's last_message_at field
  const { error: updateError } = await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  
  if (updateError) {
    console.error('Error updating conversation last_message_at:', updateError);
  }
  
  return messageData as Message;
};

// Message API
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true });
  
  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  return data as Message[];
};

// Authentication API
export const login = async (email: string, password: string): Promise<User | null> => {
  // For demo purposes, let's use the findUserByEmail from mockData
  if (email === initialAdmin.email && password === '12345') {
    return initialAdmin;
  }
  
  // In a real app with Supabase auth, you would use:
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email,
  //   password,
  // });
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    console.error('Error logging in:', error);
    return null;
  }
  
  return data as User;
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
  // Get the agent
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
  const userMessage = await addMessageToConversation(
    convo.id,
    message,
    userId,
    'user'
  );
  
  if (!userMessage) {
    throw new Error("Failed to create user message");
  }
  
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
  const agentResponseMessage = await addMessageToConversation(
    convo.id,
    responseText,
    agent.id,
    'agent'
  );
  
  if (!agentResponseMessage) {
    throw new Error("Failed to create agent response message");
  }
  
  return {
    response: agentResponseMessage,
    conversationId: convo.id,
    message: userMessage
  };
};

// Statistics API
export const getAgentStatistics = async (): Promise<AgentStats[]> => {
  // In a real app, this would query the database for usage statistics
  // For now, let's generate some statistics based on our database data
  
  const agents = await fetchAgents();
  const agentStats: AgentStats[] = [];
  
  for (const agent of agents) {
    // Count conversations for this agent
    const { count: totalConversations, error: convError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agent.id);
    
    if (convError) {
      console.error('Error counting conversations:', convError);
      continue;
    }
    
    // Count messages for this agent
    const { count: totalMessages, error: msgError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', agent.id)
      .eq('sender_type', 'agent');
    
    if (msgError) {
      console.error('Error counting messages:', msgError);
      continue;
    }
    
    // Count unique users who have talked to this agent
    const { data: uniqueUsers, error: userError } = await supabase
      .from('conversations')
      .select('user_id')
      .eq('agent_id', agent.id);
    
    if (userError) {
      console.error('Error counting unique users:', userError);
      continue;
    }
    
    const userSet = new Set(uniqueUsers.map(u => u.user_id));
    
    agentStats.push({
      agentId: agent.id,
      agentName: agent.name,
      totalConversations: totalConversations || 0,
      totalMessages: totalMessages || 0,
      averageMessagesPerConversation: totalConversations ? (totalMessages || 0) / totalConversations : 0,
      userCount: userSet.size
    });
  }
  
  return agentStats;
};

export const getUserStatistics = async (): Promise<UserStats[]> => {
  // In a real app, this would query the database for usage statistics
  
  const users = await fetchUsers();
  const userStats: UserStats[] = [];
  
  for (const user of users) {
    // Count conversations for this user
    const { count: totalConversations, error: convError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (convError) {
      console.error('Error counting conversations:', convError);
      continue;
    }
    
    // Count messages for this user
    const { count: totalMessages, error: msgError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', user.id)
      .eq('sender_type', 'user');
    
    if (msgError) {
      console.error('Error counting messages:', msgError);
      continue;
    }
    
    // Count unique agents this user has talked to
    const { data: uniqueAgents, error: agentError } = await supabase
      .from('conversations')
      .select('agent_id')
      .eq('user_id', user.id);
    
    if (agentError) {
      console.error('Error counting unique agents:', agentError);
      continue;
    }
    
    const agentSet = new Set(uniqueAgents.map(a => a.agent_id));
    
    userStats.push({
      userId: user.id,
      userName: user.name,
      totalConversations: totalConversations || 0,
      totalMessages: totalMessages || 0,
      agentsUsed: agentSet.size
    });
  }
  
  return userStats;
};
