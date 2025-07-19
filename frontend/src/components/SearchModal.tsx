'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from '@/stores/searchStore';
import { Avatar } from '@/components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'global' | 'messages' | 'channels' | 'guilds' | 'users'>('global');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['messages', 'channels', 'guilds', 'users']);
  
  const { 
    messages, channels, guilds, users, loading, error,
    globalSearch, searchMessages, searchChannels, searchGuilds, searchUsers,
    clearResults, clearError
  } = useSearchStore();

  useEffect(() => {
    if (!isOpen) {
      clearResults();
      clearError();
    }
  }, [isOpen, clearResults, clearError]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      if (searchType === 'global') {
        await globalSearch({ query: query.trim(), types: selectedTypes });
      } else if (searchType === 'messages') {
        await searchMessages({ query: query.trim() });
      } else if (searchType === 'channels') {
        await searchChannels({ query: query.trim() });
      } else if (searchType === 'guilds') {
        await searchGuilds({ query: query.trim() });
      } else if (searchType === 'users') {
        await searchUsers({ query: query.trim() });
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Search</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* Search Input */}
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Type Selector */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setSearchType('global')}
              className={`px-3 py-1 rounded text-sm ${
                searchType === 'global'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setSearchType('messages')}
              className={`px-3 py-1 rounded text-sm ${
                searchType === 'messages'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setSearchType('channels')}
              className={`px-3 py-1 rounded text-sm ${
                searchType === 'channels'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Channels
            </button>
            <button
              onClick={() => setSearchType('guilds')}
              className={`px-3 py-1 rounded text-sm ${
                searchType === 'guilds'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Guilds
            </button>
            <button
              onClick={() => setSearchType('users')}
              className={`px-3 py-1 rounded text-sm ${
                searchType === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Users
            </button>
          </div>

          {/* Global Search Type Selector */}
          {searchType === 'global' && (
            <div className="mt-2 flex space-x-2">
              {['messages', 'channels', 'guilds', 'users'].map((type) => (
                <label key={type} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes([...selectedTypes, type]);
                      } else {
                        setSelectedTypes(selectedTypes.filter(t => t !== type));
                      }
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-300 capitalize">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="text-red-400 mb-4">{error}</div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Messages</h3>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="bg-gray-700 rounded p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={message.author?.avatar}
                        alt={message.author?.username || 'Unknown'}
                        size="sm"
                        fallback={message.author?.username?.charAt(0) || '?'}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">
                            {message.author?.username}
                          </span>
                          <span className="text-gray-400">
                            #{message.channel?.name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {message.createdAt && formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-1">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Channels */}
          {channels.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Channels</h3>
              <div className="space-y-2">
                {channels.map((channel) => (
                  <div key={channel.id} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">#</span>
                      <span className="font-medium text-white">{channel.name}</span>
                      <span className="text-gray-400 text-sm">{channel.type}</span>
                      {channel.guild && (
                        <span className="text-gray-500 text-sm">
                          in {channel.guild.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guilds */}
          {guilds.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Guilds</h3>
              <div className="space-y-2">
                {guilds.map((guild) => (
                  <div key={guild.id} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={guild.icon}
                        alt={guild.name}
                        size="sm"
                        fallback={guild.name.charAt(0)}
                      />
                      <span className="font-medium text-white">{guild.name}</span>
                      <span className="text-gray-400 text-sm">
                        {guild.memberCount} members
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {users.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Users</h3>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={user.avatar}
                        alt={user.username}
                        size="sm"
                        fallback={user.username.charAt(0)}
                      />
                      <span className="font-medium text-white">{user.username}</span>
                      <span className="text-gray-400">#{user.discriminator}</span>
                      <span className="text-gray-500 text-sm">{user.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && query && messages.length === 0 && channels.length === 0 && 
           guilds.length === 0 && users.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}