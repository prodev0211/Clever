const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const { authenticateToken } = require('../middleware/auth');
const { checkGuildPermission } = require('../middleware/permissions');

// Get all bots for a guild
router.get('/guilds/:guildId/bots', authenticateToken, checkGuildPermission('MANAGE_GUILD'), botController.getGuildBots);

// Create a new bot
router.post('/guilds/:guildId/bots', authenticateToken, checkGuildPermission('MANAGE_GUILD'), botController.createBot);

// Get bot by ID
router.get('/bots/:botId', authenticateToken, botController.getBot);

// Update bot
router.put('/bots/:botId', authenticateToken, checkGuildPermission('MANAGE_GUILD'), botController.updateBot);

// Delete bot
router.delete('/bots/:botId', authenticateToken, checkGuildPermission('MANAGE_GUILD'), botController.deleteBot);

// Regenerate bot token
router.post('/bots/:botId/regenerate-token', authenticateToken, checkGuildPermission('MANAGE_GUILD'), botController.regenerateToken);

module.exports = router;