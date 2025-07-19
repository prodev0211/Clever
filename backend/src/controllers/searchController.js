const Message = require('../models/Message');
const Channel = require('../models/Channel');
const Guild = require('../models/Guild');
const GuildMember = require('../models/GuildMember');
const User = require('../models/User');

// Search messages
const searchMessages = async (req, res) => {
  try {
    const { query, guildId, channelId, authorId, hasAttachments, hasEmbeds, before, after, limit = 25 } = req.query;
    const userId = req.user._id;

    // Build search filter
    const filter = {
      isDeleted: false
    };

    // Add query filter
    if (query) {
      filter.content = { $regex: query, $options: 'i' };
    }

    // Add guild filter
    if (guildId) {
      filter.guildId = guildId;
      
      // Check if user has access to guild
      const member = await GuildMember.findByGuildAndUser(guildId, userId);
      if (!member) {
        return res.status(403).json({
          error: 'You do not have access to this guild'
        });
      }
    }

    // Add channel filter
    if (channelId) {
      filter.channelId = channelId;
      
      // Check if user has access to channel
      const channel = await Channel.findById(channelId);
      if (!channel || channel.isDeleted) {
        return res.status(404).json({
          error: 'Channel not found'
        });
      }

      if (channel.guildId) {
        const member = await GuildMember.findByGuildAndUser(channel.guildId, userId);
        if (!member) {
          return res.status(403).json({
            error: 'You do not have access to this channel'
          });
        }
      }
    }

    // Add author filter
    if (authorId) {
      filter.authorId = authorId;
    }

    // Add attachment filter
    if (hasAttachments === 'true') {
      filter.attachments = { $exists: true, $ne: [] };
    }

    // Add embed filter
    if (hasEmbeds === 'true') {
      filter.embeds = { $exists: true, $ne: [] };
    }

    // Add date filters
    if (before) {
      filter.createdAt = { ...filter.createdAt, $lt: new Date(before) };
    }
    if (after) {
      filter.createdAt = { ...filter.createdAt, $gt: new Date(after) };
    }

    // Execute search
    const messages = await Message.find(filter)
      .populate('authorId', 'username discriminator avatar')
      .populate('channelId', 'name type')
      .populate('guildId', 'name icon')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      messages: messages.map(msg => ({
        id: msg._id,
        content: msg.content,
        author: {
          id: msg.authorId._id,
          username: msg.authorId.username,
          discriminator: msg.authorId.discriminator,
          avatar: msg.authorId.avatar
        },
        channel: {
          id: msg.channelId._id,
          name: msg.channelId.name,
          type: msg.channelId.type
        },
        guild: msg.guildId ? {
          id: msg.guildId._id,
          name: msg.guildId.name,
          icon: msg.guildId.icon
        } : null,
        attachments: msg.attachments,
        embeds: msg.embeds,
        createdAt: msg.createdAt,
        editedAt: msg.editedTimestamp
      }))
    });
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({
      error: 'Failed to search messages'
    });
  }
};

// Search channels
const searchChannels = async (req, res) => {
  try {
    const { query, guildId, type, limit = 25 } = req.query;
    const userId = req.user._id;

    const filter = {
      isDeleted: false
    };

    // Add query filter
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    // Add guild filter
    if (guildId) {
      filter.guildId = guildId;
      
      // Check if user has access to guild
      const member = await GuildMember.findByGuildAndUser(guildId, userId);
      if (!member) {
        return res.status(403).json({
          error: 'You do not have access to this guild'
        });
      }
    }

    // Add type filter
    if (type) {
      filter.type = type;
    }

    const channels = await Channel.find(filter)
      .populate('guildId', 'name icon')
      .sort({ name: 1 })
      .limit(parseInt(limit));

    res.json({
      channels: channels.map(channel => ({
        id: channel._id,
        name: channel.name,
        type: channel.type,
        topic: channel.topic,
        guild: channel.guildId ? {
          id: channel.guildId._id,
          name: channel.guildId.name,
          icon: channel.guildId.icon
        } : null,
        createdAt: channel.createdAt
      }))
    });
  } catch (error) {
    console.error('Search channels error:', error);
    res.status(500).json({
      error: 'Failed to search channels'
    });
  }
};

