const multer = require('multer');
const path = require('path');

const storageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
      const {userId} = req.body; // Get the userId from the request body
      const fileName = `${userId}.xlsx`; // Construct the file name
      cb(null, fileName);
    }
  });


const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.xlsx') {
    return cb(new Error('Allow only files .xlsx'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storageUpload, fileFilter: fileFilter }).single('myFile');

module.exports = { upload };