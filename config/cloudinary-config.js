const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({ 
  cloud_name: 'dncihd6ov', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, files) => {
    return {
      folder: 'notof',
      format: ['jpeg','png', 'jpg'],
      public_id: 'some_unique_id',
    };
  }
})
  
const parser = multer({ storage: storage });

module.exports = parser;