const GuildMember = require('../models/GuildMember');
const Role = require('../models/Role');

// Permission flags (bitwise)
const Permissions = {
  CREATE_INSTANT_INVITE: 1 << 0,
  KICK_MEMBERS: 1 << 1,
  BAN_MEMBERS: 1 << 2,
  ADMINISTRATOR: 1 << 3,
  MANAGE_CHANNELS: 1 << 4,
  MANAGE_GUILD: 1 << 5,
  ADD_REACTIONS: 1 << 6,
  VIEW_AUDIT_LOG: 1 << 7,
  PRIORITY_SPEAKER: 1 << 8,
  STREAM: 1 << 9,
  VIEW_CHANNEL: 1 << 10,
  SEND_MESSAGES: 1 << 11,
  USE_SLASH_COMMANDS: 1 << 12,
  MANAGE_MESSAGES: 1 << 13,
  EMBED_LINKS: 1 << 14,
  ATTACH_FILES: 1 << 15,
  READ_MESSAGE_HISTORY: 1 << 16,
  MENTION_EVERYONE: 1 << 17,
  USE_EXTERNAL_EMOJIS: 1 << 18,
  VIEW_GUILD_INSIGHTS: 1 << 19,
  CONNECT: 1 << 20,
  SPEAK: 1 << 21,
  MUTE_MEMBERS: 1 << 22,
  DEAFEN_MEMBERS: 1 << 23,
  MOVE_MEMBERS: 1 << 24,
  USE_VAD: 1 << 25,
  CHANGE_NICKNAME: 1 << 26,
  MANAGE_NICKNAMES: 1 << 27,
  MANAGE_ROLES: 1 << 28,
  MANAGE_WEBHOOKS: 1 << 29,
  MANAGE_EMOJIS_AND_STICKERS: 1 << 30,
  USE_APPLICATION_COMMANDS: 1 << 31,
  REQUEST_TO_SPEAK: 1 << 32,
  MANAGE_THREADS: 1 << 34,
  USE_PUBLIC_THREADS: 1 << 35,
  USE_PRIVATE_THREADS: 1 << 36,
  USE_EXTERNAL_STICKERS: 1 << 37,
  SEND_MESSAGES_IN_THREADS: 1 << 38,
  USE_ACTIVITIES: 1 << 39,
  MODERATE_MEMBERS: 1 << 40
};

// Check if user has specific permission in guild
const checkGuildPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { guildId } = req.params;
      const userId = req.user._id;

      if (!guildId) {
        return res.status(400).json({ error: 'Guild ID is required' });
      }

      // Get user's guild member record
      const guildMember = await GuildMember.findOne({
        guildId,
        userId
      }).populate('roles');

      if (!guildMember) {
        return res.status(403).json({ error: 'You are not a member of this guild' });
      }

      // Check if user is guild owner (has all permissions)
      const Guild = require('../models/Guild');
      const guild = await Guild.findById(guildId);
      if (guild && guild.ownerId.toString() === userId.toString()) {
        return next();
      }

      // Calculate user's permissions from roles
      let userPermissions = 0;
      
      for (const role of guildMember.roles) {
        if (role.permissions) {
          userPermissions |= parseInt(role.permissions);
        }
      }

      // Check if user has the required permission
      const requiredPermission = Permissions[permission];
      if (!requiredPermission) {
        return res.status(400).json({ error: 'Invalid permission' });
      }

      if ((userPermissions & requiredPermission) !== requiredPermission) {
        return res.status(403).json({ 
          error: `You don't have the ${permission} permission in this guild` 
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Failed to check permissions' });
    }
  };
};

// Check if user has permission in specific channel
const checkChannelPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const { channelId } = req.params;
      const userId = req.user._id;

      if (!channelId) {
        return res.status(400).json({ error: 'Channel ID is required' });
      }

      // Get channel and its guild
      const Channel = require('../models/Channel');
      const channel = await Channel.findById(channelId);
      
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }

      // Check guild permissions
      const guildMember = await GuildMember.findOne({
        guildId: channel.guildId,
        userId
      }).populate('roles');

      if (!guildMember) {
        return res.status(403).json({ error: 'You are not a member of this guild' });
      }

      // Check if user is guild owner
      const Guild = require('../models/Guild');
      const guild = await Guild.findById(channel.guildId);
      if (guild && guild.ownerId.toString() === userId.toString()) {
        return next();
      }

      // Calculate user's permissions
      let userPermissions = 0;
      
      for (const role of guildMember.roles) {
        if (role.permissions) {
          userPermissions |= parseInt(role.permissions);
        }
      }

      // Check if user has the required permission
      const requiredPermission = Permissions[permission];
      if (!requiredPermission) {
        return res.status(400).json({ error: 'Invalid permission' });
      }

      if ((userPermissions & requiredPermission) !== requiredPermission) {
        return res.status(403).json({ 
          error: `You don't have the ${permission} permission in this channel` 
        });
      }

      next();
    } catch (error) {
      console.error('Channel permission check error:', error);
      res.status(500).json({ error: 'Failed to check channel permissions' });
    }
  };
};

// Check if user can manage specific user
const checkManageUserPermission = async (req, res, next) => {
  try {
    const { userId: targetUserId } = req.params;
    const { guildId } = req.body;
    const currentUserId = req.user._id;

    if (!guildId) {
      return res.status(400).json({ error: 'Guild ID is required' });
    }

    // Get both users' guild member records
    const [currentMember, targetMember] = await Promise.all([
      GuildMember.findOne({ guildId, userId: currentUserId }).populate('roles'),
      GuildMember.findOne({ guildId, userId: targetUserId }).populate('roles')
    ]);

    if (!currentMember) {
      return res.status(403).json({ error: 'You are not a member of this guild' });
    }

    if (!targetMember) {
      return res.status(404).json({ error: 'Target user is not a member of this guild' });
    }

    // Check if current user is guild owner
    const Guild = require('../models/Guild');
    const guild = await Guild.findById(guildId);
    if (guild && guild.ownerId.toString() === currentUserId.toString()) {
      return next();
    }

    // Calculate permissions
    let currentUserPermissions = 0;
    let targetUserPermissions = 0;

    for (const role of currentMember.roles) {
      if (role.permissions) {
        currentUserPermissions |= parseInt(role.permissions);
      }
    }

    for (const role of targetMember.roles) {
      if (role.permissions) {
        targetUserPermissions |= parseInt(role.permissions);
      }
    }

    // Check if current user has higher permissions than target
    if (currentUserPermissions <= targetUserPermissions) {
      return res.status(403).json({ 
        error: 'You cannot manage users with equal or higher permissions' 
      });
    }

    // Check if current user has moderation permissions
    const requiredPermissions = Permissions.KICK_MEMBERS | Permissions.BAN_MEMBERS;
    if ((currentUserPermissions & requiredPermissions) === 0) {
      return res.status(403).json({ 
        error: 'You don\'t have moderation permissions' 
      });
    }

    next();
  } catch (error) {
    console.error('Manage user permission check error:', error);
    res.status(500).json({ error: 'Failed to check manage user permissions' });
  }
};

module.exports = {
  checkGuildPermission,
  checkChannelPermission,
  checkManageUserPermission,
  Permissions
};