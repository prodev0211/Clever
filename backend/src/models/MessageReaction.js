const mongoose = require('mongoose');

const messageReactionSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reactions
messageReactionSchema.index({ messageId: 1, userId: 1, emoji: 1 }, { unique: true });

// Static method to add reaction
messageReactionSchema.statics.addReaction = async function(messageId, userId, emoji) {
  try {
    const reaction = await this.findOneAndUpdate(
      { messageId, userId, emoji },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    return reaction;
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error - reaction already exists
      return await this.findOne({ messageId, userId, emoji });
    }
    throw error;
  }
};

// Static method to remove reaction
messageReactionSchema.statics.removeReaction = async function(messageId, userId, emoji) {
  const reaction = await this.findOneAndDelete({ messageId, userId, emoji });
  return reaction;
};

// Static method to get reactions for a message
messageReactionSchema.statics.getReactionsForMessage = async function(messageId) {
  const reactions = await this.aggregate([
    { $match: { messageId: new mongoose.Types.ObjectId(messageId) } },
    { $group: { _id: '$emoji', count: { $sum: '$count' }, users: { $push: '$userId' } } },
    { $sort: { count: -1 } }
  ]);
  return reactions;
};

module.exports = mongoose.model('MessageReaction', messageReactionSchema);