'use client';

import { useEffect, useState } from 'react';
import { useChannelStore, Channel } from '@/stores/channelStore';
import { cn } from '@/lib/utils';
import { CreateChannelModal } from './CreateChannelModal';

interface ChannelListProps {
  guildId?: string;
  onChannelSelect?: (channel: Channel | null) => void;
  selectedChannelId?: string;
}

export function ChannelList({ guildId, onChannelSelect, selectedChannelId }: ChannelListProps) {
  const { channels, loading, error, getGuildChannels } = useChannelStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (guildId) {
      getGuildChannels(guildId);
    }
  }, [guildId, getGuildChannels]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'GUILD_TEXT':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      case 'GUILD_VOICE':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        );
      case 'GUILD_CATEGORY':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-2 p-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        <p>Error loading channels: {error}</p>
      </div>
    );
  }

  if (!guildId) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Select a server to view channels</p>
      </div>
    );
  }

  // Group channels by category
  const categories = channels.filter(c => c.type === 'GUILD_CATEGORY');
  const textChannels = channels.filter(c => c.type === 'GUILD_TEXT' && !c.parentId);
  const voiceChannels = channels.filter(c => c.type === 'GUILD_VOICE' && !c.parentId);

  return (
    <div className="flex flex-col space-y-1 p-2">
      {/* Categories */}
      {categories.map((category) => {
        const categoryChannels = channels.filter(c => c.parentId === category.id);
        const isExpanded = expandedCategories.has(category.id);
        
        return (
          <div key={category.id} className="space-y-1">
            <button
              className="flex items-center justify-between w-full px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded text-sm font-medium"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-1">
                <svg 
                  className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-90")} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>{category.name}</span>
              </div>
            </button>
            
            {isExpanded && (
              <div className="ml-4 space-y-1">
                {categoryChannels.map((channel) => (
                  <button
                    key={channel.id}
                    className={cn(
                      "flex items-center space-x-2 w-full px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-sm",
                      selectedChannelId === channel.id && "bg-gray-700 text-white"
                    )}
                    onClick={() => onChannelSelect?.(channel)}
                  >
                    {getChannelIcon(channel.type)}
                    <span className="truncate">#{channel.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Text Channels */}
      {textChannels.length > 0 && (
        <div className="space-y-1">
          <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Text Channels
          </div>
          {textChannels.map((channel) => (
            <button
              key={channel.id}
              className={cn(
                "flex items-center space-x-2 w-full px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-sm",
                selectedChannelId === channel.id && "bg-gray-700 text-white"
              )}
              onClick={() => onChannelSelect?.(channel)}
            >
              {getChannelIcon(channel.type)}
              <span className="truncate">#{channel.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Voice Channels */}
      {voiceChannels.length > 0 && (
        <div className="space-y-1">
          <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Voice Channels
          </div>
          {voiceChannels.map((channel) => (
            <button
              key={channel.id}
              className={cn(
                "flex items-center space-x-2 w-full px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-sm",
                selectedChannelId === channel.id && "bg-gray-700 text-white"
              )}
              onClick={() => onChannelSelect?.(channel)}
            >
              {getChannelIcon(channel.type)}
              <span className="truncate">{channel.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Add channel button */}
      <button
        className="flex items-center space-x-2 w-full px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-sm mt-2"
        title="Create Channel"
        onClick={() => setShowCreateModal(true)}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Create Channel</span>
      </button>

      {/* Create Channel Modal */}
      {guildId && (
        <CreateChannelModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          guildId={guildId}
        />
      )}
    </div>
  );
}