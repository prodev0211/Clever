const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createGuild,
  getUserGuilds,
  getGuild,
  updateGuild,
  deleteGuild,
  leaveGuild,
  getGuildMembers
} = require('../controllers/guildController');

// Get user's guilds
router.get('/', auth, getUserGuilds);

// Create new guild
router.post('/', auth, createGuild);

// Get guild by ID
router.get('/:guildId', auth, getGuild);

// Update guild
router.put('/:guildId', auth, updateGuild);

// Delete guild
router.delete('/:guildId', auth, deleteGuild);

// Leave guild
router.post('/:guildId/leave', auth, leaveGuild);

// Get guild members
router.get('/:guildId/members', auth, getGuildMembers);

module.exports = router;