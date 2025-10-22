import { create } from 'zustand';
import { api } from '@/lib/api';

interface SearchResult {
  id: string;
  content?: string;
  author?: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
  channel?: {
    id: string;
    name: string;
    type: string;
  };
  guild?: {
    id: string;
    name: string;
    icon: string;
  };
  createdAt?: string;
  editedAt?: string;
  attachments?: any[];
  embeds?: any[];
}

interface SearchStore {
  messages: SearchResult[];
  channels: SearchResult[];
  guilds: SearchResult[];
  users: SearchResult[];
  loading: boolean;
  error: string | null;
  
  // Actions
  searchMessages: (params: {
    query?: string;
    guildId?: string;
    channelId?: string;
    authorId?: string;
    hasAttachments?: boolean;
    hasEmbeds?: boolean;
    before?: string;
    after?: string;
    limit?: number;
  }) => Promise<void>;
  
  searchChannels: (params: {
    query?: string;
    guildId?: string;
    type?: string;
    limit?: number;
  }) => Promise<void>;
  
  searchGuilds: (params: {
    query?: string;
    limit?: number;
  }) => Promise<void>;
  
  searchUsers: (params: {
    query?: string;
    guildId?: string;
    limit?: number;
  }) => Promise<void>;
  
  globalSearch: (params: {
    query: string;
    types?: string[];
    limit?: number;
  }) => Promise<void>;
  
  clearResults: () => void;
  clearError: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  messages: [],
  channels: [],
  guilds: [],
  users: [],
  loading: false,
  error: null,

  searchMessages: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/search/messages', { params });
      set({ messages: response.data.messages, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to search messages', 
        loading: false 
      });
    }
  },

  searchChannels: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/search/channels', { params });
      set({ channels: response.data.channels, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to search channels', 
        loading: false 
      });
    }
  },

  searchGuilds: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/search/guilds', { params });
      set({ guilds: response.data.guilds, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to search guilds', 
        loading: false 
      });
    }
  },

  searchUsers: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/search/users', { params });
      set({ users: response.data.users, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to search users', 
        loading: false 
      });
    }
  },

  globalSearch: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/search/global', { params });
      const { results } = response.data;
      set({ 
        messages: results.messages || [],
        channels: results.channels || [],
        guilds: results.guilds || [],
        users: results.users || [],
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to perform global search', 
        loading: false 
      });
    }
  },

  clearResults: () => {
    set({ messages: [], channels: [], guilds: [], users: [] });
  },

  clearError: () => {
    set({ error: null });
  }
}));