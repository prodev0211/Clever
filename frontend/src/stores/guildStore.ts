import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Guild {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  memberCount: number;
  verificationLevel?: string;
  features?: string[];
  settings?: any;
  isOwner?: boolean;
  nick?: string;
  roles?: string[];
}

export interface GuildMember {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  status?: string;
  nick?: string;
  roles: any[];
  joinedAt: string;
  isOwner: boolean;
}

interface GuildState {
  guilds: Guild[];
  currentGuild: Guild | null;
  guildMembers: GuildMember[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUserGuilds: () => Promise<void>;
  createGuild: (name: string, description?: string) => Promise<Guild>;
  getGuild: (guildId: string) => Promise<Guild>;
  updateGuild: (guildId: string, data: Partial<Guild>) => Promise<void>;
  deleteGuild: (guildId: string) => Promise<void>;
  leaveGuild: (guildId: string) => Promise<void>;
  getGuildMembers: (guildId: string) => Promise<GuildMember[]>;
  setCurrentGuild: (guild: Guild | null) => void;
  clearError: () => void;
}

export const useGuildStore = create<GuildState>((set, get) => ({
  guilds: [],
  currentGuild: null,
  guildMembers: [],
  loading: false,
  error: null,

  fetchUserGuilds: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/guilds');
      set({ guilds: response.data.guilds, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch guilds', 
        loading: false 
      });
    }
  },

  createGuild: async (name: string, description?: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/guilds', { name, description });
      const newGuild = response.data.guild;
      
      set(state => ({
        guilds: [...state.guilds, newGuild],
        loading: false
      }));
      
      return newGuild;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to create guild', 
        loading: false 
      });
      throw error;
    }
  },

  getGuild: async (guildId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/guilds/${guildId}`);
      const guild = response.data.guild;
      
      set({ currentGuild: guild, loading: false });
      return guild;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to get guild', 
        loading: false 
      });
      throw error;
    }
  },

  updateGuild: async (guildId: string, data: Partial<Guild>) => {
    try {
      set({ loading: true, error: null });
      await api.put(`/guilds/${guildId}`, data);
      
      set(state => ({
        guilds: state.guilds.map(guild => 
          guild.id === guildId ? { ...guild, ...data } : guild
        ),
        currentGuild: state.currentGuild?.id === guildId 
          ? { ...state.currentGuild, ...data }
          : state.currentGuild,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update guild', 
        loading: false 
      });
      throw error;
    }
  },

  deleteGuild: async (guildId: string) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/guilds/${guildId}`);
      
      set(state => ({
        guilds: state.guilds.filter(guild => guild.id !== guildId),
        currentGuild: state.currentGuild?.id === guildId ? null : state.currentGuild,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to delete guild', 
        loading: false 
      });
      throw error;
    }
  },

  leaveGuild: async (guildId: string) => {
    try {
      set({ loading: true, error: null });
      await api.post(`/guilds/${guildId}/leave`);
      
      set(state => ({
        guilds: state.guilds.filter(guild => guild.id !== guildId),
        currentGuild: state.currentGuild?.id === guildId ? null : state.currentGuild,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to leave guild', 
        loading: false 
      });
      throw error;
    }
  },

  getGuildMembers: async (guildId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/guilds/${guildId}/members`);
      
      set({ guildMembers: response.data.members, loading: false });
      return response.data.members;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to get guild members', 
        loading: false 
      });
      throw error;
    }
  },

  setCurrentGuild: (guild: Guild | null) => {
    set({ currentGuild: guild });
  },

  clearError: () => {
    set({ error: null });
  }
}));