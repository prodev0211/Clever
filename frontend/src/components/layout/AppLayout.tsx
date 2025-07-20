'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useGuildStore } from '@/stores/guildStore'
import { ServerList } from '@/components/server/ServerList'
import { ChannelList } from '@/components/channel/ChannelList'
import { MessageArea } from '@/components/message/MessageArea'
import { UserList } from '@/components/user/UserList'
import { UserProfile } from '@/components/user/UserProfile'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Menu, X } from 'lucide-react'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [channelSidebarOpen, setChannelSidebarOpen] = useState(false)
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { currentGuild } = useGuildStore()

  useEffect(() => {
    // Close sidebars on mobile when guild changes
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
      setChannelSidebarOpen(false)
    }
  }, [currentGuild])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in</h1>
          <p className="text-gray-400">You need to be authenticated to access the app.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass p-2 rounded-lg hover-lift"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Server List Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40 w-20 md:w-20
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ServerList />
      </div>

      {/* Channel List Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-20 z-30 w-64 md:w-64
        transform transition-transform duration-300 ease-in-out
        ${channelSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ChannelList 
          onMobileMenuClick={() => setChannelSidebarOpen(!channelSidebarOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="glass border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setChannelSidebarOpen(!channelSidebarOpen)}
              className="md:hidden glass p-2 rounded-lg hover-lift"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {currentGuild?.name || 'Select a Server'}
              </h1>
              <p className="text-sm text-gray-400">
                {currentGuild ? `${currentGuild.memberCount} members` : 'No server selected'}
              </p>
            </div>
          </div>
          <UserProfile user={user} />
        </div>

        {/* Message Area */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col">
            <MessageArea />
          </div>
          
          {/* User List Sidebar */}
          <div className="hidden lg:block w-60">
            <UserList />
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {channelSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setChannelSidebarOpen(false)}
        />
      )}
    </div>
  )
}