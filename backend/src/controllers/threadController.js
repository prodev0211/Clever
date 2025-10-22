const Message = require('../models/Message');
const Channel = require('../models/Channel');
const GuildMember = require('../models/GuildMember');

// Create a thread from a message
const createThread = async (req, res) => {
  try {
    const { channelId, messageId } = req.params;
    const { name, autoArchiveDuration } = req.body;
    const userId = req.user._id;

    // Check if user is member of guild/channel
    const channel = await Channel.findById(channelId);
    if (!channel || channel.isDeleted) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    if (channel.guildId) {
      const member = await GuildMember.findByGuildAndUser(channel.guildId, userId);
      if (!member) {
        return res.status(403).json({ error: 'You are not a member of this guild' });
      }
    }

    // Check if message exists
    const starterMessage = await Message.findById(messageId);
    if (!starterMessage || starterMessage.isDeleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Create thread channel
    const thread = new Channel({
      guildId: channel.guildId,
      parentId: channelId,
      name: name || `Thread-${starterMessage._id}`,
      type: 'GUILD_PUBLIC_THREAD',
      isThread: true,
      threadStarterId: messageId,
      autoArchiveDuration: autoArchiveDuration || 1440, // default 24h
      members: [userId],
      isDeleted: false
    });
    await thread.save();

    // Update starter message
    starterMessage.thread = {
      id: thread._id,
      name: thread.name,
      archived: false,
      autoArchiveDuration: thread.autoArchiveDuration,
      createTimestamp: thread.createdAt
    };
    starterMessage.type = 'THREAD_STARTER_MESSAGE';
    await starterMessage.save();

    res.status(201).json({
      thread: {
        id: thread._id,
        name: thread.name,
        parentId: thread.parentId,
        type: thread.type,
        autoArchiveDuration: thread.autoArchiveDuration,
        createdAt: thread.createdAt
      }
    });
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

// Reply to a message
const replyToMessage = async (req, res) => {
  try {
    const { channelId, messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Check if user is member of guild/channel
    const channel = await Channel.findById(channelId);
    if (!channel || channel.isDeleted) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    if (channel.guildId) {
      const member = await GuildMember.findByGuildAndUser(channel.guildId, userId);
      if (!member) {
        return res.status(403).json({ error: 'You are not a member of this guild' });
      }
    }

    // Check if message exists
    const referencedMessage = await Message.findById(messageId);
    if (!referencedMessage || referencedMessage.isDeleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Create reply message
    const reply = new Message({
      channelId,
      guildId: channel.guildId,
      authorId: userId,
      content,
      type: 'REPLY',
      messageReference: {
        messageId: referencedMessage._id,
        channelId: referencedMessage.channelId,
        guildId: referencedMessage.guildId
      }
    });
    await reply.save();

    res.status(201).json({
      message: {
        id: reply._id,
        content: reply.content,
        authorId: reply.authorId,
        type: reply.type,
        messageReference: reply.messageReference,
        createdAt: reply.createdAt
      }
    });
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({ error: 'Failed to reply to message' });
  }
};

module.exports = {
  createThread,
  replyToMessage
};