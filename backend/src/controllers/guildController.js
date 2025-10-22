const Guild = require('../models/Guild');
const GuildMember = require('../models/GuildMember');
const Channel = require('../models/Channel');
const Role = require('../models/Role');
const { generateInviteCode } = require('../utils/jwt');

// Create new guild
const createGuild = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Guild name must be at least 2 characters long'
      });
    }

    // Check if user already owns too many guilds
    const userGuilds = await Guild.countDocuments({ ownerId: userId });
    if (userGuilds >= 100) { // Discord limit
      return res.status(400).json({
        error: 'You can only own up to 100 guilds'
      });
    }

    // Create guild
    const guild = new Guild({
      name: name.trim(),
      description: description?.trim() || '',
      ownerId: userId
    });

    await guild.save();

    // Create default role for the guild
    const defaultRole = new Role({
      guildId: guild._id,
      name: '@everyone',
      position: 0,
      permissions: '0', // No special permissions by default
      color: 0,
      hoist: false,
      mentionable: false
    });

    await defaultRole.save();

    // Create default channels
    const generalChannel = new Channel({
      guildId: guild._id,
      name: 'general',
      type: 'GUILD_TEXT',
      position: 0,
      topic: 'General discussion'
    });

    const announcementsChannel = new Channel({
      guildId: guild._id,
      name: 'announcements',
      type: 'GUILD_TEXT',
      position: 1,
      topic: 'Server announcements'
    });

    await Promise.all([
      generalChannel.save(),
      announcementsChannel.save()
    ]);

    // Add owner as guild member
    const guildMember = new GuildMember({
      guildId: guild._id,
      userId: userId,
      roles: [defaultRole._id]
    });

    await guildMember.save();

    // Update guild member count
    guild.memberCount = 1;
    await guild.save();

    res.status(201).json({
      message: 'Guild created successfully',
      guild: {
        id: guild._id,
        name: guild.name,
        description: guild.description,
        icon: guild.icon,
        ownerId: guild.ownerId,
        memberCount: guild.memberCount,
        channels: [
          {
            id: generalChannel._id,
            name: generalChannel.name,
            type: generalChannel.type,
            position: generalChannel.position
          },
          {
            id: announcementsChannel._id,
            name: announcementsChannel.name,
            type: announcementsChannel.type,
            position: announcementsChannel.position
          }
        ]
      }
    });
  } catch (error) {
    console.error('Create guild error:', error);
    res.status(500).json({
      error: 'Failed to create guild'
    });
  }
};

// Get user's guilds
const getUserGuilds = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get guilds where user is a member
    const guildMembers = await GuildMember.find({ userId })
      .populate({
        path: 'guildId',
        select: 'name description icon memberCount ownerId'
      });

    const guilds = guildMembers.map(member => ({
      id: member.guildId._id,
      name: member.guildId.name,
      description: member.guildId.description,
      icon: member.guildId.icon,
      memberCount: member.guildId.memberCount,
      ownerId: member.guildId.ownerId,
      isOwner: member.guildId.ownerId.toString() === userId.toString(),
      nick: member.nick,
      roles: member.roles
    }));

    res.json({ guilds });
  } catch (error) {
    console.error('Get user guilds error:', error);
    res.status(500).json({
      error: 'Failed to get user guilds'
    });
  }
};

// Get guild by ID
const getGuild = async (req, res) => {
  try {
    const { guildId } = req.params;
    const userId = req.user._id;

    // Check if user is member of guild
    const guildMember = await GuildMember.findOne({
      guildId,
      userId
    }).populate('guildId');

    if (!guildMember) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    // Get guild channels
    const channels = await Channel.find({
      guildId,
      isDeleted: false
    }).sort({ position: 1 });

    // Get guild roles
    const roles = await Role.find({ guildId }).sort({ position: -1 });

    // Get member count
    const memberCount = await GuildMember.countDocuments({ guildId });

    res.json({
      guild: {
        id: guildMember.guildId._id,
        name: guildMember.guildId.name,
        description: guildMember.guildId.description,
        icon: guildMember.guildId.icon,
        banner: guildMember.guildId.banner,
        ownerId: guildMember.guildId.ownerId,
        memberCount,
        verificationLevel: guildMember.guildId.verificationLevel,
        features: guildMember.guildId.features,
        settings: guildMember.guildId.settings
      },
      channels,
      roles,
      member: {
        nick: guildMember.nick,
        roles: guildMember.roles,
        joinedAt: guildMember.joinedAt,
        isOwner: guildMember.guildId.ownerId.toString() === userId.toString()
      }
    });
  } catch (error) {
    console.error('Get guild error:', error);
    res.status(500).json({
      error: 'Failed to get guild'
    });
  }
};

