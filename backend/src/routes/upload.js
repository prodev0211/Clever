const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { upload, uploadFiles, getFileInfo, deleteFile } = require('../controllers/uploadController');

// Upload files
router.post('/', auth, upload.array('files', 10), uploadFiles);

// Get file info
router.get('/:fileId', auth, getFileInfo);

// Delete file
router.delete('/:fileId', auth, deleteFile);

module.exports = router;