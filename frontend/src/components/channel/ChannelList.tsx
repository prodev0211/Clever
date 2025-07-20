'use client'

import { useState, useEffect } from 'react'
import { useGuildStore } from '@/stores/guildStore'
import { 
  Hash, 
  Mic, 
  Settings, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Crown,
  Shield
} from 'lucide-react'

interface ChannelListProps {
  onMobileMenuClick?: () => void
}

export function ChannelList({ onMobileMenuClick }: ChannelListProps) {
  const { currentGuild } = useGuildStore()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['text', 'voice']))

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  if (!currentGuild) {
    return (
      <div className="channel-list w-full h-full flex flex-col">
        <div className="glass p-4">
          <h2 className="text-lg font-semibold text-white mb-2">No Server Selected</h2>
          <p className="text-sm text-gray-400">
            Select a server from the sidebar to view channels
          </p>
        </div>
      </div>
    )
  }

  const textChannels = [
    { id: '1', name: 'general', type: 'text' },
    { id: '2', name: 'announcements', type: 'text' },
    { id: '3', name: 'random', type: 'text' },
  ]

  const voiceChannels = [
    { id: '4', name: 'General', type: 'voice' },
    { id: '5', name: 'Gaming', type: 'voice' },
    { id: '6', name: 'Music', type: 'voice' },
  ]

  return (
    <div className="channel-list w-full h-full flex flex-col">
      {/* Server Header */}
      <div className="glass p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentGuild.icon ? (
              <img
                src={currentGuild.icon}
                alt={currentGuild.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Hash className="w-4 h-4 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-white">{currentGuild.name}</h2>
              <p className="text-xs text-gray-400">{currentGuild.memberCount} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {currentGuild.isOwner && (
              <Crown className="w-4 h-4 text-yellow-500" />
            )}
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Text Channels */}
        <div className="mb-4">
          <button
            onClick={() => toggleCategory('text')}
            className="flex items-center justify-between w-full px-2 py-1 text-gray-400 hover:text-white transition-colors"
          >
            <div className="flex items-center space-x-1">
              {expandedCategories.has('text') ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-xs font-medium uppercase tracking-wider">Text Channels</span>
            </div>
            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {expandedCategories.has('text') && (
            <div className="mt-2 space-y-1">
              {textChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="channel-item flex items-center space-x-2 px-2 py-1 rounded cursor-pointer group"
                >
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {channel.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Channels */}
        <div className="mb-4">
          <button
            onClick={() => toggleCategory('voice')}
            className="flex items-center justify-between w-full px-2 py-1 text-gray-400 hover:text-white transition-colors"
          >
            <div className="flex items-center space-x-1">
              {expandedCategories.has('voice') ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-xs font-medium uppercase tracking-wider">Voice Channels</span>
            </div>
            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {expandedCategories.has('voice') && (
            <div className="mt-2 space-y-1">
              {voiceChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="channel-item flex items-center space-x-2 px-2 py-1 rounded cursor-pointer group"
                >
                  <Mic className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {channel.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Roles */}
        <div className="mb-4">
          <button
            onClick={() => toggleCategory('roles')}
            className="flex items-center justify-between w-full px-2 py-1 text-gray-400 hover:text-white transition-colors"
          >
            <div className="flex items-center space-x-1">
              {expandedCategories.has('roles') ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-xs font-medium uppercase tracking-wider">Roles</span>
            </div>
          </button>
          
          {expandedCategories.has('roles') && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-300">@everyone</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">@moderator</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-300">@admin</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Server Info */}
      <div className="glass p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">DN</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">DevOnNight</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}