// Search guilds
const searchGuilds = async (req, res) => {
  try {
    const { query, limit = 25 } = req.query;
    const userId = req.user._id;

    // Get user's guilds
    const userGuilds = await GuildMember.find({ userId, isDeleted: false })
      .populate('guildId')
      .then(members => members.map(member => member.guildId));

    const filter = {
      _id: { $in: userGuilds.map(g => g._id) },
      isDeleted: false
    };

    // Add query filter
    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    const guilds = await Guild.find(filter)
      .sort({ name: 1 })
      .limit(parseInt(limit));

    res.json({
      guilds: guilds.map(guild => ({
        id: guild._id,
        name: guild.name,
        icon: guild.icon,
        description: guild.description,
        memberCount: guild.memberCount,
        createdAt: guild.createdAt
      }))
    });
  } catch (error) {
    console.error('Search guilds error:', error);
    res.status(500).json({
      error: 'Failed to search guilds'
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query, guildId, limit = 25 } = req.query;
    const userId = req.user._id;

    let userFilter = {};

    // Add query filter
    if (query) {
      userFilter.$or = [
        { username: { $regex: query, $options: 'i' } },
        { discriminator: { $regex: query, $options: 'i' } }
      ];
    }

    let users;

    if (guildId) {
      // Search users in specific guild
      const member = await GuildMember.findByGuildAndUser(guildId, userId);
      if (!member) {
        return res.status(403).json({
          error: 'You do not have access to this guild'
        });
      }

      const guildMembers = await GuildMember.find({ guildId, isDeleted: false })
        .populate('userId', 'username discriminator avatar status')
        .then(members => members.map(member => member.userId));

      users = guildMembers.filter(user => {
        if (!query) return true;
        return user.username.toLowerCase().includes(query.toLowerCase()) ||
               user.discriminator.includes(query);
      });
    } else {
      // Search all users (limited to avoid performance issues)
      users = await User.find(userFilter)
        .select('username discriminator avatar status')
        .limit(parseInt(limit));
    }

    res.json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        status: user.status
      }))
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Failed to search users'
    });
  }
};

// Global search
const globalSearch = async (req, res) => {
  try {
    const { query, types = ['messages', 'channels', 'guilds', 'users'], limit = 10 } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const results = {};

    // Search messages
    if (types.includes('messages')) {
      const messages = await Message.find({
        content: { $regex: query, $options: 'i' },
        isDeleted: false
      })
      .populate('authorId', 'username discriminator avatar')
      .populate('channelId', 'name type')
      .populate('guildId', 'name icon')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

      results.messages = messages.map(msg => ({
        id: msg._id,
        content: msg.content,
        author: {
          id: msg.authorId._id,
          username: msg.authorId.username,
          discriminator: msg.authorId.discriminator,
          avatar: msg.authorId.avatar
        },
        channel: {
          id: msg.channelId._id,
          name: msg.channelId.name,
          type: msg.channelId.type
        },
        guild: msg.guildId ? {
          id: msg.guildId._id,
          name: msg.guildId.name,
          icon: msg.guildId.icon
        } : null,
        createdAt: msg.createdAt
      }));
    }

    // Search channels
    if (types.includes('channels')) {
      const userGuilds = await GuildMember.find({ userId, isDeleted: false })
        .populate('guildId')
        .then(members => members.map(member => member.guildId._id));

      const channels = await Channel.find({
        name: { $regex: query, $options: 'i' },
        guildId: { $in: userGuilds },
        isDeleted: false
      })
      .populate('guildId', 'name icon')
      .sort({ name: 1 })
      .limit(parseInt(limit));

      results.channels = channels.map(channel => ({
        id: channel._id,
        name: channel.name,
        type: channel.type,
        guild: {
          id: channel.guildId._id,
          name: channel.guildId.name,
          icon: channel.guildId.icon
        }
      }));
    }

    // Search guilds
    if (types.includes('guilds')) {
      const userGuilds = await GuildMember.find({ userId, isDeleted: false })
        .populate('guildId')
        .then(members => members.map(member => member.guildId));

      const guilds = userGuilds.filter(guild => 
        guild.name.toLowerCase().includes(query.toLowerCase())
      );

      results.guilds = guilds.map(guild => ({
        id: guild._id,
        name: guild.name,
        icon: guild.icon,
        memberCount: guild.memberCount
      }));
    }

    // Search users
    if (types.includes('users')) {
      const userGuilds = await GuildMember.find({ userId, isDeleted: false })
        .populate('guildId')
        .then(members => members.map(member => member.guildId._id));

      const guildMembers = await GuildMember.find({
        guildId: { $in: userGuilds },
        isDeleted: false
      })
      .populate('userId', 'username discriminator avatar status')
      .then(members => members.map(member => member.userId));

      const users = guildMembers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.discriminator.includes(query)
      );

      results.users = users.map(user => ({
        id: user._id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        status: user.status
      }));
    }

    res.json({ results });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      error: 'Failed to perform global search'
    });
  }
};

module.exports = {
  searchMessages,
  searchChannels,
  searchGuilds,
  searchUsers,
  globalSearch
};