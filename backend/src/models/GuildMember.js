const mongoose = require('mongoose');

const guildMemberSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nick: {
    type: String,
    maxlength: 32,
    default: null
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: []
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  premiumSince: {
    type: Date,
    default: null
  },
  deaf: {
    type: Boolean,
    default: false
  },
  mute: {
    type: Boolean,
    default: false
  },
  pending: {
    type: Boolean,
    default: false
  },
  permissions: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  communicationDisabledUntil: {
    type: Date,
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
guildMemberSchema.index({ guildId: 1, userId: 1 }, { unique: true });
guildMemberSchema.index({ guildId: 1, roles: 1 });
guildMemberSchema.index({ userId: 1 });

// Virtual for effective permissions
guildMemberSchema.virtual('effectivePermissions').get(async function() {
  const { Role, PERMISSIONS } = require('./Role');
  
  // Get all roles for this member
  const roles = await Role.find({
    _id: { $in: this.roles },
    isDeleted: false
  }).sort({ position: -1 });

  // Calculate effective permissions
  let permissions = 0;
  
  // Add permissions from each role
  for (const role of roles) {
    permissions |= role.permissions;
  }

  // Check if user is guild owner (has all permissions)
  const Guild = require('./Guild');
  const guild = await Guild.findById(this.guildId);
  if (guild && guild.ownerId.toString() === this.userId.toString()) {
    permissions = Object.values(PERMISSIONS).reduce((a, b) => a | b, 0);
  }

  return permissions;
});

// Instance methods
guildMemberSchema.methods.hasPermission = async function(permission) {
  const { PERMISSIONS } = require('./Role');
  
  // Check if user is guild owner
  const Guild = require('./Guild');
  const guild = await Guild.findById(this.guildId);
  if (guild && guild.ownerId.toString() === this.userId.toString()) {
    return true;
  }

  // Check administrator permission
  const effectivePermissions = await this.effectivePermissions;
  if ((effectivePermissions & PERMISSIONS.ADMINISTRATOR) === PERMISSIONS.ADMINISTRATOR) {
    return true;
  }

  // Check specific permission
  return (effectivePermissions & PERMISSIONS[permission]) === PERMISSIONS[permission];
};

guildMemberSchema.methods.addRole = async function(roleId) {
  if (!this.roles.includes(roleId)) {
    this.roles.push(roleId);
    await this.save();
  }
  return this;
};

guildMemberSchema.methods.removeRole = async function(roleId) {
  this.roles = this.roles.filter(role => role.toString() !== roleId.toString());
  await this.save();
  return this;
};

guildMemberSchema.methods.setRoles = async function(roleIds) {
  this.roles = roleIds;
  await this.save();
  return this;
};

guildMemberSchema.methods.hasRole = function(roleId) {
  return this.roles.some(role => role.toString() === roleId.toString());
};

// Static methods
guildMemberSchema.statics.findByGuildAndUser = async function(guildId, userId) {
  return this.findOne({ guildId, userId, isDeleted: false });
};

guildMemberSchema.statics.getMembersWithRoles = async function(guildId) {
  return this.find({ guildId, isDeleted: false })
    .populate('userId', 'username discriminator avatar status')
    .populate('roles', 'name color hoist position permissions mentionable')
    .sort({ 'roles.position': -1, joinedAt: 1 });
};

// Pre-save middleware
guildMemberSchema.pre('save', async function(next) {
  // Ensure roles are unique
  this.roles = [...new Set(this.roles)];
  next();
});

module.exports = mongoose.model('GuildMember', guildMemberSchema);