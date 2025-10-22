const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  searchMessages,
  searchChannels,
  searchGuilds,
  searchUsers,
  globalSearch
} = require('../controllers/searchController');

// Search messages
router.get('/messages', auth, searchMessages);

// Search channels
router.get('/channels', auth, searchChannels);

// Search guilds
router.get('/guilds', auth, searchGuilds);

// Search users
router.get('/users', auth, searchUsers);

// Global search
router.get('/global', auth, globalSearch);

module.exports = router;