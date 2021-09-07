const express = require('express');
const router = express.Router();
const { user_register,
    user_register_post,
    user_login,
    user_login_post,
    user_logout } = require('../controllers/userController');
const { add_product, admin, admin_toggle } = require('../controllers/adminController');
const multer = require('multer')
const Product = require('../models/product');


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
const upload = multer({
    storage: storage,
    limits:{
        fieldSize:1024*1024*3
    },
});


// User Routes
router.route('/register').get(user_register).post(user_register_post);
router.route('/login').get(user_login).post(user_login_post);
router.get('/logout', user_logout);
router.get('/admin',  admin);
router.get('/admin/:id',  admin_toggle);
router.post('/admin', upload.array('image'), add_product);
// router.post('/admin', upload.single('image'), add_product);


module.exports = router;