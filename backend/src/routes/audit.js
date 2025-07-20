const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticateToken } = require('../middleware/auth');
const { checkGuildPermission } = require('../middleware/permissions');

// Get audit logs for a guild
router.get('/guilds/:guildId/audit-logs', authenticateToken, checkGuildPermission('VIEW_AUDIT_LOG'), auditController.getGuildAuditLogs);

// Get audit log by ID
router.get('/audit-logs/:logId', authenticateToken, auditController.getAuditLog);

module.exports = router;