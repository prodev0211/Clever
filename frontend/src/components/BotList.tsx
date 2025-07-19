'use client';

import { useEffect } from 'react';
import { useBotStore } from '@/stores/botStore';

export function BotList() {
  const { bots, fetchBots, deleteBot, loading, error } = useBotStore();

  useEffect(() => { fetchBots(); }, [fetchBots]);

  if (loading) return <div className="p-4 text-gray-400">Loading bots...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;
  if (bots.length === 0) return <div className="p-4 text-gray-400">No bots found.</div>;

  return (
    <div className="p-4 space-y-2">
      {bots.map(bot => (
        <div key={bot._id} className="bg-gray-800 rounded p-3 flex items-center space-x-3">
          <span className="text-blue-400 font-bold">🤖</span>
          <span className="text-white font-medium">{bot.name}</span>
          <span className="text-gray-400 text-xs">Owner: {bot.ownerId}</span>
          <span className="text-xs text-gray-500">{bot.createdAt}</span>
          <button
            onClick={() => deleteBot(bot._id)}
            className="ml-auto px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}