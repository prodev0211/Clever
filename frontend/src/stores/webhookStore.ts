import { create } from 'zustand';
import { api } from '@/lib/api';

interface Webhook {
  _id: string;
  channelId: string;
  guildId: string;
  name: string;
  avatar?: string;
  token: string;
  url: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
}

interface WebhookStore {
  webhooks: Webhook[];
  loading: boolean;
  error: string | null;
  fetchWebhooks: (guildId: string) => Promise<void>;
  createWebhook: (guildId: string, data: Partial<Webhook>) => Promise<Webhook>;
  deleteWebhook: (webhookId: string) => Promise<void>;
  clearError: () => void;
}

export const useWebhookStore = create<WebhookStore>((set, get) => ({
  webhooks: [],
  loading: false,
  error: null,

  fetchWebhooks: async (guildId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/webhooks/${guildId}`);
      set({ webhooks: res.data.webhooks, loading: false });
    } catch (e: any) {
      set({ error: e.response?.data?.error || 'Failed to fetch webhooks', loading: false });
    }
  },

  createWebhook: async (guildId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(`/webhooks/${guildId}`, data);
      set(state => ({ webhooks: [...state.webhooks, res.data.webhook], loading: false }));
      return res.data.webhook;
    } catch (e: any) {
      set({ error: e.response?.data?.error || 'Failed to create webhook', loading: false });
      throw e;
    }
  },

  deleteWebhook: async (webhookId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/webhooks/${webhookId}`);
      set(state => ({ webhooks: state.webhooks.filter(w => w._id !== webhookId), loading: false }));
    } catch (e: any) {
      set({ error: e.response?.data?.error || 'Failed to delete webhook', loading: false });
      throw e;
    }
  },

  clearError: () => set({ error: null })
}));