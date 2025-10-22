'use client';

import { useEffect, useState } from 'react';
import { useGuildStore } from '@/stores/guildStore';
import { Guild } from '@/stores/guildStore';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { CreateGuildModal } from './CreateGuildModal';

interface GuildListProps {
  onGuildSelect?: (guild: Guild | null) => void;
  selectedGuildId?: string | null;
}

export function GuildList({ onGuildSelect, selectedGuildId }: GuildListProps) {
  const { guilds, loading, error, fetchUserGuilds } = useGuildStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUserGuilds();
  }, [fetchUserGuilds]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        <p>Error loading guilds: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-2">
      {/* Home button */}
      <button
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors",
          !selectedGuildId && "bg-blue-600 hover:bg-blue-500"
        )}
        onClick={() => onGuildSelect?.(null)}
        title="Home"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </button>

      {/* Separator */}
      <div className="w-8 h-px bg-gray-600 mx-auto" />

      {/* Guilds */}
      {guilds.map((guild) => (
        <button
          key={guild.id}
          className={cn(
            "relative flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors group",
            selectedGuildId === guild.id && "bg-blue-600 hover:bg-blue-500"
          )}
          onClick={() => onGuildSelect?.(guild)}
          title={guild.name}
        >
          {guild.icon ? (
            <img
              src={guild.icon}
              alt={guild.name}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {guild.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
          
          {/* Guild name tooltip */}
          <div className="absolute left-14 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {guild.name}
          </div>
        </button>
      ))}

      {/* Add server button */}
      <button
        className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-green-600 transition-colors"
        title="Add Server"
        onClick={() => setShowCreateModal(true)}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Create Guild Modal */}
      <CreateGuildModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}