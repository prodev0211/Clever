const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    default: null // null for DMs
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  embeds: [{
    title: String,
    description: String,
    url: String,
    timestamp: Date,
    color: Number,
    footer: {
      text: String,
      icon_url: String
    },
    image: {
      url: String,
      proxy_url: String,
      height: Number,
      width: Number
    },
    thumbnail: {
      url: String,
      proxy_url: String,
      height: Number,
      width: Number
    },
    video: {
      url: String,
      height: Number,
      width: Number
    },
    provider: {
      name: String,
      url: String
    },
    author: {
      name: String,
      url: String,
      icon_url: String,
      proxy_icon_url: String
    },
    fields: [{
      name: String,
      value: String,
      inline: Boolean
    }]
  }],
  attachments: [{
    id: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    description: String,
    content_type: String,
    size: Number,
    url: String,
    proxy_url: String,
    height: Number,
    width: Number,
    ephemeral: {
      type: Boolean,
      default: false
    }
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  mentionRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  mentionChannels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }],
  mentionEveryone: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  tts: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['DEFAULT', 'RECIPIENT_ADD', 'RECIPIENT_REMOVE', 'CALL', 'CHANNEL_NAME_CHANGE', 'CHANNEL_ICON_CHANGE', 'CHANNEL_PINNED_MESSAGE', 'USER_JOIN', 'GUILD_BOOST', 'GUILD_BOOST_TIER_1_THRESHOLD', 'GUILD_BOOST_TIER_2_THRESHOLD', 'GUILD_BOOST_TIER_3_THRESHOLD', 'CHANNEL_FOLLOW_ADD', 'GUILD_DISCOVERY_DISQUALIFIED', 'GUILD_DISCOVERY_REQUALIFIED', 'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING', 'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING', 'THREAD_CREATED', 'REPLY', 'CHAT_INPUT_COMMAND', 'THREAD_STARTER_MESSAGE', 'GUILD_INVITE_REMINDER', 'CONTEXT_MENU_COMMAND', 'AUTO_MODERATION_ACTION', 'ROLE_SUBSCRIPTION_PURCHASE', 'INTERACTION_PREMIUM_UPSELL', 'STAGE_START', 'STAGE_END', 'STAGE_SPEAKER', 'STAGE_TOPIC', 'GUILD_APPLICATION_PREMIUM_SUBSCRIPTION'],
    default: 'DEFAULT'
  },
  flags: {
    type: Number,
    default: 0
  },
  editedTimestamp: {
    type: Date,
    default: null
  },
  webhookId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  messageReference: {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel'
    },
    guildId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guild'
    },
    failIfNotExists: {
      type: Boolean,
      default: true
    }
  },
  interaction: {
    id: mongoose.Schema.Types.ObjectId,
    type: {
      type: String,
      enum: ['PING', 'APPLICATION_COMMAND', 'MESSAGE_COMPONENT', 'APPLICATION_COMMAND_AUTOCOMPLETE', 'MODAL_SUBMIT']
    },
    name: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  thread: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel'
    },
    name: String,
    archived: Boolean,
    autoArchiveDuration: Number,
    archiveTimestamp: Date,
    locked: Boolean,
    invitable: Boolean,
    createTimestamp: Date,
    appliedTags: [String]
  },
  components: [{
    type: {
      type: String,
      enum: ['ACTION_ROW', 'BUTTON', 'SELECT_MENU', 'TEXT_INPUT']
    },
    components: [mongoose.Schema.Types.Mixed]
  }],
  stickerItems: [{
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    format_type: {
      type: String,
      enum: ['PNG', 'APNG', 'LOTTIE', 'GIF']
    }
  }],
  position: {
    type: Number,
    default: 0
  },
  roleSubscriptionData: {
    roleSubscriptionListingId: mongoose.Schema.Types.ObjectId,
    tierName: String,
    totalMonthsSubscribed: Number,
    isRenewal: Boolean
  },
  resolved: {
    users: Map,
    members: Map,
    roles: Map,
    channels: Map,
    messages: Map,
    attachments: Map
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ channelId: 1, createdAt: -1 });
messageSchema.index({ authorId: 1, createdAt: -1 });
messageSchema.index({ guildId: 1, createdAt: -1 });
messageSchema.index({ isDeleted: 1 });

// Virtual for message URL
messageSchema.virtual('url').get(function() {
  if (this.guildId) {
    return `https://discord.com/channels/${this.guildId}/${this.channelId}/${this._id}`;
  }
  return `https://discord.com/channels/@me/${this.channelId}/${this._id}`;
});

// Instance methods
messageSchema.methods.isSystemMessage = function() {
  return this.type !== 'DEFAULT';
};

messageSchema.methods.isEdited = function() {
  return this.editedTimestamp !== null;
};

messageSchema.methods.hasAttachments = function() {
  return this.attachments && this.attachments.length > 0;
};

messageSchema.methods.hasEmbeds = function() {
  return this.embeds && this.embeds.length > 0;
};

// Pre-save middleware to update channel's lastMessageId
messageSchema.pre('save', async function(next) {
  if (this.isNew && !this.isDeleted) {
    const Channel = mongoose.model('Channel');
    await Channel.findByIdAndUpdate(
      this.channelId,
      { lastMessageId: this._id }
    );
  }
  next();
});

module.exports = mongoose.model('Message', messageSchema);