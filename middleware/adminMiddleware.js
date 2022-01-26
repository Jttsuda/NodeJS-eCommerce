const multer = require('multer')


// Define Storage for Images
const storage = multer.diskStorage({
    // Destination for Files
    destination: function (request, file, callback) {
        callback(null, './public/images/products');
    },
    // Add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname)
    },
});

// Upload paramaters for multer
const imageUpload = multer({
    storage: storage,
    limits:{
        fieldSize:1024*1024*3
    },
});


module.exports = { imageUpload }