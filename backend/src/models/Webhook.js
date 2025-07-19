const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  },
  avatar: String,
  token: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

webhookSchema.index({ channelId: 1 });
webhookSchema.index({ guildId: 1 });

module.exports = mongoose.model('Webhook', webhookSchema);