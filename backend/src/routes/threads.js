const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createThread, replyToMessage } = require('../controllers/threadController');

// Create a thread from a message
router.post('/:channelId/:messageId/thread', auth, createThread);

// Reply to a message
router.post('/:channelId/:messageId/reply', auth, replyToMessage);

module.exports = router;