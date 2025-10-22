import { create } from 'zustand';
import { api } from '@/lib/api';

interface DM {
  id: string;
  name: string;
  isGroup: boolean;
  participants: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    status: string;
  }[];
  lastMessage?: {
    id: string;
    content: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  ownerId?: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
  };
  icon?: string;
  unreadCount: number;
}

interface DMStore {
  dms: DM[];
  selectedDM: DM | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchDMs: () => Promise<void>;
  createDM: (userId: string) => Promise<DM>;
  createGroupDM: (participants: string[], name: string) => Promise<DM>;
  getDM: (dmId: string) => Promise<DM>;
  updateGroupDM: (dmId: string, data: { name?: string; icon?: string }) => Promise<void>;
  leaveGroupDM: (dmId: string) => Promise<void>;
  selectDM: (dm: DM | null) => void;
  addDM: (dm: DM) => void;
  updateDM: (dmId: string, updates: Partial<DM>) => void;
  removeDM: (dmId: string) => void;
  clearError: () => void;
}

export const useDMStore = create<DMStore>((set, get) => ({
  dms: [],
  selectedDM: null,
  loading: false,
  error: null,

  fetchDMs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/dms');
      set({ dms: response.data.dms, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch DMs', 
        loading: false 
      });
    }
  },

  createDM: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/dms', { userId });
      const dm = response.data.dm;
      set(state => ({
        dms: [dm, ...state.dms],
        loading: false
      }));
      return dm;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to create DM', 
        loading: false 
      });
      throw error;
    }
  },

  createGroupDM: async (participants: string[], name: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/dms/group', { participants, name });
      const dm = response.data.dm;
      set(state => ({
        dms: [dm, ...state.dms],
        loading: false
      }));
      return dm;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to create group DM', 
        loading: false 
      });
      throw error;
    }
  },

  getDM: async (dmId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/dms/${dmId}`);
      const dm = response.data.dm;
      set({ loading: false });
      return dm;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to get DM', 
        loading: false 
      });
      throw error;
    }
  },

  updateGroupDM: async (dmId: string, data: { name?: string; icon?: string }) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/dms/${dmId}`, data);
      set(state => ({
        dms: state.dms.map(dm => 
          dm.id === dmId 
            ? { ...dm, ...data }
            : dm
        ),
        selectedDM: state.selectedDM?.id === dmId 
          ? { ...state.selectedDM, ...data }
          : state.selectedDM,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update group DM', 
        loading: false 
      });
      throw error;
    }
  },

  leaveGroupDM: async (dmId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/dms/${dmId}/leave`);
      set(state => ({
        dms: state.dms.filter(dm => dm.id !== dmId),
        selectedDM: state.selectedDM?.id === dmId ? null : state.selectedDM,
        loading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to leave group DM', 
        loading: false 
      });
      throw error;
    }
  },

  selectDM: (dm: DM | null) => {
    set({ selectedDM: dm });
  },

  addDM: (dm: DM) => {
    set(state => ({
      dms: [dm, ...state.dms]
    }));
  },

  updateDM: (dmId: string, updates: Partial<DM>) => {
    set(state => ({
      dms: state.dms.map(dm => 
        dm.id === dmId 
          ? { ...dm, ...updates }
          : dm
      ),
      selectedDM: state.selectedDM?.id === dmId 
        ? { ...state.selectedDM, ...updates }
        : state.selectedDM
    }));
  },

  removeDM: (dmId: string) => {
    set(state => ({
      dms: state.dms.filter(dm => dm.id !== dmId),
      selectedDM: state.selectedDM?.id === dmId ? null : state.selectedDM
    }));
  },

  clearError: () => {
    set({ error: null });
  }
}));