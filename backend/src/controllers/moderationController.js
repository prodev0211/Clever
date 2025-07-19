const GuildMember = require('../models/GuildMember');
const Guild = require('../models/Guild');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// Kick member
const kickMember = async (req, res) => {
  try {
    const { guildId, userId } = req.params;
    const moderatorId = req.user._id;
    const { reason } = req.body;

    // Check permissions
    const modMember = await GuildMember.findByGuildAndUser(guildId, moderatorId);
    if (!modMember || !(await modMember.hasPermission('KICK_MEMBERS'))) {
      return res.status(403).json({ error: 'No permission to kick members' });
    }

    // Remove member
    const member = await GuildMember.findOneAndDelete({ guildId, userId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Audit log
    await AuditLog.log({
      guildId,
      actionType: 'KICK',
      targetId: userId,
      targetType: 'User',
      userId: moderatorId,
      reason
    });

    res.json({ message: 'Member kicked' });
  } catch (error) {
    console.error('Kick member error:', error);
    res.status(500).json({ error: 'Failed to kick member' });
  }
};

// Ban member
const banMember = async (req, res) => {
  try {
    const { guildId, userId } = req.params;
    const moderatorId = req.user._id;
    const { reason } = req.body;

    // Check permissions
    const modMember = await GuildMember.findByGuildAndUser(guildId, moderatorId);
    if (!modMember || !(await modMember.hasPermission('BAN_MEMBERS'))) {
      return res.status(403).json({ error: 'No permission to ban members' });
    }

    // Remove member
    const member = await GuildMember.findOneAndDelete({ guildId, userId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Add to banned list (for demo, just log)
    // TODO: Implement persistent ban list

    // Audit log
    await AuditLog.log({
      guildId,
      actionType: 'BAN',
      targetId: userId,
      targetType: 'User',
      userId: moderatorId,
      reason
    });

    res.json({ message: 'Member banned' });
  } catch (error) {
    console.error('Ban member error:', error);
    res.status(500).json({ error: 'Failed to ban member' });
  }
};

// Unban member
const unbanMember = async (req, res) => {
  try {
    const { guildId, userId } = req.params;
    const moderatorId = req.user._id;
    const { reason } = req.body;

    // Check permissions
    const modMember = await GuildMember.findByGuildAndUser(guildId, moderatorId);
    if (!modMember || !(await modMember.hasPermission('BAN_MEMBERS'))) {
      return res.status(403).json({ error: 'No permission to unban members' });
    }

    // Remove from banned list (for demo, just log)
    // TODO: Implement persistent ban list

    // Audit log
    await AuditLog.log({
      guildId,
      actionType: 'UNBAN',
      targetId: userId,
      targetType: 'User',
      userId: moderatorId,
      reason
    });

    res.json({ message: 'Member unbanned' });
  } catch (error) {
    console.error('Unban member error:', error);
    res.status(500).json({ error: 'Failed to unban member' });
  }
};

// Timeout member
const timeoutMember = async (req, res) => {
  try {
    const { guildId, userId } = req.params;
    const moderatorId = req.user._id;
    const { until, reason } = req.body;

    // Check permissions
    const modMember = await GuildMember.findByGuildAndUser(guildId, moderatorId);
    if (!modMember || !(await modMember.hasPermission('MODERATE_MEMBERS'))) {
      return res.status(403).json({ error: 'No permission to timeout members' });
    }

    // Update member
    const member = await GuildMember.findOneAndUpdate(
      { guildId, userId },
      { communicationDisabledUntil: until },
      { new: true }
    );
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Audit log
    await AuditLog.log({
      guildId,
      actionType: 'TIMEOUT',
      targetId: userId,
      targetType: 'User',
      userId: moderatorId,
      changes: { communicationDisabledUntil: until },
      reason
    });

    res.json({ message: 'Member timed out', until });
  } catch (error) {
    console.error('Timeout member error:', error);
    res.status(500).json({ error: 'Failed to timeout member' });
  }
};

module.exports = {
  kickMember,
  banMember,
  unbanMember,
  timeoutMember
};