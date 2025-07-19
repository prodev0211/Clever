const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getUserDMs,
  createDM,
  createGroupDM,
  getDM,
  updateGroupDM,
  leaveGroupDM
} = require('../controllers/dmController');

// Get user's DMs
router.get('/', auth, getUserDMs);

// Create or get DM with user
router.post('/', auth, createDM);

// Create group DM
router.post('/group', auth, createGroupDM);

// Get DM by ID
router.get('/:dmId', auth, getDM);

// Update group DM
router.patch('/:dmId', auth, updateGroupDM);

// Leave group DM
router.delete('/:dmId/leave', auth, leaveGroupDM);

module.exports = router;