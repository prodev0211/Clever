import { create } from 'zustand';
import { api } from '@/lib/api';

interface Permission {
  name: string;
  value: number;
  description: string;
}

interface Role {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: number;
  mentionable: boolean;
  managed: boolean;
  icon?: string;
  unicode_emoji?: string;
  permissionFlags: Record<string, boolean>;
}

interface RoleStore {
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchGuildRoles: (guildId: string) => Promise<void>;
  createRole: (guildId: string, roleData: Partial<Role>) => Promise<Role>;
  updateRole: (guildId: string, roleId: string, updates: Partial<Role>) => Promise<void>;
  deleteRole: (guildId: string, roleId: string) => Promise<void>;
  updateRolePositions: (guildId: string, positions: { roleId: string; position: number }[]) => Promise<void>;
  fetchPermissions: () => Promise<void>;
  clearError: () => void;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  permissions: [],
  loading: false,
  error: null,

  fetchGuildRoles: async (guildId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/roles/guild/${guildId}`);
      set({ roles: response.data.roles, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch roles', 
        loading: false 
      });
    }
  },

  createRole: async (guildId: string, roleData: Partial<Role>) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/roles/guild/${guildId}`, roleData);
      const role = response.data.role;
      set(state => ({
        roles: [...state.roles, role],
        loading: false
      }));
      return role;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to create role', 
        loading: false 
      });
      throw error;
    }
  },

  updateRole: async (guildId: string, roleId: string, updates: Partial<Role>) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/roles/guild/${guildId}/${roleId}`, updates);
      set(state => ({
        roles: state.roles.map(role => 
          role.id === roleId 
            ? { ...role, ...updates }
            : role
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update role', 
        loading: false 
      });
      throw error;
    }
  },

  deleteRole: async (guildId: string, roleId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/roles/guild/${guildId}/${roleId}`);
      set(state => ({
        roles: state.roles.filter(role => role.id !== roleId),
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to delete role', 
        loading: false 
      });
      throw error;
    }
  },

  updateRolePositions: async (guildId: string, positions: { roleId: string; position: number }[]) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/roles/guild/${guildId}/positions`, { positions });
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update role positions', 
        loading: false 
      });
      throw error;
    }
  },

  fetchPermissions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/roles/permissions');
      set({ permissions: response.data.permissions, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch permissions', 
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));