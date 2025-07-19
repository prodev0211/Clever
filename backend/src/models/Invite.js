const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    required: true
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['STREAM', 'EMBEDDED_APPLICATION'],
    default: null
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  targetApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  maxAge: {
    type: Number,
    default: 0 // 0 = never expires
  },
  maxUses: {
    type: Number,
    default: 0 // 0 = unlimited
  },
  uses: {
    type: Number,
    default: 0
  },
  temporary: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  flags: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
inviteSchema.index({ code: 1 });
inviteSchema.index({ guildId: 1 });
inviteSchema.index({ channelId: 1 });
inviteSchema.index({ inviterId: 1 });
inviteSchema.index({ expiresAt: 1 });

// Virtual for full invite URL
inviteSchema.virtual('url').get(function() {
  return `https://discord.gg/${this.code}`;
});

// Instance methods
inviteSchema.methods.isExpired = function() {
  if (this.expiresAt) {
    return new Date() > this.expiresAt;
  }
  return false;
};

inviteSchema.methods.isMaxUsesReached = function() {
  if (this.maxUses === 0) return false;
  return this.uses >= this.maxUses;
};

inviteSchema.methods.canBeUsed = function() {
  return !this.isExpired() && !this.isMaxUsesReached();
};

inviteSchema.methods.incrementUses = function() {
  this.uses += 1;
  return this.save();
};

// Pre-save middleware to set expiration
inviteSchema.pre('save', function(next) {
  if (this.maxAge > 0 && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + this.maxAge * 1000);
  }
  next();
});

module.exports = mongoose.model('Invite', inviteSchema);