'use client';

import { useEffect, useRef } from 'react';
import { useChannelStore, Message } from '@/stores/channelStore';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface MessageListProps {
  channelId?: string;
}

export function MessageList({ channelId }: MessageListProps) {
  const { messages, loading, error, getChannelMessages } = useChannelStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (channelId) {
      getChannelMessages(channelId);
    }
  }, [channelId, getChannelMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!channelId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">Select a channel to start messaging</p>
          <p className="text-sm">Choose a channel from the sidebar to begin chatting</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
                <div className="h-3 bg-gray-700 rounded w-16 animate-pulse" />
              </div>
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        <div className="text-center">
          <p>Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Be the first to send a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  const isEdited = message.editedTimestamp && message.editedTimestamp !== message.createdAt;

  return (
    <div className="flex space-x-3 group hover:bg-gray-800/50 rounded-lg p-2 -m-2 transition-colors">
      <Avatar
        src={message.author.avatar}
        alt={message.author.username}
        fallback={message.author.username.charAt(0).toUpperCase()}
        className="w-10 h-10 flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-white">
            {message.author.username}
          </span>
          <span className="text-gray-400 text-sm">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
          {isEdited && (
            <span className="text-gray-500 text-xs">(edited)</span>
          )}
        </div>
        
        <div className="text-gray-200 whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        {/* Message actions (hover) */}
        <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-gray-400 hover:text-white text-sm">
            Reply
          </button>
          <button className="text-gray-400 hover:text-white text-sm">
            React
          </button>
          <button className="text-gray-400 hover:text-white text-sm">
            More
          </button>
        </div>
      </div>
    </div>
  );
}