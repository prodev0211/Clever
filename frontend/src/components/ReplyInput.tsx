'use client';

import { useState } from 'react';
import { useThreadStore } from '@/stores/threadStore';

interface ReplyInputProps {
  channelId: string;
  messageId: string;
}

export function ReplyInput({ channelId, messageId }: ReplyInputProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { replyToMessage } = useThreadStore();

  const handleReply = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await replyToMessage(channelId, messageId, content.trim());
      setContent('');
    } catch (error) {
      // Show error
      console.error('Failed to send reply:', error);
      setError('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-8 mt-2 flex items-center space-x-2">
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Reply..."
        className="flex-1 px-3 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
      />
      <button
        onClick={handleReply}
        disabled={loading || !content.trim()}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Reply
      </button>
    </div>
  );
}