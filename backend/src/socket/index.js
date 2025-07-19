const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { client: redisClient } = require('../config/redis');

const socketHandler = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.userId})`);

    // Store user's socket connection
    redisClient.hSet(`user:${socket.userId}`, 'socketId', socket.id);
    redisClient.hSet(`user:${socket.userId}`, 'status', 'online');
    redisClient.hSet(`user:${socket.userId}`, 'lastSeen', new Date().toISOString());

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Send READY event with user data
    socket.emit('READY', {
      user: {
        id: socket.user._id,
        username: socket.user.username,
        discriminator: socket.user.discriminator,
        avatar: socket.user.avatar,
        status: socket.user.status,
        customStatus: socket.user.customStatus
      },
      sessionId: socket.id
    });

    // Handle presence update
    socket.on('PRESENCE_UPDATE', async (data) => {
      try {
        const { status, customStatus } = data;
        
        // Update user status in database
        await User.findByIdAndUpdate(socket.userId, {
          status: status || 'online',
          customStatus: customStatus || null
        });

        // Update in Redis
        redisClient.hSet(`user:${socket.userId}`, 'status', status || 'online');
        if (customStatus) {
          redisClient.hSet(`user:${socket.userId}`, 'customStatus', JSON.stringify(customStatus));
        }

        // Broadcast presence update to all guilds user is in
        // TODO: Implement guild presence broadcasting
        socket.broadcast.emit('PRESENCE_UPDATE', {
          userId: socket.userId,
          status: status || 'online',
          customStatus
        });
      } catch (error) {
        console.error('Presence update error:', error);
      }
    });

    // Handle typing start
    socket.on('TYPING_START', (data) => {
      const { channelId } = data;
      socket.to(`channel:${channelId}`).emit('TYPING_START', {
        channelId,
        userId: socket.userId,
        username: socket.user.username
      });
    });

    // Handle typing stop
    socket.on('TYPING_STOP', (data) => {
      const { channelId } = data;
      socket.to(`channel:${channelId}`).emit('TYPING_STOP', {
        channelId,
        userId: socket.userId
      });
    });

    // Handle guild join
    socket.on('GUILD_JOIN', (data) => {
      const { guildId } = data;
      socket.join(`guild:${guildId}`);
      console.log(`User ${socket.user.username} joined guild ${guildId}`);
    });

    // Handle guild leave
    socket.on('GUILD_LEAVE', (data) => {
      const { guildId } = data;
      socket.leave(`guild:${guildId}`);
      console.log(`User ${socket.user.username} left guild ${guildId}`);
    });

    // Handle channel join
    socket.on('CHANNEL_JOIN', (data) => {
      const { channelId } = data;
      socket.join(`channel:${channelId}`);
      console.log(`User ${socket.user.username} joined channel ${channelId}`);
    });

    // Handle channel leave
    socket.on('CHANNEL_LEAVE', (data) => {
      const { channelId } = data;
      socket.leave(`channel:${channelId}`);
      console.log(`User ${socket.user.username} left channel ${channelId}`);
    });

    // Handle heartbeat
    socket.on('HEARTBEAT', () => {
      socket.emit('HEARTBEAT_ACK');
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.userId})`);

      // Update user status to offline
      await User.findByIdAndUpdate(socket.userId, { status: 'offline' });
      
      // Update Redis
      redisClient.hSet(`user:${socket.userId}`, 'status', 'offline');
      redisClient.hSet(`user:${socket.userId}`, 'lastSeen', new Date().toISOString());
      redisClient.del(`user:${socket.userId}:socketId`);

      // Broadcast offline status
      socket.broadcast.emit('PRESENCE_UPDATE', {
        userId: socket.userId,
        status: 'offline'
      });
    });
  });

  // Export io instance for use in other modules
  io.socketHandler = socketHandler;
};

module.exports = socketHandler;