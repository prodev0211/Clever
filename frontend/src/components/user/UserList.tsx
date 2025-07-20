'use client'

import { useState, useEffect } from 'react'
import { useGuildStore } from '@/stores/guildStore'
import { Search, Mic, Headphones, Settings } from 'lucide-react'

interface User {
  id: string
  username: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
  isSpeaking?: boolean
  isMuted?: boolean
  isDeafened?: boolean
}

export function UserList() {
  const { currentGuild } = useGuildStore()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Sample users for demo
  const sampleUsers: User[] = [
    {
      id: '1',
      username: 'Alex',
      status: 'online',
      customStatus: 'Coding React components'
    },
    {
      id: '2',
      username: 'Sarah',
      status: 'idle',
      customStatus: 'AFK - In a meeting'
    },
    {
      id: '3',
      username: 'Mike',
      status: 'online',
      customStatus: 'Playing Valorant',
      isSpeaking: true
    },
    {
      id: '4',
      username: 'Emma',
      status: 'dnd',
      customStatus: 'Do not disturb',
      isMuted: true
    },
    {
      id: '5',
      username: 'David',
      status: 'offline',
      customStatus: 'Last seen 2 hours ago'
    }
  ]

  useEffect(() => {
    setUsers(sampleUsers)
  }, [])

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'status-online'
      case 'idle': return 'status-idle'
      case 'dnd': return 'status-dnd'
      case 'offline': return 'status-offline'
      default: return 'status-offline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'idle': return 'Idle'
      case 'dnd': return 'Do Not Disturb'
      case 'offline': return 'Offline'
      default: return 'Offline'
    }
  }

  if (!currentGuild) {
    return (
      <div className="user-list w-full h-full flex flex-col">
        <div className="glass p-4">
          <h2 className="text-lg font-semibold text-white mb-2">No Server Selected</h2>
          <p className="text-sm text-gray-400">
            Select a server to view members
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-list w-full h-full flex flex-col">
      {/* Header */}
      <div className="glass p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-3">Members</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer group"
            >
              {/* Avatar with status */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${getStatusColor(user.status)}`} />
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white truncate">
                    {user.username}
                  </span>
                  {user.isSpeaking && (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                  {user.isMuted && (
                    <Mic className="w-3 h-3 text-gray-400" />
                  )}
                  {user.isDeafened && (
                    <Headphones className="w-3 h-3 text-gray-400" />
                  )}
                </div>
                {user.customStatus && (
                  <p className="text-xs text-gray-400 truncate">
                    {user.customStatus}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="glass p-4 border-t border-gray-800">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {filteredUsers.length} member{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}