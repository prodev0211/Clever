import { create } from 'zustand';
import { api } from '@/lib/api';

interface Bot {
  _id: string;
  userId: string;
  name: string;
  token: string;
  description?: string;
  avatar?: string;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
}

interface BotStore {
  bots: Bot[];
  loading: boolean;
  error: string | null;
  fetchBots: () => Promise<void>;
  createBot: (data: Partial<Bot>) => Promise<Bot>;
  deleteBot: (botId: string) => Promise<void>;
  clearError: () => void;
}

export const useBotStore = create<BotStore>((set, get) => ({
  bots: [],
  loading: false,
  error: null,

  fetchBots: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/bots');
      set({ bots: res.data.bots, loading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.error || 'Failed to fetch bots', loading: false });
    }
  },

  createBot: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/bots', data);
      set(state => ({ bots: [...state.bots, res.data.bot], loading: false }));
      return res.data.bot;
    } catch (e: any) {
      set({ error: e.response?.data?.error || 'Failed to create bot', loading: false });
      throw e;
    }
  },

  deleteBot: async (botId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/bots/${botId}`);
      set(state => ({ bots: state.bots.filter(b => b._id !== botId), loading: false }));
    } catch (e: any) {
      set({ error: e.response?.data?.error || 'Failed to delete bot', loading: false });
      throw e;
    }
  },

  clearError: () => set({ error: null })
}));