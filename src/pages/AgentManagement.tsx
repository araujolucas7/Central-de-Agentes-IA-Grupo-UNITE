
import { useAuth } from '@/context/AuthContext';
import { createAgent, deleteAgent, getAllAgents, updateAgent } from '@/services/api';
import { Agent, Sector } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AgentManagement = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState<Sector>(Sector.MARKETING);
  const [slug, setSlug] = useState('');
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  
  useEffect(() => {
    loadAgents();
  }, []);
  
  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await getAllAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Erro ao carregar agentes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const newAgent = await createAgent({
        name,
        description,
        sector,
        slug: slug.toLowerCase().replace(/\s+/g, '-')
      });
      
      setAgents(prev => [...prev, newAgent]);
      resetForm();
      setIsCreating(false);
      
      toast.success('Agente criado com sucesso!');
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Erro ao criar agente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAgentId) return;
    
    try {
      setLoading(true);
      
      const updatedAgent = await updateAgent(editingAgentId, {
        name,
        description,
        sector,
        slug: slug.toLowerCase().replace(/\s+/g, '-')
      });
      
      setAgents(prev => prev.map(a => a.id === editingAgentId ? updatedAgent : a));
      resetForm();
      setIsEditing(false);
      setEditingAgentId(null);
      
      toast.success('Agente atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('Erro ao atualizar agente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este agente?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteAgent(agentId);
      setAgents(prev => prev.filter(a => a.id !== agentId));
      toast.success('Agente excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Erro ao excluir agente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditAgent = (agent: Agent) => {
    setName(agent.name);
    setDescription(agent.description);
    setSector(agent.sector);
    setSlug(agent.slug);
    setEditingAgentId(agent.id);
    setIsEditing(true);
    setIsCreating(false);
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setSector(Sector.MARKETING);
    setSlug('');
  };
  
  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
    setEditingAgentId(null);
  };
  
  const handleCancelCreate = () => {
    resetForm();
    setIsCreating(false);
  };
  
  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name if slug is empty or was auto-generated
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, '-')) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gerenciamento de Agentes
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Gerencie os agentes de IA da plataforma
          </p>
        </div>
        
        {!isCreating && !isEditing && (
          <button
            onClick={() => {
              setIsCreating(true);
              setIsEditing(false);
              resetForm();
            }}
            className="glass-button"
          >
            Novo Agente
          </button>
        )}
      </div>
      
      {/* Agent form - create or edit */}
      {(isCreating || isEditing) && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            {isEditing ? 'Editar Agente' : 'Criar Novo Agente'}
          </h2>
          
          <form onSubmit={isEditing ? handleUpdateAgent : handleCreateAgent} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Setor
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector)}
                  className="glass-input w-full"
                  required
                >
                  {Object.values(Sector).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Slug (para URL)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">https://n8n.une.cx/webhook/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="glass-input w-full"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={isEditing ? handleCancelEdit : handleCancelCreate}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="glass-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span className="ml-2">Processando...</span>
                  </div>
                ) : isEditing ? (
                  'Salvar Alterações'
                ) : (
                  'Criar Agente'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Agents list */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Descrição
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Setor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Webhook
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
                    </div>
                    <p className="mt-2">Carregando agentes...</p>
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    Nenhum agente encontrado
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      {agent.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {agent.description.length > 60
                        ? `${agent.description.substring(0, 60)}...`
                        : agent.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-unite-100/20 text-unite-400">
                        {agent.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-700">
                        {`/webhook/${agent.slug}`}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="rounded-md bg-red-100 p-1.5 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