// Update guild
const updateGuild = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { name, description, icon } = req.body;
    const userId = req.user._id;

    // Check if user is owner
    const guild = await Guild.findOne({
      _id: guildId,
      ownerId: userId
    });

    if (!guild) {
      return res.status(403).json({
        error: 'You can only update guilds you own'
      });
    }

    // Update fields
    if (name) guild.name = name.trim();
    if (description !== undefined) guild.description = description.trim();
    if (icon !== undefined) guild.icon = icon;

    await guild.save();

    res.json({
      message: 'Guild updated successfully',
      guild: {
        id: guild._id,
        name: guild.name,
        description: guild.description,
        icon: guild.icon,
        ownerId: guild.ownerId
      }
    });
  } catch (error) {
    console.error('Update guild error:', error);
    res.status(500).json({
      error: 'Failed to update guild'
    });
  }
};

// Delete guild
const deleteGuild = async (req, res) => {
  try {
    const { guildId } = req.params;
    const userId = req.user._id;

    // Check if user is owner
    const guild = await Guild.findOne({
      _id: guildId,
      ownerId: userId
    });

    if (!guild) {
      return res.status(403).json({
        error: 'You can only delete guilds you own'
      });
    }

    // Soft delete guild
    guild.isDeleted = true;
    await guild.save();

    // Delete related data
    await Promise.all([
      GuildMember.deleteMany({ guildId }),
      Channel.deleteMany({ guildId }),
      Role.deleteMany({ guildId })
    ]);

    res.json({
      message: 'Guild deleted successfully'
    });
  } catch (error) {
    console.error('Delete guild error:', error);
    res.status(500).json({
      error: 'Failed to delete guild'
    });
  }
};

// Leave guild
const leaveGuild = async (req, res) => {
  try {
    const { guildId } = req.params;
    const userId = req.user._id;

    // Check if user is owner
    const guild = await Guild.findOne({
      _id: guildId,
      ownerId: userId
    });

    if (guild) {
      return res.status(400).json({
        error: 'Guild owners cannot leave their guild. Transfer ownership or delete the guild instead.'
      });
    }

    // Remove user from guild
    const result = await GuildMember.findOneAndDelete({
      guildId,
      userId
    });

    if (!result) {
      return res.status(404).json({
        error: 'You are not a member of this guild'
      });
    }

    // Update member count
    await Guild.findByIdAndUpdate(guildId, {
      $inc: { memberCount: -1 }
    });

    res.json({
      message: 'Left guild successfully'
    });
  } catch (error) {
    console.error('Leave guild error:', error);
    res.status(500).json({
      error: 'Failed to leave guild'
    });
  }
};

// Get guild members
const getGuildMembers = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { limit = 50, after } = req.query;

    // Check if user is member of guild
    const isMember = await GuildMember.findOne({
      guildId,
      userId: req.user._id
    });

    if (!isMember) {
      return res.status(403).json({
        error: 'You are not a member of this guild'
      });
    }

    // Build query
    let query = { guildId };
    if (after) {
      query._id = { $gt: after };
    }

    const members = await GuildMember.find(query)
      .populate('userId', 'username discriminator avatar status')
      .populate('roles', 'name color')
      .limit(parseInt(limit))
      .sort({ joinedAt: 1 });

    const formattedMembers = members.map(member => ({
      id: member.userId._id,
      username: member.userId.username,
      discriminator: member.userId.discriminator,
      avatar: member.userId.avatar,
      status: member.userId.status,
      nick: member.nick,
      roles: member.roles,
      joinedAt: member.joinedAt,
      isOwner: member.guildId.ownerId?.toString() === member.userId._id.toString()
    }));

    res.json({ members: formattedMembers });
  } catch (error) {
    console.error('Get guild members error:', error);
    res.status(500).json({
      error: 'Failed to get guild members'
    });
  }
};

module.exports = {
  createGuild,
  getUserGuilds,
  getGuild,
  updateGuild,
  deleteGuild,
  leaveGuild,
  getGuildMembers
};