import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/authStore';
import { SocketEvents } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create new socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Handle READY event
    socketRef.current.on('READY', (data) => {
      console.log('Socket ready:', data);
    });

    // Handle presence updates
    socketRef.current.on('PRESENCE_UPDATE', (data) => {
      console.log('Presence update:', data);
      // TODO: Update user presence in store
    });

    // Handle typing indicators
    socketRef.current.on('TYPING_START', (data) => {
      console.log('Typing start:', data);
      // TODO: Update typing state in store
    });

    socketRef.current.on('TYPING_STOP', (data) => {
      console.log('Typing stop:', data);
      // TODO: Update typing state in store
    });

    // Handle message events
    socketRef.current.on('MESSAGE_CREATE', (data) => {
      console.log('Message created:', data);
      // TODO: Add message to store
    });

    socketRef.current.on('MESSAGE_UPDATE', (data) => {
      console.log('Message updated:', data);
      // TODO: Update message in store
    });

    socketRef.current.on('MESSAGE_DELETE', (data) => {
      console.log('Message deleted:', data);
      // TODO: Remove message from store
    });

    // Handle channel events
    socketRef.current.on('CHANNEL_CREATE', (data) => {
      console.log('Channel created:', data);
      // TODO: Add channel to store
    });

    socketRef.current.on('CHANNEL_UPDATE', (data) => {
      console.log('Channel updated:', data);
      // TODO: Update channel in store
    });

    socketRef.current.on('CHANNEL_DELETE', (data) => {
      console.log('Channel deleted:', data);
      // TODO: Remove channel from store
    });

    // Handle guild events
    socketRef.current.on('GUILD_CREATE', (data) => {
      console.log('Guild created:', data);
      // TODO: Add guild to store
    });

    socketRef.current.on('GUILD_UPDATE', (data) => {
      console.log('Guild updated:', data);
      // TODO: Update guild in store
    });

    socketRef.current.on('GUILD_DELETE', (data) => {
      console.log('Guild deleted:', data);
      // TODO: Remove guild from store
    });

    // Handle heartbeat
    socketRef.current.on('HEARTBEAT_ACK', () => {
      console.log('Heartbeat acknowledged');
    });
  }, [isAuthenticated, user]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback(<K extends keyof SocketEvents>(
    event: K,
    data: Parameters<SocketEvents[K]>[0]
  ) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const joinGuild = useCallback((guildId: string) => {
    emit('GUILD_JOIN', { guildId });
  }, [emit]);

  const leaveGuild = useCallback((guildId: string) => {
    emit('GUILD_LEAVE', { guildId });
  }, [emit]);

  const joinChannel = useCallback((channelId: string) => {
    emit('CHANNEL_JOIN', { channelId });
  }, [emit]);

  const leaveChannel = useCallback((channelId: string) => {
    emit('CHANNEL_LEAVE', { channelId });
  }, [emit]);

  const startTyping = useCallback((channelId: string) => {
    emit('TYPING_START', { channelId });
  }, [emit]);

  const stopTyping = useCallback((channelId: string) => {
    emit('TYPING_STOP', { channelId });
  }, [emit]);

  const updatePresence = useCallback((status: string, customStatus?: any) => {
    emit('PRESENCE_UPDATE', { status, customStatus });
  }, [emit]);

  const sendHeartbeat = useCallback(() => {
    emit('HEARTBEAT', {});
  }, [emit]);

  // Connect/disconnect based on authentication state
  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user, connect, disconnect]);

  // Set up heartbeat interval
  useEffect(() => {
    if (!socketRef.current) return;

    const heartbeatInterval = setInterval(() => {
      sendHeartbeat();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [sendHeartbeat]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    joinGuild,
    leaveGuild,
    joinChannel,
    leaveChannel,
    startTyping,
    stopTyping,
    updatePresence,
    emit,
  };
};