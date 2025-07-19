const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['GUILD_TEXT', 'GUILD_VOICE', 'GUILD_CATEGORY', 'GUILD_NEWS', 'GUILD_STAGE_VOICE', 'DM', 'GROUP_DM'],
    required: true
  },
  topic: {
    type: String,
    maxlength: 1024,
    default: ''
  },
  position: {
    type: Number,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    default: null
  },
  permissionOverwrites: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    type: {
      type: String,
      enum: ['role', 'member'],
      required: true
    },
    allow: {
      type: String,
      default: '0'
    },
    deny: {
      type: String,
      default: '0'
    }
  }],
  // Voice channel specific
  bitrate: {
    type: Number,
    default: 64000
  },
  userLimit: {
    type: Number,
    default: 0
  },
  // Text channel specific
  nsfw: {
    type: Boolean,
    default: false
  },
  rateLimitPerUser: {
    type: Number,
    default: 0
  },
  // News channel specific
  defaultAutoArchiveDuration: {
    type: Number,
    default: 1440 // 24 hours in minutes
  },
  // Stage channel specific
  videoQualityMode: {
    type: Number,
    default: 1
  },
  // DM specific
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Thread specific
  threadMetadata: {
    archived: {
      type: Boolean,
      default: false
    },
    autoArchiveDuration: {
      type: Number,
      default: 1440
    },
    archiveTimestamp: Date,
    locked: {
      type: Boolean,
      default: false
    },
    invitable: {
      type: Boolean,
      default: true
    },
    createTimestamp: Date
  },
  lastMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
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
channelSchema.index({ guildId: 1, position: 1 });
channelSchema.index({ guildId: 1, parentId: 1 });
channelSchema.index({ type: 1 });
channelSchema.index({ recipients: 1 });
channelSchema.index({ isDeleted: 1 });

// Virtual for channel mention
channelSchema.virtual('mention').get(function() {
  return `<#${this._id}>`;
});

// Instance methods
channelSchema.methods.isTextChannel = function() {
  return ['GUILD_TEXT', 'GUILD_NEWS', 'DM', 'GROUP_DM'].includes(this.type);
};

channelSchema.methods.isVoiceChannel = function() {
  return ['GUILD_VOICE', 'GUILD_STAGE_VOICE'].includes(this.type);
};

channelSchema.methods.isCategory = function() {
  return this.type === 'GUILD_CATEGORY';
};

channelSchema.methods.isDM = function() {
  return ['DM', 'GROUP_DM'].includes(this.type);
};

// Pre-save middleware to ensure position is set
channelSchema.pre('save', async function(next) {
  if (this.isNew && this.position === undefined) {
    const maxPosition = await this.constructor
      .findOne({ 
        guildId: this.guildId, 
        parentId: this.parentId,
        isDeleted: false 
      })
      .sort({ position: -1 })
      .select('position');
    
    this.position = maxPosition ? maxPosition.position + 1 : 0;
  }
  next();
});

module.exports = mongoose.model('Channel', channelSchema);