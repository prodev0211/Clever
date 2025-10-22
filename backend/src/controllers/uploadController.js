const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const Attachment = require('../models/Attachment');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'application/pdf', 'application/zip', 'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 10 // Max 10 files per request
  }
});

// Upload files
const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded'
      });
    }

    const attachments = [];
    const userId = req.user._id;

    for (const file of req.files) {
      let thumbnailUrl = null;
      let width = null;
      let height = null;

      // Generate thumbnail for images
      if (file.mimetype.startsWith('image/')) {
        try {
          const thumbnailName = `thumb-${file.filename}`;
          const thumbnailPath = path.join(__dirname, '../../uploads', thumbnailName);
          
          await sharp(file.path)
            .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);

          thumbnailUrl = `/uploads/${thumbnailName}`;

          // Get image dimensions
          const metadata = await sharp(file.path).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (error) {
          console.error('Thumbnail generation error:', error);
        }
      }

      // Create attachment record
      const attachment = new Attachment({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        thumbnailUrl,
        width,
        height,
        uploadedBy: userId
      });

      await attachment.save();
      attachments.push(attachment);
    }

    res.json({
      message: 'Files uploaded successfully',
      attachments: attachments.map(att => ({
        id: att._id,
        filename: att.filename,
        originalName: att.originalName,
        mimeType: att.mimeType,
        size: att.size,
        url: att.url,
        thumbnailUrl: att.thumbnailUrl,
        width: att.width,
        height: att.height,
        fileType: att.fileType,
        formattedSize: att.formattedSize
      }))
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload files'
    });
  }
};

// Get file info
const getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const attachment = await Attachment.findById(fileId);
    if (!attachment) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    res.json({
      attachment: {
        id: attachment._id,
        filename: attachment.filename,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.size,
        url: attachment.url,
        thumbnailUrl: attachment.thumbnailUrl,
        width: attachment.width,
        height: attachment.height,
        fileType: attachment.fileType,
        formattedSize: attachment.formattedSize,
        uploadedBy: attachment.uploadedBy,
        createdAt: attachment.createdAt
      }
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      error: 'Failed to get file info'
    });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;

    const attachment = await Attachment.findById(fileId);
    if (!attachment) {
      return res.status(404).json({
        error: 'File not found'
      });
    }

    // Check if user owns the file or has permission
    if (attachment.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'Permission denied'
      });
    }

    // Delete physical files
    const filePath = path.join(__dirname, '../../uploads', attachment.filename);
    const thumbnailPath = attachment.thumbnailUrl 
      ? path.join(__dirname, '../../uploads', path.basename(attachment.thumbnailUrl))
      : null;

    try {
      await fs.unlink(filePath);
      if (thumbnailPath) {
        await fs.unlink(thumbnailPath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }

    // Delete from database
    await Attachment.findByIdAndDelete(fileId);

    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      error: 'Failed to delete file'
    });
  }
};

module.exports = {
  upload,
  uploadFiles,
  getFileInfo,
  deleteFile
};