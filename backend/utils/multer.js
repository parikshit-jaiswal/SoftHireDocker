const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ProfilePhotos',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});
const upload = multer({ storage });

module.exports = upload;
