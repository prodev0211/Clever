'use client';

import { useState } from 'react';
import { useBotStore } from '@/stores/botStore';

export function BotCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { createBot, error } = useBotStore();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createBot({ name, description });
      setName('');
      setDescription('');
    } catch (e) {
      // error handled by store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">Create Bot</h3>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Bot name"
        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
        disabled={loading}
      />
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
        disabled={loading}
      />
      <button
        onClick={handleCreate}
        disabled={loading || !name.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Bot'}
      </button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}