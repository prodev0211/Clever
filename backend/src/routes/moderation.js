const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { kickMember, banMember, unbanMember, timeoutMember } = require('../controllers/moderationController');

router.post('/:guildId/:userId/kick', auth, kickMember);
router.post('/:guildId/:userId/ban', auth, banMember);
router.post('/:guildId/:userId/unban', auth, unbanMember);
router.post('/:guildId/:userId/timeout', auth, timeoutMember);

module.exports = router;