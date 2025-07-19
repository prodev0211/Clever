import { create } from 'zustand';
import { api } from '@/lib/api';

interface Thread {
  id: string;
  name: string;
  parentId: string;
  type: string;
  autoArchiveDuration: number;
  createdAt: string;
}

interface Reply {
  id: string;
  content: string;
  authorId: string;
  type: string;
  messageReference: any;
  createdAt: string;
}

interface ThreadStore {
  threads: Thread[];
  replies: Record<string, Reply[]>;
  loading: boolean;
  error: string | null;
  createThread: (channelId: string, messageId: string, name: string, autoArchiveDuration?: number) => Promise<Thread>;
  replyToMessage: (channelId: string, messageId: string, content: string) => Promise<Reply>;
  setReplies: (messageId: string, replies: Reply[]) => void;
  clearError: () => void;
}

export const useThreadStore = create<ThreadStore>((set, get) => ({
  threads: [],
  replies: {},
  loading: false,
  error: null,

  createThread: async (channelId, messageId, name, autoArchiveDuration) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/threads/${channelId}/${messageId}/thread`, { name, autoArchiveDuration });
      const thread = response.data.thread;
      set(state => ({
        threads: [...state.threads, thread],
        loading: false
      }));
      return thread;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create thread', loading: false });
      throw error;
    }
  },

  replyToMessage: async (channelId, messageId, content) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/threads/${channelId}/${messageId}/reply`, { content });
      const reply = response.data.message;
      set(state => ({
        replies: {
          ...state.replies,
          [messageId]: [...(state.replies[messageId] || []), reply]
        },
        loading: false
      }));
      return reply;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to reply', loading: false });
      throw error;
    }
  },

  setReplies: (messageId, replies) => {
    set(state => ({
      replies: {
        ...state.replies,
        [messageId]: replies
      }
    }));
  },

  clearError: () => set({ error: null })
}));