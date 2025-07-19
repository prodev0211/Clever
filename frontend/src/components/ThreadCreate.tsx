'use client';

import { useState } from 'react';
import { useThreadStore } from '@/stores/threadStore';

interface ThreadCreateProps {
  channelId: string;
  messageId: string;
}

export function ThreadCreate({ channelId, messageId }: ThreadCreateProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createThread } = useThreadStore();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createThread(channelId, messageId, name.trim());
      setName('');
    } catch (e) {
      // TODO: Show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-8 mt-2 flex items-center space-x-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Thread name..."
        className="flex-1 px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
      />
      <button
        onClick={handleCreate}
        disabled={loading || !name.trim()}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Create Thread
      </button>
    </div>
  );
}