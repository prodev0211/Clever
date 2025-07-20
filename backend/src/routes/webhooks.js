const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { authenticateToken } = require('../middleware/auth');
const { checkGuildPermission } = require('../middleware/permissions');

// Get all webhooks for a guild
router.get('/guilds/:guildId/webhooks', authenticateToken, checkGuildPermission('MANAGE_WEBHOOKS'), webhookController.getGuildWebhooks);

// Create a new webhook
router.post('/guilds/:guildId/webhooks', authenticateToken, checkGuildPermission('MANAGE_WEBHOOKS'), webhookController.createWebhook);

// Get webhook by ID
router.get('/webhooks/:webhookId', authenticateToken, webhookController.getWebhook);

// Update webhook
router.put('/webhooks/:webhookId', authenticateToken, checkGuildPermission('MANAGE_WEBHOOKS'), webhookController.updateWebhook);

// Delete webhook
router.delete('/webhooks/:webhookId', authenticateToken, checkGuildPermission('MANAGE_WEBHOOKS'), webhookController.deleteWebhook);

// Execute webhook
router.post('/webhooks/:webhookId/execute', webhookController.executeWebhook);

module.exports = router;