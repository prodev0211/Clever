const Message = require('../models/Message');
const Channel = require('../models/Channel');
const GuildMember = require('../models/GuildMember');
const { client: redisClient } = require('../config/redis');

// Send message
const sendMessage = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content, tts = false } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content cannot be empty'
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({
        error: 'Message content cannot exceed 2000 characters'
      });
    }

    // Check if channel exists and user has access
    const channel = await Channel.findById(channelId);
    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check permissions
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

      // TODO: Check channel-specific permissions
    } else {
      // DM channel
      if (!channel.recipients?.includes(userId)) {
        return res.status(403).json({
          error: 'You do not have access to this channel'
        });
      }
    }

    // Create message
    const message = new Message({
      channelId,
      guildId: channel.guildId,
      authorId: userId,
      content: content.trim(),
      tts
    });

    await message.save();

    // Populate author info
    await message.populate('authorId', 'username discriminator avatar');

    // Update channel's last message
    await Channel.findByIdAndUpdate(channelId, {
      lastMessageId: message._id
    });

    // Emit to socket if available
    if (req.io) {
      req.io.to(`channel:${channelId}`).emit('MESSAGE_CREATE', {
        id: message._id,
        channelId: message.channelId,
        guildId: message.guildId,
        authorId: message.authorId,
        content: message.content,
        tts: message.tts,
        type: message.type,
        flags: message.flags,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        author: {
          id: message.authorId._id,
          username: message.authorId.username,
          discriminator: message.authorId.discriminator,
          avatar: message.authorId.avatar
        }
      });
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        id: message._id,
        channelId: message.channelId,
        guildId: message.guildId,
        authorId: message.authorId._id,
        content: message.content,
        tts: message.tts,
        type: message.type,
        flags: message.flags,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        author: {
          id: message.authorId._id,
          username: message.authorId.username,
          discriminator: message.authorId.discriminator,
          avatar: message.authorId.avatar
        }
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Failed to send message'
    });
  }
};

// Get messages
const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before, after } = req.query;
    const userId = req.user._id;

    // Check if channel exists and user has access
    const channel = await Channel.findById(channelId);
    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check permissions
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

    // Format messages
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      channelId: msg.channelId,
      guildId: msg.guildId,
      authorId: msg.authorId._id,
      content: msg.content,
      tts: msg.tts,
      type: msg.type,
      flags: msg.flags,
      editedTimestamp: msg.editedTimestamp,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      author: {
        id: msg.authorId._id,
        username: msg.authorId.username,
        discriminator: msg.authorId.discriminator,
        avatar: msg.authorId.avatar
      }
    }));

    res.json({
      messages: formattedMessages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      error: 'Failed to get messages'
    });
  }
};

// Update message
const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Message content cannot be empty'
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({
        error: 'Message content cannot exceed 2000 characters'
      });
    }

    // Find message
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Check if user is author
    if (message.authorId.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'You can only edit your own messages'
      });
    }

    // Update message
    message.content = content.trim();
    message.editedTimestamp = new Date();
    await message.save();

    // Populate author info
    await message.populate('authorId', 'username discriminator avatar');

    // Emit to socket if available
    if (req.io) {
      req.io.to(`channel:${message.channelId}`).emit('MESSAGE_UPDATE', {
        id: message._id,
        channelId: message.channelId,
        guildId: message.guildId,
        authorId: message.authorId._id,
        content: message.content,
        editedTimestamp: message.editedTimestamp,
        type: message.type,
        flags: message.flags,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        author: {
          id: message.authorId._id,
          username: message.authorId.username,
          discriminator: message.authorId.discriminator,
          avatar: message.authorId.avatar
        }
      });
    }

    res.json({
      message: 'Message updated successfully',
      data: {
        id: message._id,
        channelId: message.channelId,
        guildId: message.guildId,
        authorId: message.authorId._id,
        content: message.content,
        editedTimestamp: message.editedTimestamp,
        type: message.type,
        flags: message.flags,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        author: {
          id: message.authorId._id,
          username: message.authorId.username,
          discriminator: message.authorId.discriminator,
          avatar: message.authorId.avatar
        }
      }
    });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      error: 'Failed to update message'
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Find message
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Check permissions
    let canDelete = false;

    // Check if user is author
    if (message.authorId.toString() === userId.toString()) {
      canDelete = true;
    } else {
      // Check if user has manage messages permission
      if (message.guildId) {
        const guildMember = await GuildMember.findOne({
          guildId: message.guildId,
          userId
        });

        if (guildMember) {
          // TODO: Check MANAGE_MESSAGES permission
          // For now, only allow guild owners to delete others' messages
          const guild = await Guild.findById(message.guildId);
          if (guild && guild.ownerId.toString() === userId.toString()) {
            canDelete = true;
          }
        }
      }
    }

    if (!canDelete) {
      return res.status(403).json({
        error: 'You do not have permission to delete this message'
      });
    }

    // Soft delete message
    message.isDeleted = true;
    await message.save();

    // Emit to socket if available
    if (req.io) {
      req.io.to(`channel:${message.channelId}`).emit('MESSAGE_DELETE', {
        id: message._id,
        channelId: message.channelId
      });
    }

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      error: 'Failed to delete message'
    });
  }
};

// Bulk delete messages
const bulkDeleteMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { messages } = req.body; // Array of message IDs
    const userId = req.user._id;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Messages array is required'
      });
    }

    if (messages.length > 100) {
      return res.status(400).json({
        error: 'Cannot delete more than 100 messages at once'
      });
    }

    // Check channel access
    const channel = await Channel.findById(channelId);
    if (!channel || channel.isDeleted) {
      return res.status(404).json({
        error: 'Channel not found'
      });
    }

    // Check permissions
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

      // TODO: Check MANAGE_MESSAGES permission
    }

    // Get messages to delete
    const messagesToDelete = await Message.find({
      _id: { $in: messages },
      channelId,
      isDeleted: false
    });

    if (messagesToDelete.length === 0) {
      return res.status(404).json({
        error: 'No messages found to delete'
      });
    }

    // Soft delete messages
    await Message.updateMany(
      { _id: { $in: messages } },
      { isDeleted: true }
    );

    // Emit to socket if available
    if (req.io) {
      req.io.to(`channel:${channelId}`).emit('MESSAGE_DELETE_BULK', {
        channelId,
        messageIds: messages
      });
    }

    res.json({
      message: `Successfully deleted ${messagesToDelete.length} messages`
    });
  } catch (error) {
    console.error('Bulk delete messages error:', error);
    res.status(500).json({
      error: 'Failed to delete messages'
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  bulkDeleteMessages
};