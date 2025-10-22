'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { ModerationActions } from './ModerationActions';

interface GuildMember {
  id: string;
  userId: string;
  guildId: string;
  username: string;
  avatar?: string;
  roles: string[];
  joinedAt: string;
  isOnline: boolean;
}

interface GuildMemberListProps {
  guildId?: string;
}

export function GuildMemberList({ guildId }: GuildMemberListProps) {
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (guildId) {
      fetchMembers();
    }
  }, [guildId]);

  const fetchMembers = async () => {
    if (!guildId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/guilds/${guildId}/members`);
      if (!response.ok) throw new Error('Failed to fetch members');
      
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2 p-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-2 bg-gray-700 rounded w-16 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400">
        <p>Error loading members: {error}</p>
      </div>
    );
  }

  if (!guildId) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p>Select a server to view members</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 p-2">
      <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Members — {members.length}
      </div>
      
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded-lg group">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Avatar
                src={member.avatar}
                alt={member.username}
                fallback={member.username.charAt(0).toUpperCase()}
                className="w-8 h-8"
              />
              <div className={`
                absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900
                ${member.isOnline ? 'bg-green-500' : 'bg-gray-500'}
              `} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {member.username}
              </span>
              <span className="text-xs text-gray-400">
                {member.roles.length > 0 ? member.roles.join(', ') : 'No roles'}
              </span>
            </div>
          </div>
          
          {/* ModerationActions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ModerationActions 
              guildId={guildId}
              memberId={member.id}
              userId={member.userId}
              username={member.username}
            />
          </div>
        </div>
      ))}
    </div>
  );
}