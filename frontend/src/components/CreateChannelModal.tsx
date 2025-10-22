'use client';

import { useState } from 'react';
import { useChannelStore, Channel } from '@/stores/channelStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  guildId: string;
}

export function CreateChannelModal({ isOpen, onClose, guildId }: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Channel['type']>('GUILD_TEXT');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const { createChannel } = useChannelStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createChannel(guildId, {
        name: name.trim(),
        type,
        topic: topic.trim() || undefined
      });
      setName('');
      setType('GUILD_TEXT');
      setTopic('');
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Create Channel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Channel Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter channel name"
              required
              maxLength={100}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
              Channel Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as Channel['type'])}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GUILD_TEXT">Text Channel</option>
              <option value="GUILD_VOICE">Voice Channel</option>
              <option value="GUILD_CATEGORY">Category</option>
            </select>
          </div>

          {type === 'GUILD_TEXT' && (
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                Topic (Optional)
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter channel topic"
                maxLength={1024}
                rows={2}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Channel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}