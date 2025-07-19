'use client';

import { useEffect } from 'react';
import { useWebhookStore } from '@/stores/webhookStore';

interface WebhookListProps {
  guildId: string;
}

export function WebhookList({ guildId }: WebhookListProps) {
  const { webhooks, fetchWebhooks, deleteWebhook, loading, error } = useWebhookStore();

  useEffect(() => { fetchWebhooks(guildId); }, [fetchWebhooks, guildId]);

  if (loading) return <div className="p-4 text-gray-400">Loading webhooks...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;
  if (webhooks.length === 0) return <div className="p-4 text-gray-400">No webhooks found.</div>;

  return (
    <div className="p-4 space-y-2">
      {webhooks.map(webhook => (
        <div key={webhook._id} className="bg-gray-800 rounded p-3 flex items-center space-x-3">
          <span className="text-blue-400 font-bold">🔗</span>
          <span className="text-white font-medium">{webhook.name}</span>
          <span className="text-gray-400 text-xs">Channel: {webhook.channelId}</span>
          <span className="text-xs text-gray-500">{webhook.createdAt}</span>
          <button
            onClick={() => deleteWebhook(webhook._id)}
            className="ml-auto px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}