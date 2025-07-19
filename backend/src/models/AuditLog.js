const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    required: true
  },
  actionType: {
    type: String,
    required: true
  },
  targetId: String,
  targetType: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changes: mongoose.Schema.Types.Mixed,
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

auditLogSchema.index({ guildId: 1, createdAt: -1 });

auditLogSchema.statics.log = async function({ guildId, actionType, targetId, targetType, userId, changes, reason }) {
  return this.create({ guildId, actionType, targetId, targetType, userId, changes, reason });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);