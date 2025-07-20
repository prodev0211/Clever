'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useGuildStore, Guild } from '@/stores/guildStore';
import { useChannelStore, Channel } from '@/stores/channelStore';
import { GuildList } from '@/components/GuildList';
import { ChannelList } from '@/components/ChannelList';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { Avatar } from '@/components/ui/Avatar';
import { SearchModal } from '@/components/SearchModal';
import { DMList } from '@/components/DMList';
import { GuildMemberList } from '@/components/GuildMemberList';
import { GuildAdminPanel } from '@/components/GuildAdminPanel';

export default function AppPage() {
  const { user, logout } = useAuthStore();
  const { currentGuild, setCurrentGuild } = useGuildStore();
  const { currentChannel, setCurrentChannel } = useChannelStore();
  
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userPanelTab, setUserPanelTab] = useState<'members' | 'admin' | 'dms'>('members');

  const handleGuildSelect = (guild: Guild | null) => {
    setSelectedGuildId(guild?.id || null);
    setCurrentGuild(guild);
    setSelectedChannelId(null);
    setCurrentChannel(null);
  };

  const handleChannelSelect = (channel: Channel | null) => {
    setSelectedChannelId(channel?.id || null);
    setCurrentChannel(channel);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Server List Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4">
        <GuildList
          onGuildSelect={handleGuildSelect}
          selectedGuildId={selectedGuildId}
        />
      </div>

      {/* Channel List Sidebar */}
      <div className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {currentGuild?.name || 'Select a Server'}
          </h2>
          {currentGuild && (
            <p className="text-sm text-gray-400">
              {currentGuild.memberCount} members
            </p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ChannelList
            guildId={selectedGuildId}
            onChannelSelect={handleChannelSelect}
            selectedChannelId={selectedChannelId}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-white">
              {currentChannel ? `#${currentChannel.name}` : 'Select a channel'}
            </span>
          </div>
          
          <div className="ml-auto flex items-center space-x-2">
            <button 
              className="p-2 text-gray-400 hover:text-white"
              onClick={() => setShowSearchModal(true)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <MessageList channelId={selectedChannelId} />
          <MessageInput channelId={selectedChannelId} />
        </div>
      </div>

      {/* User Panel */}
      <div className="w-60 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
          <Avatar
            src={user?.avatar}
            alt={user?.username}
            fallback={user?.username?.charAt(0).toUpperCase()}
            className="w-10 h-10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.username}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1 text-gray-400 hover:text-white"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              userPanelTab === 'members'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setUserPanelTab('members')}
          >
            Members
          </button>
          <button
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              userPanelTab === 'admin'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setUserPanelTab('admin')}
          >
            Admin
          </button>
          <button
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              userPanelTab === 'dms'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setUserPanelTab('dms')}
          >
            DMs
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {userPanelTab === 'members' && (
            <GuildMemberList guildId={selectedGuildId} />
          )}
          {userPanelTab === 'admin' && (
            <GuildAdminPanel guildId={selectedGuildId} />
          )}
          {userPanelTab === 'dms' && (
            <DMList />
          )}
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <SearchModal 
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          guildId={selectedGuildId}
        />
      )}
    </div>
  );
}