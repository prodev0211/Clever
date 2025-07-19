const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getGuildRoles,
  createRole,
  updateRole,
  deleteRole,
  updateRolePositions,
  getPermissions
} = require('../controllers/roleController');

// Get all roles for a guild
router.get('/guild/:guildId', auth, getGuildRoles);

// Create a new role
router.post('/guild/:guildId', auth, createRole);

// Update a role
router.patch('/guild/:guildId/:roleId', auth, updateRole);

// Delete a role
router.delete('/guild/:guildId/:roleId', auth, deleteRole);

// Update role positions
router.patch('/guild/:guildId/positions', auth, updateRolePositions);

// Get available permissions
router.get('/permissions', auth, getPermissions);

module.exports = router;