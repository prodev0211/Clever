const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const { auth } = require('../middleware/auth');
const { checkGuildPermission } = require('../middleware/permissions');

// Get all bots for a guild
router.get('/guilds/:guildId/bots', auth, checkGuildPermission('MANAGE_GUILD'), botController.getGuildBots);

// Create a new bot
router.post('/guilds/:guildId/bots', auth, checkGuildPermission('MANAGE_GUILD'), botController.createBot);

// Get bot by ID
router.get('/bots/:botId', auth, botController.getBot);

// Update bot
router.put('/bots/:botId', auth, checkGuildPermission('MANAGE_GUILD'), botController.updateBot);

// Delete bot
router.delete('/bots/:botId', auth, checkGuildPermission('MANAGE_GUILD'), botController.deleteBot);

// Regenerate bot token
router.post('/bots/:botId/regenerate-token', auth, checkGuildPermission('MANAGE_GUILD'), botController.regenerateToken);

module.exports = router;