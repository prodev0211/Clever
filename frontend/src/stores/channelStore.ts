import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Channel {
  id: string;
  name: string;
  type: 'GUILD_TEXT' | 'GUILD_VOICE' | 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STAGE_VOICE' | 'DM' | 'GROUP_DM';
  topic?: string;
  position: number;
  parentId?: string;
  guildId?: string;
  recipients?: string[];
  lastMessageId?: string;
  isDeleted: boolean;
}

export interface Message {
  id: string;
  channelId: string;
  guildId?: string;
  authorId: string;
  content: string;
  tts: boolean;
  type: number;
  flags: number;
  editedTimestamp?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
  };
}

interface ChannelState {
  channels: Channel[];
  currentChannel: Channel | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  
  // Actions
  getGuildChannels: (guildId: string) => Promise<Channel[]>;
  createChannel: (guildId: string, data: Partial<Channel>) => Promise<Channel>;
  getChannel: (channelId: string) => Promise<Channel>;
  updateChannel: (channelId: string, data: Partial<Channel>) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  getChannelMessages: (channelId: string, limit?: number, before?: string, after?: string) => Promise<Message[]>;
  sendMessage: (channelId: string, content: string, tts?: boolean) => Promise<Message>;
  updateMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  reorderChannels: (guildId: string, channels: { id: string; position: number }[]) => Promise<void>;
  setCurrentChannel: (channel: Channel | null) => void;
  addMessage: (message: Message) => void;
  updateMessageInStore: (messageId: string, content: string) => void;
  deleteMessageFromStore: (messageId: string) => void;
  clearError: () => void;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  currentChannel: null,
  messages: [],
  loading: false,
  error: null,

  getGuildChannels: async (guildId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/channels/guild/${guildId}`);
      
      const allChannels: Channel[] = [
        ...response.data.channels.categories.flatMap((category: any) => category.channels),
        ...response.data.channels.textChannels,
        ...response.data.channels.voiceChannels
      ];
      
      set({ channels: allChannels, loading: false });
      return allChannels;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch channels', 
        loading: false 
      });
      throw error;
    }
  },

  createChannel: async (guildId: string, data: Partial<Channel>) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post(`/channels/guild/${guildId}`, data);
      const newChannel = response.data.channel;
      
      set(state => ({
        channels: [...state.channels, newChannel],
        loading: false
      }));
      
      return newChannel;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to create channel', 
        loading: false 
      });
      throw error;
    }
  },

  getChannel: async (channelId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/channels/${channelId}`);
      const channel = response.data.channel;
      
      set({ currentChannel: channel, loading: false });
      return channel;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to get channel', 
        loading: false 
      });
      throw error;
    }
  },

  updateChannel: async (channelId: string, data: Partial<Channel>) => {
    try {
      set({ loading: true, error: null });
      await api.put(`/channels/${channelId}`, data);
      
      set(state => ({
        channels: state.channels.map(channel => 
          channel.id === channelId ? { ...channel, ...data } : channel
        ),
        currentChannel: state.currentChannel?.id === channelId 
          ? { ...state.currentChannel, ...data }
          : state.currentChannel,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update channel', 
        loading: false 
      });
      throw error;
    }
  },

  deleteChannel: async (channelId: string) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/channels/${channelId}`);
      
      set(state => ({
        channels: state.channels.filter(channel => channel.id !== channelId),
        currentChannel: state.currentChannel?.id === channelId ? null : state.currentChannel,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to delete channel', 
        loading: false 
      });
      throw error;
    }
  },

  getChannelMessages: async (channelId: string, limit = 50, before?: string, after?: string) => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (before) params.append('before', before);
      if (after) params.append('after', after);
      
      const response = await api.get(`/channels/${channelId}/messages?${params}`);
      
      set({ messages: response.data.messages, loading: false });
      return response.data.messages;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch messages', 
        loading: false 
      });
      throw error;
    }
  },

  sendMessage: async (channelId: string, content: string, tts = false) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post(`/messages/${channelId}`, { content, tts });
      const newMessage = response.data.data;
      
      set(state => ({
        messages: [...state.messages, newMessage],
        loading: false
      }));
      
      return newMessage;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to send message', 
        loading: false 
      });
      throw error;
    }
  },

  updateMessage: async (messageId: string, content: string) => {
    try {
      set({ loading: true, error: null });
      await api.put(`/messages/${messageId}`, { content });
      
      set(state => ({
        messages: state.messages.map(message => 
          message.id === messageId 
            ? { ...message, content, editedTimestamp: new Date().toISOString() }
            : message
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update message', 
        loading: false 
      });
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/messages/${messageId}`);
      
      set(state => ({
        messages: state.messages.filter(message => message.id !== messageId),
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to delete message', 
        loading: false 
      });
      throw error;
    }
  },

  reorderChannels: async (guildId: string, channels: { id: string; position: number }[]) => {
    try {
      set({ loading: true, error: null });
      await api.put(`/channels/guild/${guildId}/reorder`, { channels });
      
      set(state => ({
        channels: state.channels.map(channel => {
          const newPosition = channels.find(c => c.id === channel.id)?.position;
          return newPosition !== undefined ? { ...channel, position: newPosition } : channel;
        }),
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to reorder channels', 
        loading: false 
      });
      throw error;
    }
  },

  setCurrentChannel: (channel: Channel | null) => {
    set({ currentChannel: channel, messages: [] });
  },

  addMessage: (message: Message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  updateMessageInStore: (messageId: string, content: string) => {
    set(state => ({
      messages: state.messages.map(message => 
        message.id === messageId 
          ? { ...message, content, editedTimestamp: new Date().toISOString() }
          : message
      )
    }));
  },

  deleteMessageFromStore: (messageId: string) => {
    set(state => ({
      messages: state.messages.filter(message => message.id !== messageId)
    }));
  },

  clearError: () => {
    set({ error: null });
  }
}));