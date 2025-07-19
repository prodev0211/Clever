const mongoose = require('mongoose');

// Permission constants
const PERMISSIONS = {
  // General permissions
  VIEW_CHANNEL: 1 << 0,
  SEND_MESSAGES: 1 << 1,
  MANAGE_MESSAGES: 1 << 2,
  EMBED_LINKS: 1 << 3,
  ATTACH_FILES: 1 << 4,
  ADD_REACTIONS: 1 << 5,
  USE_EXTERNAL_EMOJIS: 1 << 6,
  USE_EXTERNAL_STICKERS: 1 << 7,
  
  // Voice permissions
  CONNECT: 1 << 8,
  SPEAK: 1 << 9,
  STREAM: 1 << 10,
  USE_VAD: 1 << 11,
  PRIORITY_SPEAKER: 1 << 12,
  REQUEST_TO_SPEAK: 1 << 13,
  
  // Channel management
  MANAGE_CHANNELS: 1 << 14,
  MANAGE_ROLES: 1 << 15,
  MANAGE_WEBHOOKS: 1 << 16,
  MANAGE_THREADS: 1 << 17,
  
  // Guild management
  MANAGE_GUILD: 1 << 18,
  MANAGE_NICKNAMES: 1 << 19,
  MANAGE_EMOJIS_AND_STICKERS: 1 << 20,
  VIEW_AUDIT_LOG: 1 << 21,
  VIEW_GUILD_INSIGHTS: 1 << 22,
  
  // Advanced permissions
  ADMINISTRATOR: 1 << 23,
  KICK_MEMBERS: 1 << 24,
  BAN_MEMBERS: 1 << 25,
  MODERATE_MEMBERS: 1 << 26,
  
  // Thread permissions
  CREATE_PUBLIC_THREADS: 1 << 27,
  CREATE_PRIVATE_THREADS: 1 << 28,
  USE_EXTERNAL_APPLICATIONS: 1 << 29,
  SEND_MESSAGES_IN_THREADS: 1 << 30,
  
  // Stage permissions
  REQUEST_TO_SPEAK: 1 << 31,
  MANAGE_EVENTS: 1 << 32,
  MANAGE_THREADS: 1 << 33,
  USE_APPLICATION_COMMANDS: 1 << 34,
  SEND_VOICE_MESSAGES: 1 << 35
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
    default: 0
  },
  permissions: {
    type: Number,
    default: 0
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
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
roleSchema.index({ guildId: 1, position: -1 });
roleSchema.index({ guildId: 1, isDeleted: 1 });

// Virtual for permission flags
roleSchema.virtual('permissionFlags').get(function() {
  const flags = {};
  for (const [permission, flag] of Object.entries(PERMISSIONS)) {
    flags[permission] = (this.permissions & flag) === flag;
  }
  return flags;
});

// Instance methods
roleSchema.methods.hasPermission = function(permission) {
  if (this.permissionFlags.ADMINISTRATOR) return true;
  return (this.permissions & PERMISSIONS[permission]) === PERMISSIONS[permission];
};

roleSchema.methods.addPermission = function(permission) {
  if (PERMISSIONS[permission]) {
    this.permissions |= PERMISSIONS[permission];
  }
  return this;
};

roleSchema.methods.removePermission = function(permission) {
  if (PERMISSIONS[permission]) {
    this.permissions &= ~PERMISSIONS[permission];
  }
  return this;
};

roleSchema.methods.setPermissions = function(permissions) {
  this.permissions = 0;
  permissions.forEach(permission => {
    this.addPermission(permission);
  });
  return this;
};

// Static methods
roleSchema.statics.getDefaultRoles = function() {
  return [
    {
      name: '@everyone',
      color: 0,
      hoist: false,
      position: 0,
      permissions: PERMISSIONS.VIEW_CHANNEL,
      mentionable: false,
      managed: true
    },
    {
      name: 'Moderator',
      color: 0x3498db,
      hoist: true,
      position: 1,
      permissions: PERMISSIONS.VIEW_CHANNEL | PERMISSIONS.SEND_MESSAGES | 
                   PERMISSIONS.MANAGE_MESSAGES | PERMISSIONS.KICK_MEMBERS |
                   PERMISSIONS.BAN_MEMBERS | PERMISSIONS.MANAGE_CHANNELS,
      mentionable: true,
      managed: false
    },
    {
      name: 'Admin',
      color: 0xe74c3c,
      hoist: true,
      position: 2,
      permissions: PERMISSIONS.ADMINISTRATOR,
      mentionable: true,
      managed: false
    }
  ];
};

// Pre-save middleware to ensure unique names within guild
roleSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    const existingRole = await this.constructor.findOne({
      guildId: this.guildId,
      name: this.name,
      isDeleted: false,
      _id: { $ne: this._id }
    });
    
    if (existingRole) {
      return next(new Error('Role name already exists in this guild'));
    }
  }
  next();
});

module.exports = {
  Role: mongoose.model('Role', roleSchema),
  PERMISSIONS
};