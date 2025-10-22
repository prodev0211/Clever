const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  addReaction,
  removeReaction,
  getMessageReactions
} = require('../controllers/reactionController');

// Add reaction to message
router.post('/:messageId', auth, addReaction);

// Remove reaction from message
router.delete('/:messageId', auth, removeReaction);

// Get reactions for a message
router.get('/:messageId', auth, getMessageReactions);

module.exports = router;