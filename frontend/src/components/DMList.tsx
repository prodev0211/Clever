'use client';

import { useEffect, useState } from 'react';
import { useDMStore } from '@/stores/dmStore';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { DM } from '@/types/dm';

export function DMList() {
  const { dms, selectedDM, loading, fetchDMs, selectDM } = useDMStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDMs();
  }, [fetchDMs]);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">Direct Messages</h2>
        
        {dms.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No direct messages yet</p>
            <p className="text-sm mt-2">Start a conversation with someone!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {dms.map((dm) => {
              const isSelected = selectedDM?.id === dm.id;
              const otherParticipant = dm.participants.find(p => p.id !== user?.id);
              const displayName = dm.isGroup ? dm.name : (otherParticipant?.username || 'Unknown User');
              const avatar = dm.isGroup ? dm.icon : otherParticipant?.avatar;
              
              return (
                <div
                  key={dm.id}
                  onClick={() => selectDM(dm)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Avatar
                    src={avatar}
                    alt={displayName}
                    size="sm"
                    fallback={displayName.charAt(0).toUpperCase()}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{displayName}</h3>
                      {dm.lastMessageAt && (
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(dm.lastMessageAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    {dm.lastMessage ? (
                      <p className="text-sm text-gray-400 truncate">
                        {dm.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        {dm.isGroup ? 'Group DM' : 'No messages yet'}
                      </p>
                    )}
                  </div>
                  
                  {dm.unreadCount > 0 && (
                    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dm.unreadCount > 99 ? '99+' : dm.unreadCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}