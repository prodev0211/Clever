const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createChannel,
  getGuildChannels,
  getChannel,
  updateChannel,
  deleteChannel,
  getChannelMessages,
  reorderChannels
} = require('../controllers/channelController');

// Get guild channels
router.get('/guild/:guildId', auth, getGuildChannels);

// Create channel in guild
router.post('/guild/:guildId', auth, createChannel);

// Reorder channels in guild
router.put('/guild/:guildId/reorder', auth, reorderChannels);

// Get channel by ID
router.get('/:channelId', auth, getChannel);

// Update channel
router.put('/:channelId', auth, updateChannel);

// Delete channel
router.delete('/:channelId', auth, deleteChannel);

// Get channel messages
router.get('/:channelId/messages', auth, getChannelMessages);

module.exports = router;