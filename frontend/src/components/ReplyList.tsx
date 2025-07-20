'use client';

import { useEffect } from 'react';
import { useThreadStore } from '@/stores/threadStore';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface ReplyListProps {
  channelId: string;
  messageId: string;
}

export function ReplyList({ channelId, messageId }: ReplyListProps) {
  const { replies, setReplies } = useThreadStore();
  useEffect(() => {
    // Fetch replies from API if needed
    if (messageId) {
      // TODO: Implement reply fetching
    }
  }, [messageId]);

  const replyList = replies[messageId] || [];

  if (replyList.length === 0) return null;

  return (
    <div className="ml-8 mt-2 space-y-2">
      {replyList.map((reply) => (
        <div key={reply.id} className="flex items-start space-x-2 bg-gray-800 rounded p-2">
          <Avatar src={reply.authorId?.avatar} alt={reply.authorId?.username || '?'} size="xs" fallback={reply.authorId?.username?.charAt(0) || '?'} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-white text-sm">{reply.authorId}</span>
              <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
            </div>
            <div className="text-gray-300 text-sm">{reply.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}