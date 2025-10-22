'use client';

import { useState } from 'react';
import { AuditLogList } from './AuditLogList';
import { BotList } from './BotList';
import { BotCreate } from './BotCreate';
import { WebhookList } from './WebhookList';
import { WebhookCreate } from './WebhookCreate';

interface GuildAdminPanelProps {
  guildId?: string;
}

type AdminTab = 'audit' | 'bots' | 'webhooks';

export function GuildAdminPanel({ guildId }: GuildAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('audit');

  if (!guildId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p>Select a server to view admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'audit'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Logs
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'bots'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('bots')}
        >
          Bots
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'webhooks'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('webhooks')}
        >
          Webhooks
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'audit' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">Audit Logs</h2>
              <p className="text-gray-400 text-sm">
                View all moderation actions and administrative changes
              </p>
            </div>
            <AuditLogList guildId={guildId} />
          </div>
        )}

        {activeTab === 'bots' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">Bot Management</h2>
              <p className="text-gray-400 text-sm">
                Manage bots and their permissions
              </p>
            </div>
            <div className="space-y-4">
              <BotCreate guildId={guildId} />
              <BotList guildId={guildId} />
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">Webhook Management</h2>
              <p className="text-gray-400 text-sm">
                Manage webhooks for external integrations
              </p>
            </div>
            <div className="space-y-4">
              <WebhookCreate guildId={guildId} />
              <WebhookList guildId={guildId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}