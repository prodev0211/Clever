'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface AuditLog {
  id: string;
  actionType: string;
  executorId: string;
  targetId?: string;
  guildId: string;
  changes?: Record<string, unknown>;
  reason?: string;
  createdAt: string;
}

interface AuditLogListProps {
  guildId: string;
}

export function AuditLogList({ guildId }: AuditLogListProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/auditlog/${guildId}`)
      .then(res => setLogs(res.data.logs))
      .catch(e => setError(e.response?.data?.error || 'Failed to fetch logs'))
      .finally(() => setLoading(false));
  }, [guildId]);

  if (loading) return <div className="p-4 text-gray-400">Loading audit logs...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;
  if (logs.length === 0) return <div className="p-4 text-gray-400">No audit logs found.</div>;

  return (
    <div className="p-4 space-y-2">
      {logs.map(log => (
        <div key={log._id} className="bg-gray-800 rounded p-3 flex items-center space-x-3">
          <span className="text-blue-400 font-bold">{log.actionType}</span>
          <span className="text-gray-300">Target: {log.targetType} {log.targetId}</span>
          <span className="text-gray-400">By: {log.userId}</span>
          <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
          {log.reason && <span className="text-xs text-yellow-400 ml-2">Reason: {log.reason}</span>}
        </div>
      ))}
    </div>
  );
}