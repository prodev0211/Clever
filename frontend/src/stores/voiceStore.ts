import { create } from 'zustand';

interface VoiceState {
  joinedChannelId: string | null;
  users: Record<string, string[]>; // channelId -> userId[]
  joinVoice: (channelId: string) => void;
  leaveVoice: (channelId: string) => void;
  setUsers: (channelId: string, userIds: string[]) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  joinedChannelId: null,
  users: {},
  joinVoice: (channelId) => {
    set({ joinedChannelId: channelId });
    // TODO: Emit socket event to join voice
  },
  leaveVoice: (channelId) => {
    set({ joinedChannelId: null });
    // TODO: Emit socket event to leave voice
  },
  setUsers: (channelId, userIds) => {
    set(state => ({ users: { ...state.users, [channelId]: userIds } }));
  }
}));