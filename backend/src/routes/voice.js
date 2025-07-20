const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const { authenticateToken } = require('../middleware/auth');

// Join voice channel
router.post('/channels/:channelId/join', authenticateToken, voiceController.joinVoiceChannel);

// Leave voice channel
router.post('/channels/:channelId/leave', authenticateToken, voiceController.leaveVoiceChannel);

// Get voice channel participants
router.get('/channels/:channelId/participants', authenticateToken, voiceController.getVoiceParticipants);

// Mute/unmute user in voice channel
router.post('/channels/:channelId/mute/:userId', authenticateToken, voiceController.muteUser);

// Deafen/undeafen user in voice channel
router.post('/channels/:channelId/deafen/:userId', authenticateToken, voiceController.deafenUser);

// Move user to different voice channel
router.post('/channels/:channelId/move/:userId', authenticateToken, voiceController.moveUser);

module.exports = router;