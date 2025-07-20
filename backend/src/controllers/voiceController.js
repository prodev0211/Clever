const VoiceParticipant = require('../models/VoiceParticipant');
const Channel = require('../models/Channel');

// Join voice channel
exports.joinVoiceChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    
    // Check if channel exists and is voice channel
    const channel = await Channel.findById(channelId);
    if (!channel || channel.type !== 'GUILD_VOICE') {
      return res.status(404).json({ error: 'Voice channel not found' });
    }
    
    // Check if user is already in a voice channel
    const existingParticipant = await VoiceParticipant.findOne({ userId });
    if (existingParticipant) {
      // Leave current voice channel
      await VoiceParticipant.findByIdAndDelete(existingParticipant._id);
    }
    
    // Join new voice channel
    const participant = new VoiceParticipant({
      userId,
      channelId,
      guildId: channel.guildId,
      joinedAt: new Date(),
      isMuted: false,
      isDeafened: false
    });
    
    await participant.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(channelId).emit('voice:userJoined', {
        userId,
        channelId,
        username: req.user.username,
        avatar: req.user.avatar
      });
    }
    
    res.json({ message: 'Joined voice channel successfully' });
  } catch (error) {
    console.error('Error joining voice channel:', error);
    res.status(500).json({ error: 'Failed to join voice channel' });
  }
};

// Leave voice channel
exports.leaveVoiceChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    
    const participant = await VoiceParticipant.findOneAndDelete({
      userId,
      channelId
    });
    
    if (!participant) {
      return res.status(404).json({ error: 'Not in voice channel' });
    }
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(channelId).emit('voice:userLeft', {
        userId,
        channelId
      });
    }
    
    res.json({ message: 'Left voice channel successfully' });
  } catch (error) {
    console.error('Error leaving voice channel:', error);
    res.status(500).json({ error: 'Failed to leave voice channel' });
  }
};

// Get voice channel participants
exports.getVoiceParticipants = async (req, res) => {
  try {
    const { channelId } = req.params;
    
    const participants = await VoiceParticipant.find({ channelId })
      .populate('userId', 'username avatar')
      .sort({ joinedAt: 1 });
    
    res.json(participants);
  } catch (error) {
    console.error('Error fetching voice participants:', error);
    res.status(500).json({ error: 'Failed to fetch voice participants' });
  }
};

// Mute/unmute user in voice channel
exports.muteUser = async (req, res) => {
  try {
    const { channelId, userId } = req.params;
    const { muted } = req.body;
    
    const participant = await VoiceParticipant.findOne({
      userId,
      channelId
    });
    
    if (!participant) {
      return res.status(404).json({ error: 'User not in voice channel' });
    }
    
    participant.isMuted = muted;
    await participant.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(channelId).emit('voice:userMuted', {
        userId,
        channelId,
        muted
      });
    }
    
    res.json({ message: `User ${muted ? 'muted' : 'unmuted'} successfully` });
  } catch (error) {
    console.error('Error muting user:', error);
    res.status(500).json({ error: 'Failed to mute user' });
  }
};

// Deafen/undeafen user in voice channel
exports.deafenUser = async (req, res) => {
  try {
    const { channelId, userId } = req.params;
    const { deafened } = req.body;
    
    const participant = await VoiceParticipant.findOne({
      userId,
      channelId
    });
    
    if (!participant) {
      return res.status(404).json({ error: 'User not in voice channel' });
    }
    
    participant.isDeafened = deafened;
    await participant.save();
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(channelId).emit('voice:userDeafened', {
        userId,
        channelId,
        deafened
      });
    }
    
    res.json({ message: `User ${deafened ? 'deafened' : 'undeafened'} successfully` });
  } catch (error) {
    console.error('Error deafening user:', error);
    res.status(500).json({ error: 'Failed to deafen user' });
  }
};

// Move user to different voice channel
exports.moveUser = async (req, res) => {
  try {
    const { channelId, userId } = req.params;
    const { targetChannelId } = req.body;
    
    // Check if target channel exists and is voice channel
    const targetChannel = await Channel.findById(targetChannelId);
    if (!targetChannel || targetChannel.type !== 'GUILD_VOICE') {
      return res.status(404).json({ error: 'Target voice channel not found' });
    }
    
    const participant = await VoiceParticipant.findOne({
      userId,
      channelId
    });
    
    if (!participant) {
      return res.status(404).json({ error: 'User not in voice channel' });
    }
    
    // Move user to new channel
    participant.channelId = targetChannelId;
    participant.guildId = targetChannel.guildId;
    await participant.save();
    
    // Emit socket events
    const io = req.app.get('io');
    if (io) {
      io.to(channelId).emit('voice:userLeft', { userId, channelId });
      io.to(targetChannelId).emit('voice:userJoined', {
        userId,
        channelId: targetChannelId,
        username: req.user.username,
        avatar: req.user.avatar
      });
    }
    
    res.json({ message: 'User moved successfully' });
  } catch (error) {
    console.error('Error moving user:', error);
    res.status(500).json({ error: 'Failed to move user' });
  }
};