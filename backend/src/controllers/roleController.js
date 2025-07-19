const { Role, PERMISSIONS } = require('../models/Role');
const GuildMember = require('../models/GuildMember');
const Guild = require('../models/Guild');

// Get all roles for a guild
const getGuildRoles = async (req, res) => {
  try {
    const { guildId } = req.params;
    const userId = req.user._id;

    // Check if user is member of guild
    const member = await GuildMember.findByGuildAndUser(guildId, userId);
    if (!member) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    const roles = await Role.find({
      guildId,
      isDeleted: false
    }).sort({ position: -1 });

    res.json({
      roles: roles.map(role => ({
        id: role._id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable,
        managed: role.managed,
        icon: role.icon,
        unicode_emoji: role.unicode_emoji,
        permissionFlags: role.permissionFlags
      }))
    });
  } catch (error) {
    console.error('Get guild roles error:', error);
    res.status(500).json({
      error: 'Failed to get guild roles'
    });
  }
};

// Create a new role
const createRole = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { name, color, hoist, permissions, mentionable } = req.body;
    const userId = req.user._id;

    // Check if user has MANAGE_ROLES permission
    const member = await GuildMember.findByGuildAndUser(guildId, userId);
    if (!member) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    const hasPermission = await member.hasPermission('MANAGE_ROLES');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'You do not have permission to manage roles'
      });
    }

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Role name is required'
      });
    }

    // Get highest position
    const maxPosition = await Role.findOne({ guildId, isDeleted: false })
      .sort({ position: -1 })
      .select('position');

    const role = new Role({
      guildId,
      name: name.trim(),
      color: color || 0,
      hoist: hoist || false,
      position: (maxPosition?.position || -1) + 1,
      permissions: permissions || 0,
      mentionable: mentionable || false,
      managed: false
    });

    await role.save();

    res.status(201).json({
      message: 'Role created successfully',
      role: {
        id: role._id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable,
        managed: role.managed,
        icon: role.icon,
        unicode_emoji: role.unicode_emoji,
        permissionFlags: role.permissionFlags
      }
    });
  } catch (error) {
    console.error('Create role error:', error);
    if (error.message.includes('Role name already exists')) {
      return res.status(400).json({
        error: 'Role name already exists in this guild'
      });
    }
    res.status(500).json({
      error: 'Failed to create role'
    });
  }
};

// Update a role
const updateRole = async (req, res) => {
  try {
    const { guildId, roleId } = req.params;
    const { name, color, hoist, permissions, mentionable } = req.body;
    const userId = req.user._id;

    // Check if user has MANAGE_ROLES permission
    const member = await GuildMember.findByGuildAndUser(guildId, userId);
    if (!member) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    const hasPermission = await member.hasPermission('MANAGE_ROLES');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'You do not have permission to manage roles'
      });
    }

    const role = await Role.findOne({
      _id: roleId,
      guildId,
      isDeleted: false
    });

    if (!role) {
      return res.status(404).json({
        error: 'Role not found'
      });
    }

    // Check if role is managed (cannot be modified)
    if (role.managed) {
      return res.status(400).json({
        error: 'Cannot modify managed roles'
      });
    }

    // Update fields
    if (name !== undefined) role.name = name.trim();
    if (color !== undefined) role.color = color;
    if (hoist !== undefined) role.hoist = hoist;
    if (permissions !== undefined) role.permissions = permissions;
    if (mentionable !== undefined) role.mentionable = mentionable;

    await role.save();

    res.json({
      message: 'Role updated successfully',
      role: {
        id: role._id,
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable,
        managed: role.managed,
        icon: role.icon,
        unicode_emoji: role.unicode_emoji,
        permissionFlags: role.permissionFlags
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    if (error.message.includes('Role name already exists')) {
      return res.status(400).json({
        error: 'Role name already exists in this guild'
      });
    }
    res.status(500).json({
      error: 'Failed to update role'
    });
  }
};

// Delete a role
const deleteRole = async (req, res) => {
  try {
    const { guildId, roleId } = req.params;
    const userId = req.user._id;

    // Check if user has MANAGE_ROLES permission
    const member = await GuildMember.findByGuildAndUser(guildId, userId);
    if (!member) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    const hasPermission = await member.hasPermission('MANAGE_ROLES');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'You do not have permission to manage roles'
      });
    }

    const role = await Role.findOne({
      _id: roleId,
      guildId,
      isDeleted: false
    });

    if (!role) {
      return res.status(404).json({
        error: 'Role not found'
      });
    }

    // Check if role is managed (cannot be deleted)
    if (role.managed) {
      return res.status(400).json({
        error: 'Cannot delete managed roles'
      });
    }

    // Remove role from all members
    await GuildMember.updateMany(
      { guildId, roles: roleId },
      { $pull: { roles: roleId } }
    );

    // Soft delete the role
    role.isDeleted = true;
    await role.save();

    res.json({
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      error: 'Failed to delete role'
    });
  }
};

