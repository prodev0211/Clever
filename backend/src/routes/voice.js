const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const { auth } = require('../middleware/auth');

// Join voice channel
router.post('/channels/:channelId/join', auth, voiceController.joinVoiceChannel);

// Leave voice channel
router.post('/channels/:channelId/leave', auth, voiceController.leaveVoiceChannel);

// Get voice channel participants
router.get('/channels/:channelId/participants', auth, voiceController.getVoiceParticipants);

// Mute/unmute user in voice channel
router.post('/channels/:channelId/mute/:userId', auth, voiceController.muteUser);

// Deafen/undeafen user in voice channel
router.post('/channels/:channelId/deafen/:userId', auth, voiceController.deafenUser);

// Move user to different voice channel
router.post('/channels/:channelId/move/:userId', auth, voiceController.moveUser);

module.exports = router;