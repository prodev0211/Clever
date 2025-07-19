'use client';

import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSocket } from '@/hooks/useSocket';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function AppPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isConnected } = useSocket();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Not authenticated
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please log in to access the application.
          </p>
          <Button onClick={() => window.location.href = '/auth/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Server List Sidebar */}
      <div className="w-16 bg-gray-800 dark:bg-gray-950 flex flex-col items-center py-4 space-y-2">
        {/* Home Server */}
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        
        {/* Separator */}
        <div className="w-8 h-px bg-gray-600"></div>
        
        {/* Add Server Button */}
        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      {/* Channel List Sidebar */}
      <div className="w-60 bg-gray-700 dark:bg-gray-800 flex flex-col">
        {/* Server Header */}
        <div className="h-12 bg-gray-800 dark:bg-gray-900 flex items-center px-4 border-b border-gray-600">
          <h1 className="text-white font-semibold">DevOnNight</h1>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {/* Text Channels */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
              Text Channels
            </div>
            <div className="space-y-1">
              <div className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-600 rounded cursor-pointer">
                <span className="text-gray-400 mr-2">#</span>
                general
              </div>
              <div className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-600 rounded cursor-pointer">
                <span className="text-gray-400 mr-2">#</span>
                announcements
              </div>
              <div className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-600 rounded cursor-pointer">
                <span className="text-gray-400 mr-2">#</span>
                random
              </div>
            </div>

            {/* Voice Channels */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1 mt-4">
              Voice Channels
            </div>
            <div className="space-y-1">
              <div className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-600 rounded cursor-pointer">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                General
              </div>
              <div className="flex items-center px-2 py-1 text-gray-300 hover:bg-gray-600 rounded cursor-pointer">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Gaming
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="h-16 bg-gray-800 dark:bg-gray-900 flex items-center px-2 border-t border-gray-600">
          <div className="flex items-center space-x-2 flex-1">
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="sm"
              status={user.status}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {user.username}
              </div>
              <div className="text-xs text-gray-400">
                #{user.discriminator}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              className="p-1 text-gray-400 hover:text-white"
              onClick={logout}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Channel Header */}
        <div className="h-12 bg-gray-100 dark:bg-gray-800 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">#</span>
            <h2 className="font-semibold text-gray-900 dark:text-white">general</h2>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Welcome Message */}
            <div className="flex items-start space-x-3">
              <Avatar
                src={user.avatar}
                alt={user.username}
                size="md"
                status={user.status}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </span>
                  <span className="text-sm text-gray-500">
                    #{user.discriminator}
                  </span>
                  <span className="text-xs text-gray-400">
                    Today at 12:00 PM
                  </span>
                </div>
                <div className="mt-1 text-gray-700 dark:text-gray-300">
                  Welcome to DevOnNight! 🎉 This is a Discord-like chat application built with Next.js, Express, and Socket.IO.
                </div>
              </div>
            </div>

            {/* System Message */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    DevOnNight Bot
                  </span>
                  <span className="text-xs text-gray-400">
                    Today at 12:01 PM
                  </span>
                </div>
                <div className="mt-1 text-gray-700 dark:text-gray-300">
                  <strong>Features implemented:</strong>
                  <br />• User authentication (login/register)
                  <br />• Real-time Socket.IO connection
                  <br />• Discord-like UI layout
                  <br />• Dark mode support
                  <br />• Responsive design
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Message #general"
                className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}