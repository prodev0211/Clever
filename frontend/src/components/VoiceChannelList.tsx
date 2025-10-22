'use client';

import { useVoiceStore } from '@/stores/voiceStore';

interface VoiceChannelListProps {
  channels: { id: string; name: string; type: string }[];
}

export function VoiceChannelList({ channels }: VoiceChannelListProps) {
  const { joinedChannelId, joinVoice, leaveVoice } = useVoiceStore();

  return (
    <div className="mt-4">
      <h4 className="text-xs text-gray-400 uppercase mb-2">Voice Channels</h4>
      <div className="space-y-2">
        {channels.filter(c => c.type === 'GUILD_VOICE' || c.type === 'GUILD_STAGE_VOICE').map(channel => (
          <div key={channel.id} className="p-2 bg-gray-800 rounded flex items-center space-x-2">
            <span className="text-green-400">🔊</span>
            <span className="text-white font-medium">{channel.name}</span>
            {joinedChannelId === channel.id ? (
              <button
                onClick={() => leaveVoice(channel.id)}
                className="ml-auto px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Leave
              </button>
            ) : (
              <button
                onClick={() => joinVoice(channel.id)}
                className="ml-auto px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Join
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}