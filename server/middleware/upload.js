const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'lms/general';
    let resourceType = 'auto';

    if (file.mimetype.startsWith('video')) {
      folder = 'lms/videos';
      resourceType = 'video';
    } else if (file.mimetype.startsWith('image')) {
      folder = 'lms/images';
      resourceType = 'image';
    } else {
      folder = 'lms/documents';
      resourceType = 'raw';
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'mp4',
        'mov',
        'avi',
        'pdf',
        'doc',
        'docx',
      ],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = upload;
