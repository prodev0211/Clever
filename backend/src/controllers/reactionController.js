const MessageReaction = require('../models/MessageReaction');
const Message = require('../models/Message');

// Add reaction to message
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!emoji) {
      return res.status(400).json({
        error: 'Emoji is required'
      });
    }

    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Add reaction
    const reaction = await MessageReaction.addReaction(messageId, userId, emoji);

    // Get updated reactions for the message
    const reactions = await MessageReaction.getReactionsForMessage(messageId);

    // Emit to socket if available
    if (req.io) {
      req.io.to(`channel:${message.channelId}`).emit('MESSAGE_REACTION_ADD', {
        messageId,
        emoji,
        userId: userId.toString(),
        username: req.user.username,
        reactions
      });
    }

    res.json({
      message: 'Reaction added successfully',
      reaction: {
        messageId: reaction.messageId,
        userId: reaction.userId,
        emoji: reaction.emoji,
        count: reaction.count
      },
      reactions
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      error: 'Failed to add reaction'
    });
  }
};

// Remove reaction from message
const removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!emoji) {
      return res.status(400).json({
        error: 'Emoji is required'
      });
    }

    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Remove reaction
    const reaction = await MessageReaction.removeReaction(messageId, userId, emoji);
    
    if (!reaction) {
      return res.status(404).json({
        error: 'Reaction not found'
      });
    }

    // Get updated reactions for the message
    const reactions = await MessageReaction.getReactionsForMessage(messageId);

    // Emit to socket if available
    if (req.io) {
      req.io.to(`channel:${message.channelId}`).emit('MESSAGE_REACTION_REMOVE', {
        messageId,
        emoji,
        userId: userId.toString(),
        reactions
      });
    }

    res.json({
      message: 'Reaction removed successfully',
      reactions
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      error: 'Failed to remove reaction'
    });
  }
};

// Get reactions for a message
const getMessageReactions = async (req, res) => {
  try {
    const { messageId } = req.params;

    // Check if message exists
    const message = await Message.findById(messageId);
    if (!message || message.isDeleted) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Get reactions
    const reactions = await MessageReaction.getReactionsForMessage(messageId);

    res.json({
      reactions
    });
  } catch (error) {
    console.error('Get message reactions error:', error);
    res.status(500).json({
      error: 'Failed to get message reactions'
    });
  }
};

module.exports = {
  addReaction,
  removeReaction,
  getMessageReactions
};