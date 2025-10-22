const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  bulkDeleteMessages
} = require('../controllers/messageController');

// Send message to channel
router.post('/:channelId', auth, sendMessage);

// Get messages from channel
router.get('/:channelId', auth, getMessages);

// Update message
router.put('/:messageId', auth, updateMessage);

// Delete message
router.delete('/:messageId', auth, deleteMessage);

// Bulk delete messages
router.post('/:channelId/bulk-delete', auth, bulkDeleteMessages);

module.exports = router;