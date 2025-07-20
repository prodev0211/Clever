'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface ModerationActionsProps {
  guildId: string;
  userId: string;
}

export function ModerationActions({ guildId, userId }: ModerationActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutUntil, setTimeoutUntil] = useState('');

  const handleAction = async (action: 'kick' | 'ban' | 'unban' | 'timeout') => {
    setLoading(true);
    setError(null);
    try {
      if (action === 'timeout') {
        await api.post(`/moderation/${guildId}/${userId}/timeout`, { until: timeoutUntil });
      } else {
        await api.post(`/moderation/${guildId}/${userId}/${action}`);
      }
      alert(`${action} success!`);
    } catch (e: unknown) {
      const error = e as Error;
      console.error('Moderation action failed:', error.message);
      setError(error.message || 'Failed to moderate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => handleAction('kick')}
        disabled={loading}
        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        Kick
      </button>
      <button
        onClick={() => handleAction('ban')}
        disabled={loading}
        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        Ban
      </button>
      <button
        onClick={() => handleAction('unban')}
        disabled={loading}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Unban
      </button>
      <div className="flex items-center space-x-2">
        <input
          type="datetime-local"
          value={timeoutUntil}
          onChange={e => setTimeoutUntil(e.target.value)}
          className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
          disabled={loading}
        />
        <button
          onClick={() => handleAction('timeout')}
          disabled={loading || !timeoutUntil}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Timeout
        </button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
    </div>
  );
}