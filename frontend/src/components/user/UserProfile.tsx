'use client'

import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { 
  ChevronDown, 
  Settings, 
  LogOut, 
  User, 
  Shield,
  Crown,
  Mic,
  Headphones
} from 'lucide-react'

interface UserProfileProps {
  user: any
}

export function UserProfile({ user }: UserProfileProps) {
  const { logout } = useAuthStore()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 glass px-3 py-2 rounded-lg hover-lift"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900" />
        </div>

        {/* User info */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white truncate max-w-24">
            {user?.username || 'User'}
          </p>
          <p className="text-xs text-gray-400">Online</p>
        </div>

        {/* Dropdown arrow */}
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 w-64 glass rounded-lg shadow-lg border border-gray-800 z-50">
          {/* User info section */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-400">#{user?.discriminator || '0000'}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <User className="w-4 h-4" />
              <span>My Account</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span>User Settings</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
              <Shield className="w-4 h-4" />
              <span>Privacy & Safety</span>
            </button>

            <div className="border-t border-gray-800 my-2" />

            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}