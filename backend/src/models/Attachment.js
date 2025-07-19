const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  duration: {
    type: Number // For audio/video files
  },
  isSpoiler: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
attachmentSchema.index({ messageId: 1 });
attachmentSchema.index({ uploadedBy: 1 });

// Virtual for file type
attachmentSchema.virtual('fileType').get(function() {
  if (this.mimeType.startsWith('image/')) return 'image';
  if (this.mimeType.startsWith('video/')) return 'video';
  if (this.mimeType.startsWith('audio/')) return 'audio';
  return 'file';
});

// Virtual for isImage
attachmentSchema.virtual('isImage').get(function() {
  return this.mimeType.startsWith('image/');
});

// Virtual for isVideo
attachmentSchema.virtual('isVideo').get(function() {
  return this.mimeType.startsWith('video/');
});

// Virtual for isAudio
attachmentSchema.virtual('isAudio').get(function() {
  return this.mimeType.startsWith('audio/');
});

// Virtual for formatted size
attachmentSchema.virtual('formattedSize').get(function() {
  const bytes = this.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

module.exports = mongoose.model('Attachment', attachmentSchema);