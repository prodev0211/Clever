const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { auth } = require('../middleware/auth');
const { checkGuildPermission } = require('../middleware/permissions');

// Get audit logs for a guild
router.get('/guilds/:guildId/audit-logs', auth, checkGuildPermission('VIEW_AUDIT_LOG'), auditController.getGuildAuditLogs);

// Get audit log by ID
router.get('/audit-logs/:logId', auth, auditController.getAuditLog);

module.exports = router;