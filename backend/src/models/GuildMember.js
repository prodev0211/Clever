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
  avatar: {
    type: String,
    default: null
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
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
    default: '0'
  },
  communicationDisabledUntil: {
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

// Compound index for unique guild-user combination
guildMemberSchema.index({ guildId: 1, userId: 1 }, { unique: true });
guildMemberSchema.index({ userId: 1 });
guildMemberSchema.index({ guildId: 1 });

// Instance methods
guildMemberSchema.methods.hasRole = function(roleId) {
  return this.roles.includes(roleId);
};

guildMemberSchema.methods.addRole = function(roleId) {
  if (!this.hasRole(roleId)) {
    this.roles.push(roleId);
  }
};

guildMemberSchema.methods.removeRole = function(roleId) {
  this.roles = this.roles.filter(role => role.toString() !== roleId.toString());
};

guildMemberSchema.methods.isOwner = async function() {
  const Guild = mongoose.model('Guild');
  const guild = await Guild.findById(this.guildId);
  return guild && guild.ownerId.toString() === this.userId.toString();
};

guildMemberSchema.methods.hasPermission = async function(permission) {
  // Check if user is owner
  if (await this.isOwner()) {
    return true;
  }

  // Get user's roles and calculate permissions
  const Role = mongoose.model('Role');
  const roles = await Role.find({ 
    _id: { $in: this.roles },
    guildId: this.guildId 
  });

  let totalPermissions = BigInt(0);
  
  for (const role of roles) {
    totalPermissions |= BigInt(role.permissions);
  }

  return (totalPermissions & permission) === permission;
};

module.exports = mongoose.model('GuildMember', guildMemberSchema);