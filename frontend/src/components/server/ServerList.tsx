'use client'

import { useState, useEffect } from 'react'
import { useGuildStore } from '@/stores/guildStore'
import { Plus, Home, Hash } from 'lucide-react'
import { CreateGuildModal } from '../modals/CreateGuildModal'

export function ServerList() {
  const { guilds, loading, fetchUserGuilds } = useGuildStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchUserGuilds()
  }, [fetchUserGuilds])

  return (
    <div className="server-list w-full h-full flex flex-col items-center py-4 space-y-2">
      {/* Home Server */}
      <div className="server-icon glass w-12 h-12 rounded-2xl flex items-center justify-center hover-lift cursor-pointer">
        <Home className="w-6 h-6 text-white" />
      </div>

      {/* Separator */}
      <div className="w-8 h-px bg-gray-700 my-2" />

      {/* User's Servers */}
      {loading ? (
        <div className="flex flex-col items-center space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="server-icon glass w-12 h-12 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {guilds.map((guild) => (
            <div
              key={guild.id}
              className="server-icon glass w-12 h-12 rounded-2xl flex items-center justify-center hover-lift cursor-pointer relative group"
              onClick={() => useGuildStore.getState().setCurrentGuild(guild)}
            >
              {guild.icon ? (
                <img
                  src={guild.icon}
                  alt={guild.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Server name tooltip */}
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {guild.name}
              </div>
            </div>
          ))}

          {/* Create Server Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="server-icon glass w-12 h-12 rounded-2xl flex items-center justify-center hover-lift cursor-pointer group"
          >
            <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            
            {/* Tooltip */}
            <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Create Server
            </div>
          </button>
        </>
      )}

      {/* Create Guild Modal */}
      {showCreateModal && (
        <CreateGuildModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}