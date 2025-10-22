const Channel = require('../models/Channel');
const Guild = require('../models/Guild');
const GuildMember = require('../models/GuildMember');
const Message = require('../models/Message');

// Create channel
const createChannel = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { name, type, topic, parentId, position } = req.body;
    const userId = req.user._id;

    // Check if user is member of guild
    const guildMember = await GuildMember.findOne({
      guildId,
      userId
    });

    if (!guildMember) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    // Check if user has permission to create channels
    // TODO: Implement permission checking
    const guild = await Guild.findById(guildId);
    const isOwner = guild.ownerId.toString() === userId.toString();
    
    if (!isOwner) {
      return res.status(403).json({
        error: 'You do not have permission to create channels'
      });
    }

    // Validate input
    if (!name || name.trim().length < 1) {
      return res.status(400).json({
        error: 'Channel name is required'
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        error: 'Channel name must be less than 100 characters'
      });
    }

    // Check if channel name already exists in guild
    const existingChannel = await Channel.findOne({
      guildId,
      name: name.trim(),
      isDeleted: false
    });

    if (existingChannel) {
      return res.status(400).json({
        error: 'A channel with this name already exists'
      });
    }

    // Determine position if not provided
    let channelPosition = position;
    if (channelPosition === undefined) {
      const maxPosition = await Channel.findOne({
        guildId,
        parentId: parentId || null,
        isDeleted: false
      }).sort({ position: -1 }).select('position');
      
      channelPosition = maxPosition ? maxPosition.position + 1 : 0;
    }

    // Create channel
    const channel = new Channel({
      guildId,
      name: name.trim(),
      type: type || 'GUILD_TEXT',
      topic: topic?.trim() || '',
      parentId: parentId || null,
      position: channelPosition
    });

    await channel.save();

    res.status(201).json({
      message: 'Channel created successfully',
      channel: {
        id: channel._id,
        name: channel.name,
        type: channel.type,
        topic: channel.topic,
        position: channel.position,
        parentId: channel.parentId,
        guildId: channel.guildId
      }
    });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({
      error: 'Failed to create channel'
    });
  }
};

// Get guild channels
const getGuildChannels = async (req, res) => {
  try {
    const { guildId } = req.params;
    const userId = req.user._id;

    // Check if user is member of guild
    const guildMember = await GuildMember.findOne({
      guildId,
      userId
    });

    if (!guildMember) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    // Get channels
    const channels = await Channel.find({
      guildId,
      isDeleted: false
    }).sort({ position: 1 });

    // Group channels by category
    const categories = {};
    const textChannels = [];
    const voiceChannels = [];

    channels.forEach(channel => {
      if (channel.type === 'GUILD_CATEGORY') {
        categories[channel._id] = {
          id: channel._id,
          name: channel.name,
          position: channel.position,
          channels: []
        };
      } else if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS') {
        if (channel.parentId && categories[channel.parentId]) {
          categories[channel.parentId].channels.push({
            id: channel._id,
            name: channel.name,
            type: channel.type,
            topic: channel.topic,
            position: channel.position,
            parentId: channel.parentId
          });
        } else {
          textChannels.push({
            id: channel._id,
            name: channel.name,
            type: channel.type,
            topic: channel.topic,
            position: channel.position,
            parentId: channel.parentId
          });
        }
      } else if (channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_STAGE_VOICE') {
        if (channel.parentId && categories[channel.parentId]) {
          categories[channel.parentId].channels.push({
            id: channel._id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parentId: channel.parentId
          });
        } else {
          voiceChannels.push({
            id: channel._id,
            name: channel.name,
            type: channel.type,
            position: channel.position,
            parentId: channel.parentId
          });
        }
      }
    });

    res.json({
      channels: {
        categories: Object.values(categories),
        textChannels,
        voiceChannels
      }
    });
  } catch (error) {
    console.error('Get guild channels error:', error);
    res.status(500).json({
      error: 'Failed to get guild channels'
    });
  }
};

