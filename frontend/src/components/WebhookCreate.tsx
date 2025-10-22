'use client';

import { useState } from 'react';
import { useWebhookStore } from '@/stores/webhookStore';

interface WebhookCreateProps {
  guildId: string;
}

export function WebhookCreate({ guildId }: WebhookCreateProps) {
  const [name, setName] = useState('');
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const { createWebhook, error } = useWebhookStore();

  const handleCreate = async () => {
    if (!name.trim() || !channelId.trim()) return;
    setLoading(true);
    try {
      await createWebhook(guildId, { name, channelId });
      setName('');
      setChannelId('');
    } catch (e) {
      // error handled by store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">Create Webhook</h3>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Webhook name"
        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
        disabled={loading}
      />
      <input
        type="text"
        value={channelId}
        onChange={e => setChannelId(e.target.value)}
        placeholder="Channel ID"
        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
        disabled={loading}
      />
      <button
        onClick={handleCreate}
        disabled={loading || !name.trim() || !channelId.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Webhook'}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}