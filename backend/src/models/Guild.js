const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  icon: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  region: {
    type: String,
    default: 'us-east'
  },
  locale: {
    type: String,
    default: 'en'
  },
  memberCount: {
    type: Number,
    default: 1
  },
  maxMembers: {
    type: Number,
    default: 100000
  },
  verificationLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'very_high'],
    default: 'none'
  },
  explicitContentFilter: {
    type: String,
    enum: ['disabled', 'members_without_roles', 'all_members'],
    default: 'disabled'
  },
  features: [{
    type: String,
    enum: ['ANIMATED_ICON', 'BANNER', 'COMMERCE', 'COMMUNITY', 'DISCOVERABLE', 'FEATURABLE', 'INVITE_SPLASH', 'MEMBER_VERIFICATION_GATE_ENABLED', 'MONETIZATION_ENABLED', 'MORE_STICKERS', 'NEWS', 'PARTNERED', 'PREVIEW_ENABLED', 'VANITY_URL', 'VERIFIED', 'VIP_REGIONS', 'WELCOME_SCREEN_ENABLED']
  }],
  settings: {
    defaultNotifications: {
      type: String,
      enum: ['all_messages', 'only_mentions'],
      default: 'all_messages'
    },
    systemChannelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      default: null
    },
    rulesChannelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      default: null
    },
    publicUpdatesChannelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      default: null
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
guildSchema.index({ name: 1 });
guildSchema.index({ ownerId: 1 });
guildSchema.index({ isDeleted: 1 });

// Virtual for invite code generation
guildSchema.virtual('inviteCode').get(function() {
  return this._id.toString().slice(-8);
});

module.exports = mongoose.model('Guild', guildSchema);