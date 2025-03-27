import { useAuth } from '@/context/AuthContext';
import { createUser, deleteUser, fetchUsers, updateUser } from '@/services/api';
import { Sector, User, UserRole } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sector, setSector] = useState<Sector>(Sector.MARKETING);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Determine if current user can edit super admins
  const canEditSuperAdmins = currentUser?.role === UserRole.SUPER_ADMIN;
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Determine role based on checkbox selections
      let role = UserRole.USER;
      if (isSuperAdmin) {
        role = UserRole.SUPER_ADMIN;
      } else if (isAdmin) {
        role = UserRole.ADMIN;
      }
      
      const newUser = await createUser(name, email, password, sector, isSuperAdmin);
      
      setUsers(prev => [...prev, newUser]);
      resetForm();
      setIsCreating(false);
      
      toast.success('Usuário criado com sucesso!');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUserId) return;
    
    try {
      setLoading(true);
      
      // Determine role based on checkbox selections
      let role = UserRole.USER;
      if (isSuperAdmin) {
        role = UserRole.SUPER_ADMIN;
      } else if (isAdmin) {
        role = UserRole.ADMIN;
      }
      
      const updatedUser = await updateUser(editingUserId, {
        name,
        email,
        role,
        sector
      });
      
      setUsers(prev => prev.map(u => u.id === editingUserId ? updatedUser : u));
      resetForm();
      setIsEditing(false);
      setEditingUserId(null);
      
      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setSector(user.sector);
    setIsAdmin(user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN);
    setIsSuperAdmin(user.role === UserRole.SUPER_ADMIN);
    setEditingUserId(user.id);
    setIsEditing(true);
    setIsCreating(false);
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setSector(Sector.MARKETING);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };
  
  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);
    setEditingUserId(null);
  };
  
  const handleCancelCreate = () => {
    resetForm();
    setIsCreating(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gerenciamento de Usuários
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Gerencie os usuários da plataforma
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
            Novo Usuário
          </button>
        )}
      </div>
      
      {/* User form - create or edit */}
      {(isCreating || isEditing) && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            {isEditing ? 'Editar Usuário' : 'Criar Novo Usuário'}
          </h2>
          
          <form onSubmit={isEditing ? handleUpdateUser : handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>
              
              {isCreating && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full"
                    required={isCreating}
                  />
                </div>
              )}
              
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
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => {
                    setIsAdmin(e.target.checked);
                    if (!e.target.checked) {
                      setIsSuperAdmin(false);
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-unite-200 focus:ring-unite-200"
                />
                <label
                  htmlFor="isAdmin"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Este usuário é Administrador?
                </label>
              </div>
              
              {canEditSuperAdmins && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSuperAdmin"
                    checked={isSuperAdmin}
                    onChange={(e) => {
                      setIsSuperAdmin(e.target.checked);
                      if (e.target.checked) {
                        setIsAdmin(true);
                      }
                    }}
                    disabled={!isAdmin}
                    className="h-4 w-4 rounded border-gray-300 text-unite-200 focus:ring-unite-200"
                  />
                  <label
                    htmlFor="isSuperAdmin"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Este usuário é Administrador Geral?
                  </label>
                </div>
              )}
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
                  'Criar Usuário'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Users list */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Setor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                  Função
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-unite-200"></div>
                    </div>
                    <p className="mt-2">Carregando usuários...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {user.sector}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.role === UserRole.SUPER_ADMIN
                            ? 'bg-unite-200/20 text-unite-400'
                            : user.role === UserRole.ADMIN
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
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
                        
                        {/* Don't allow deleting yourself */}
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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
                        )}
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

export default UserManagement;