// Update role positions
const updateRolePositions = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { positions } = req.body; // Array of { roleId, position }
    const userId = req.user._id;

    // Check if user has MANAGE_ROLES permission
    const member = await GuildMember.findByGuildAndUser(guildId, userId);
    if (!member) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    const hasPermission = await member.hasPermission('MANAGE_ROLES');
    if (!hasPermission) {
      return res.status(403).json({
        error: 'You do not have permission to manage roles'
      });
    }

    // Update positions
    for (const { roleId, position } of positions) {
      await Role.findByIdAndUpdate(roleId, { position });
    }

    res.json({
      message: 'Role positions updated successfully'
    });
  } catch (error) {
    console.error('Update role positions error:', error);
    res.status(500).json({
      error: 'Failed to update role positions'
    });
  }
};

// Get available permissions
const getPermissions = async (req, res) => {
  try {
    const permissions = Object.entries(PERMISSIONS).map(([name, value]) => ({
      name,
      value,
      description: getPermissionDescription(name)
    }));

    res.json({ permissions });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      error: 'Failed to get permissions'
    });
  }
};

// Helper function to get permission descriptions
const getPermissionDescription = (permission) => {
  const descriptions = {
    VIEW_CHANNEL: 'View channels',
    SEND_MESSAGES: 'Send messages',
    MANAGE_MESSAGES: 'Manage messages',
    EMBED_LINKS: 'Embed links',
    ATTACH_FILES: 'Attach files',
    ADD_REACTIONS: 'Add reactions',
    USE_EXTERNAL_EMOJIS: 'Use external emojis',
    USE_EXTERNAL_STICKERS: 'Use external stickers',
    CONNECT: 'Connect to voice channels',
    SPEAK: 'Speak in voice channels',
    STREAM: 'Stream in voice channels',
    USE_VAD: 'Use voice activity detection',
    PRIORITY_SPEAKER: 'Priority speaker',
    REQUEST_TO_SPEAK: 'Request to speak',
    MANAGE_CHANNELS: 'Manage channels',
    MANAGE_ROLES: 'Manage roles',
    MANAGE_WEBHOOKS: 'Manage webhooks',
    MANAGE_THREADS: 'Manage threads',
    MANAGE_GUILD: 'Manage guild',
    MANAGE_NICKNAMES: 'Manage nicknames',
    MANAGE_EMOJIS_AND_STICKERS: 'Manage emojis and stickers',
    VIEW_AUDIT_LOG: 'View audit log',
    VIEW_GUILD_INSIGHTS: 'View guild insights',
    ADMINISTRATOR: 'Administrator',
    KICK_MEMBERS: 'Kick members',
    BAN_MEMBERS: 'Ban members',
    MODERATE_MEMBERS: 'Moderate members',
    CREATE_PUBLIC_THREADS: 'Create public threads',
    CREATE_PRIVATE_THREADS: 'Create private threads',
    USE_EXTERNAL_APPLICATIONS: 'Use external applications',
    SEND_MESSAGES_IN_THREADS: 'Send messages in threads',
    MANAGE_EVENTS: 'Manage events',
    USE_APPLICATION_COMMANDS: 'Use application commands',
    SEND_VOICE_MESSAGES: 'Send voice messages'
  };

  return descriptions[permission] || permission;
};

module.exports = {
  getGuildRoles,
  createRole,
  updateRole,
  deleteRole,
  updateRolePositions,
  getPermissions
};