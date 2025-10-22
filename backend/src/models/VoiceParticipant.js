const mongoose = require('mongoose');

const voiceParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isMuted: {
    type: Boolean,
    default: false
  },
  isDeafened: {
    type: Boolean,
    default: false
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  isVideoEnabled: {
    type: Boolean,
    default: false
  },
  isSpeaking: {
    type: Boolean,
    default: false
  },
  lastSpeakingAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
voiceParticipantSchema.index({ userId: 1 });
voiceParticipantSchema.index({ channelId: 1 });
voiceParticipantSchema.index({ guildId: 1 });
voiceParticipantSchema.index({ userId: 1, channelId: 1 }, { unique: true });

// Virtual for duration in channel
voiceParticipantSchema.virtual('duration').get(function() {
  return Date.now() - this.joinedAt.getTime();
});

// Method to update speaking status
voiceParticipantSchema.methods.updateSpeaking = function(isSpeaking) {
  this.isSpeaking = isSpeaking;
  if (isSpeaking) {
    this.lastSpeakingAt = new Date();
  }
  return this.save();
};

// Method to start streaming
voiceParticipantSchema.methods.startStreaming = function() {
  this.isStreaming = true;
  return this.save();
};

// Method to stop streaming
voiceParticipantSchema.methods.stopStreaming = function() {
  this.isStreaming = false;
  return this.save();
};

// Method to enable/disable video
voiceParticipantSchema.methods.setVideoEnabled = function(enabled) {
  this.isVideoEnabled = enabled;
  return this.save();
};

// Static method to get participants in a channel
voiceParticipantSchema.statics.getChannelParticipants = function(channelId) {
  return this.find({ channelId })
    .populate('userId', 'username avatar discriminator')
    .sort({ joinedAt: 1 });
};

// Static method to get user's current voice channel
voiceParticipantSchema.statics.getUserVoiceChannel = function(userId) {
  return this.findOne({ userId })
    .populate('channelId', 'name type')
    .populate('guildId', 'name');
};

// Static method to get guild voice participants
voiceParticipantSchema.statics.getGuildVoiceParticipants = function(guildId) {
  return this.find({ guildId })
    .populate('userId', 'username avatar discriminator')
    .populate('channelId', 'name type')
    .sort({ joinedAt: 1 });
};

module.exports = mongoose.model('VoiceParticipant', voiceParticipantSchema);