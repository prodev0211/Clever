const DirectMessage = require('../models/DirectMessage');
const Message = require('../models/Message');
const User = require('../models/User');

// Get user's DMs
const getUserDMs = async (req, res) => {
  try {
    const userId = req.user._id;

    const dms = await DirectMessage.find({
      participants: userId,
      isDeleted: false
    })
    .populate('participants', 'username discriminator avatar status')
    .populate('lastMessageId', 'content createdAt')
    .populate('ownerId', 'username discriminator avatar')
    .sort({ lastMessageAt: -1 });

    // Format DMs
    const formattedDMs = dms.map(dm => {
      const otherParticipants = dm.participants.filter(p => p._id.toString() !== userId.toString());
      
      return {
        id: dm._id,
        name: dm.isGroup ? dm.name : otherParticipants[0]?.username || 'Unknown User',
        isGroup: dm.isGroup,
        participants: dm.participants.map(p => ({
          id: p._id,
          username: p.username,
          discriminator: p.discriminator,
          avatar: p.avatar,
          status: p.status
        })),
        lastMessage: dm.lastMessageId ? {
          id: dm.lastMessageId._id,
          content: dm.lastMessageId.content,
          createdAt: dm.lastMessageId.createdAt
        } : null,
        lastMessageAt: dm.lastMessageAt,
        ownerId: dm.ownerId,
        icon: dm.icon,
        unreadCount: 0 // TODO: Implement unread count
      };
    });

    res.json({ dms: formattedDMs });
  } catch (error) {
    console.error('Get user DMs error:', error);
    res.status(500).json({
      error: 'Failed to get DMs'
    });
  }
};

// Create or get DM with user
const createDM = async (req, res) => {
  try {
    const { userId: otherUserId } = req.body;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === otherUserId) {
      return res.status(400).json({
        error: 'Cannot create DM with yourself'
      });
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Find or create DM
    const dm = await DirectMessage.findOrCreateDM(currentUserId, otherUserId);
    
    // Populate participants
    await dm.populate('participants', 'username discriminator avatar status');

    const otherParticipant = dm.participants.find(p => p._id.toString() !== currentUserId.toString());

    res.json({
      dm: {
        id: dm._id,
        name: otherParticipant?.username || 'Unknown User',
        isGroup: dm.isGroup,
        participants: dm.participants.map(p => ({
          id: p._id,
          username: p.username,
          discriminator: p.discriminator,
          avatar: p.avatar,
          status: p.status
        })),
        lastMessage: null,
        lastMessageAt: dm.lastMessageAt,
        ownerId: dm.ownerId,
        icon: dm.icon
      }
    });
  } catch (error) {
    console.error('Create DM error:', error);
    res.status(500).json({
      error: 'Failed to create DM'
    });
  }
};

// Create group DM
const createGroupDM = async (req, res) => {
  try {
    const { participants, name } = req.body;
    const currentUserId = req.user._id;

    if (!participants || participants.length < 2) {
      return res.status(400).json({
        error: 'Group DM must have at least 2 participants'
      });
    }

    // Add current user to participants
    const allParticipants = [...new Set([currentUserId, ...participants])];

    // Check if all users exist
    const users = await User.find({ _id: { $in: allParticipants } });
    if (users.length !== allParticipants.length) {
      return res.status(400).json({
        error: 'One or more users not found'
      });
    }

    // Create group DM
    const dm = await DirectMessage.createGroupDM(allParticipants, name, currentUserId);
    
    // Populate participants
    await dm.populate('participants', 'username discriminator avatar status');
    await dm.populate('ownerId', 'username discriminator avatar');

    res.status(201).json({
      dm: {
        id: dm._id,
        name: dm.name || 'Group DM',
        isGroup: dm.isGroup,
        participants: dm.participants.map(p => ({
          id: p._id,
          username: p.username,
          discriminator: p.discriminator,
          avatar: p.avatar,
          status: p.status
        })),
        lastMessage: null,
        lastMessageAt: dm.lastMessageAt,
        ownerId: {
          id: dm.ownerId._id,
          username: dm.ownerId.username,
          discriminator: dm.ownerId.discriminator,
          avatar: dm.ownerId.avatar
        },
        icon: dm.icon
      }
    });
  } catch (error) {
    console.error('Create group DM error:', error);
    res.status(500).json({
      error: 'Failed to create group DM'
    });
  }
};

