const express = require('express');
const router = express.Router();
const { 
    user_register, 
    user_register_post, 
    user_login, user_login_post, 
    user_logout } = require('../controllers/userController');
const { 
    add_product, 
    admin, 
    admin_toggle } = require('../controllers/adminController');
const { imageUpload } = require('../middleware/adminMiddleware');


router.route('/register').get(user_register).post(user_register_post);
router.route('/login').get(user_login).post(user_login_post);
router.get('/logout', user_logout);
router.get('/admin',  admin);
router.get('/admin/:id',  admin_toggle);
router.post('/admin', imageUpload.array('image'), add_product);
// router.post('/admin', imageUpload.single('image'), add_product);


module.exports = router;