// Get channel by ID
const getChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);

    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check if user has access to channel
    if (channel.guildId) {
      const guildMember = await GuildMember.findOne({
        guildId: channel.guildId,
        userId
      });

      if (!guildMember) {
        return res.status(403).json({
          error: 'You do not have access to this channel'
        });
      }
    } else {
      // DM channel - check if user is recipient
      if (!channel.recipients?.includes(userId)) {
        return res.status(403).json({
          error: 'You do not have access to this channel'
        });
      }
    }

    res.json({ channel });
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({
      error: 'Failed to get channel'
    });
  }
};

// Update channel
const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, topic, position, parentId } = req.body;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);

    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check permissions
    if (channel.guildId) {
      const guild = await Guild.findById(channel.guildId);
      const isOwner = guild.ownerId.toString() === userId.toString();
      
      if (!isOwner) {
        return res.status(403).json({
          error: 'You do not have permission to update this channel'
        });
      }
    }

    // Update fields
    if (name !== undefined) channel.name = name.trim();
    if (topic !== undefined) channel.topic = topic.trim();
    if (position !== undefined) channel.position = position;
    if (parentId !== undefined) channel.parentId = parentId;

    await channel.save();

    res.json({
      message: 'Channel updated successfully',
      channel: {
        id: channel._id,
        name: channel.name,
        type: channel.type,
        topic: channel.topic,
        position: channel.position,
        parentId: channel.parentId,
        guildId: channel.guildId
      }
    });
  } catch (error) {
    console.error('Update channel error:', error);
    res.status(500).json({
      error: 'Failed to update channel'
    });
  }
};

// Delete channel
const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);

    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check permissions
    if (channel.guildId) {
      const guild = await Guild.findById(channel.guildId);
      const isOwner = guild.ownerId.toString() === userId.toString();
      
      if (!isOwner) {
        return res.status(403).json({
          error: 'You do not have permission to delete this channel'
        });
      }
    }

    // Soft delete channel
    channel.isDeleted = true;
    await channel.save();

    // Delete all messages in the channel
    await Message.updateMany(
      { channelId },
      { isDeleted: true }
    );

    res.json({
      message: 'Channel deleted successfully'
    });
  } catch (error) {
    console.error('Delete channel error:', error);
    res.status(500).json({
      error: 'Failed to delete channel'
    });
  }
};

// Get channel messages
const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before, after } = req.query;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);

    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check if user has access to channel
    if (channel.guildId) {
      const guildMember = await GuildMember.findOne({
        guildId: channel.guildId,
        userId
      });

      if (!guildMember) {
        return res.status(403).json({
          error: 'You do not have access to this channel'
        });
      }
    } else {
      // DM channel
      if (!channel.recipients?.includes(userId)) {
        return res.status(403).json({
          error: 'You do not have access to this channel'
        });
      }
    }

    // Build query
    let query = { channelId, isDeleted: false };
    if (before) {
      query._id = { $lt: before };
    } else if (after) {
      query._id = { $gt: after };
    }

    const messages = await Message.find(query)
      .populate('authorId', 'username discriminator avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      messages: messages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get channel messages error:', error);
    res.status(500).json({
      error: 'Failed to get channel messages'
    });
  }
};

// Reorder channels
const reorderChannels = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { channels } = req.body; // Array of { id, position }
    const userId = req.user._id;

    // Check if user is owner
    const guild = await Guild.findById(guildId);
    if (!guild || guild.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'You do not have permission to reorder channels'
      });
    }

    // Update channel positions
    const updatePromises = channels.map(({ id, position }) =>
      Channel.findByIdAndUpdate(id, { position })
    );

    await Promise.all(updatePromises);

    res.json({
      message: 'Channels reordered successfully'
    });
  } catch (error) {
    console.error('Reorder channels error:', error);
    res.status(500).json({
      error: 'Failed to reorder channels'
    });
  }
};

module.exports = {
  createChannel,
  getGuildChannels,
  getChannel,
  updateChannel,
  deleteChannel,
  getChannelMessages,
  reorderChannels
};