// Get DM by ID
const getDM = async (req, res) => {
  try {
    const { dmId } = req.params;
    const userId = req.user._id;

    const dm = await DirectMessage.findOne({
      _id: dmId,
      participants: userId,
      isDeleted: false
    })
    .populate('participants', 'username discriminator avatar status')
    .populate('lastMessageId', 'content createdAt')
    .populate('ownerId', 'username discriminator avatar');

    if (!dm) {
      return res.status(404).json({
        error: 'DM not found'
      });
    }

    const otherParticipants = dm.participants.filter(p => p._id.toString() !== userId.toString());

    res.json({
      dm: {
        id: dm._id,
        name: dm.isGroup ? dm.name : otherParticipants[0]?.username || 'Unknown User',
        isGroup: dm.isGroup,
        participants: dm.participants.map(p => ({
          id: p._id,
          username: p.username,
          discriminator: p.discriminator,
          avatar: p.avatar,
          status: p.status
        })),
        lastMessage: dm.lastMessageId ? {
          id: dm.lastMessageId._id,
          content: dm.lastMessageId.content,
          createdAt: dm.lastMessageId.createdAt
        } : null,
        lastMessageAt: dm.lastMessageAt,
        ownerId: dm.ownerId ? {
          id: dm.ownerId._id,
          username: dm.ownerId.username,
          discriminator: dm.ownerId.discriminator,
          avatar: dm.ownerId.avatar
        } : null,
        icon: dm.icon
      }
    });
  } catch (error) {
    console.error('Get DM error:', error);
    res.status(500).json({
      error: 'Failed to get DM'
    });
  }
};

// Update group DM
const updateGroupDM = async (req, res) => {
  try {
    const { dmId } = req.params;
    const { name, icon } = req.body;
    const userId = req.user._id;

    const dm = await DirectMessage.findOne({
      _id: dmId,
      participants: userId,
      isGroup: true,
      isDeleted: false
    });

    if (!dm) {
      return res.status(404).json({
        error: 'Group DM not found'
      });
    }

    // Check if user is owner
    if (dm.ownerId && dm.ownerId.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'Only group owner can update group DM'
      });
    }

    // Update fields
    if (name !== undefined) dm.name = name;
    if (icon !== undefined) dm.icon = icon;

    await dm.save();

    res.json({
      message: 'Group DM updated successfully',
      dm: {
        id: dm._id,
        name: dm.name,
        icon: dm.icon
      }
    });
  } catch (error) {
    console.error('Update group DM error:', error);
    res.status(500).json({
      error: 'Failed to update group DM'
    });
  }
};

// Leave group DM
const leaveGroupDM = async (req, res) => {
  try {
    const { dmId } = req.params;
    const userId = req.user._id;

    const dm = await DirectMessage.findOne({
      _id: dmId,
      participants: userId,
      isGroup: true,
      isDeleted: false
    });

    if (!dm) {
      return res.status(404).json({
        error: 'Group DM not found'
      });
    }

    // Check if user is owner
    if (dm.ownerId && dm.ownerId.toString() === userId.toString()) {
      return res.status(400).json({
        error: 'Group owner cannot leave. Transfer ownership or delete the group.'
      });
    }

    // Remove user from participants
    await dm.removeParticipant(userId);

    res.json({
      message: 'Left group DM successfully'
    });
  } catch (error) {
    console.error('Leave group DM error:', error);
    res.status(500).json({
      error: 'Failed to leave group DM'
    });
  }
};

module.exports = {
  getUserDMs,
  createDM,
  createGroupDM,
  getDM,
  updateGroupDM,
  leaveGroupDM
};