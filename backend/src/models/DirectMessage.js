const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastMessageAt: {
    type: Date,
    default: null
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: null // For group DMs
  },
  icon: {
    type: String,
    default: null // For group DMs
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // For group DMs
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
directMessageSchema.index({ participants: 1 });
directMessageSchema.index({ lastMessageAt: -1 });
directMessageSchema.index({ isDeleted: 1 });

// Virtual for DM type
directMessageSchema.virtual('isDirectMessage').get(function() {
  return !this.isGroup;
});

// Virtual for DM name (for 1-on-1 DMs, this would be the other user's name)
directMessageSchema.virtual('displayName').get(function() {
  if (this.isGroup) {
    return this.name || 'Group DM';
  }
  return 'Direct Message'; // Will be populated with other user's name
});

// Static method to find or create DM between two users
directMessageSchema.statics.findOrCreateDM = async function(userId1, userId2) {
  const participants = [userId1, userId2].sort();
  
  let dm = await this.findOne({
    participants: { $all: participants },
    isGroup: false,
    isDeleted: false
  });

  if (!dm) {
    dm = new this({
      participants,
      isGroup: false
    });
    await dm.save();
  }

  return dm;
};

// Static method to create group DM
directMessageSchema.statics.createGroupDM = async function(participants, name, ownerId) {
  const dm = new this({
    participants,
    name,
    ownerId,
    isGroup: true
  });
  
  await dm.save();
  return dm;
};

// Instance method to add participant to group DM
directMessageSchema.methods.addParticipant = async function(userId) {
  if (!this.isGroup) {
    throw new Error('Cannot add participants to 1-on-1 DM');
  }
  
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    await this.save();
  }
  
  return this;
};

// Instance method to remove participant from group DM
directMessageSchema.methods.removeParticipant = async function(userId) {
  if (!this.isGroup) {
    throw new Error('Cannot remove participants from 1-on-1 DM');
  }
  
  if (this.ownerId && this.ownerId.toString() === userId.toString()) {
    throw new Error('Cannot remove group owner');
  }
  
  this.participants = this.participants.filter(id => id.toString() !== userId.toString());
  await this.save();
  
  return this;
};

// Instance method to update last message
directMessageSchema.methods.updateLastMessage = async function(messageId, messageAt) {
  this.lastMessageId = messageId;
  this.lastMessageAt = messageAt || new Date();
  await this.save();
  
  return this;
};

module.exports = mongoose.model('DirectMessage', directMessageSchema);