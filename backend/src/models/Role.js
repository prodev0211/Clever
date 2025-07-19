const mongoose = require('mongoose');

// Permission constants
const Permissions = {
  // General
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  USE_ACTIVITIES: 1n << 39n,
  MODERATE_MEMBERS: 1n << 40n
};

const roleSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  color: {
    type: Number,
    default: 0
  },
  hoist: {
    type: Boolean,
    default: false
  },
  position: {
    type: Number,
    required: true
  },
  permissions: {
    type: String, // Store as string for BigInt
    default: '0'
  },
  mentionable: {
    type: Boolean,
    default: false
  },
  managed: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  unicode_emoji: {
    type: String,
    default: null
  },
  tags: {
    bot_id: mongoose.Schema.Types.ObjectId,
    integration_id: mongoose.Schema.Types.ObjectId,
    premium_subscriber: Boolean
  }
}, {
  timestamps: true
});

// Indexes
roleSchema.index({ guildId: 1, position: -1 });
roleSchema.index({ guildId: 1, name: 1 });

// Static methods for permission handling
roleSchema.statics.Permissions = Permissions;

// Instance methods
roleSchema.methods.hasPermission = function(permission) {
  const permissions = BigInt(this.permissions);
  return (permissions & permission) === permission;
};

roleSchema.methods.addPermission = function(permission) {
  const permissions = BigInt(this.permissions);
  this.permissions = (permissions | permission).toString();
};

roleSchema.methods.removePermission = function(permission) {
  const permissions = BigInt(this.permissions);
  this.permissions = (permissions & ~permission).toString();
};

roleSchema.methods.setPermissions = function(permissions) {
  this.permissions = permissions.toString();
};

// Pre-save middleware to ensure position is set
roleSchema.pre('save', async function(next) {
  if (this.isNew && this.position === undefined) {
    const maxPosition = await this.constructor
      .findOne({ guildId: this.guildId })
      .sort({ position: -1 })
      .select('position');
    
    this.position = maxPosition ? maxPosition.position + 1 : 0;
  }
  next();
});

module.exports = mongoose.model('Role', roleSchema);