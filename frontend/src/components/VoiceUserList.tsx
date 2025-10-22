'use client';

import { useVoiceStore } from '@/stores/voiceStore';

interface VoiceUserListProps {
  channelId: string;
  users: { id: string; username: string; avatar?: string }[];
}

export function VoiceUserList({ channelId, users }: VoiceUserListProps) {
  const { joinedChannelId } = useVoiceStore();
  if (joinedChannelId !== channelId) return null;

  return (
    <div className="mt-2 ml-6">
      <h5 className="text-xs text-gray-400 mb-1">In Voice:</h5>
      <div className="flex flex-wrap gap-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded">
            <span className="w-5 h-5 rounded-full bg-gray-500 inline-block" style={{ backgroundImage: user.avatar ? `url(${user.avatar})` : undefined, backgroundSize: 'cover' }}></span>
            <span className="text-white text-xs">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}