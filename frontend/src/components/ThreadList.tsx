'use client';

import { useEffect } from 'react';
import { useThreadStore } from '@/stores/threadStore';

interface ThreadListProps {
  channelId: string;
}

export function ThreadList({ channelId }: ThreadListProps) {
  const { threads } = useThreadStore();
  // TODO: Fetch threads from API if needed
  const threadList = threads.filter(t => t.parentId === channelId);

  if (threadList.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-xs text-gray-400 uppercase mb-2">Threads</h4>
      <div className="space-y-2">
        {threadList.map(thread => (
          <div key={thread.id} className="p-2 bg-gray-800 rounded flex items-center space-x-2">
            <span className="text-blue-400">#</span>
            <span className="text-white font-medium">{thread.name}</span>
            <span className="text-xs text-gray-400">(auto-archive: {thread.autoArchiveDuration}m)</span>
          </div>
        ))}
      </div>
    </div>
  );
}