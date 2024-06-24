const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder: 'userPics',
    allowedFormats: ["jpg","jpeg","png","gif"]
  }
});
const upload = multer({storage: storage});
module.exports = upload;
