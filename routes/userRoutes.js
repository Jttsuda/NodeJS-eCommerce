const express = require('express');
const router = express.Router();
const { 
    register_page, 
    register_user, 
    login_page, login_user, 
    logout_user } = require('../controllers/userController');
const { 
    add_product, 
    admin, 
    admin_toggle } = require('../controllers/adminController');
const { imageUpload } = require('../middleware/adminMiddleware');


router.route('/register').get(register_page).post(register_user);
router.route('/login').get(login_page).post(login_user);
router.get('/logout', logout_user);
router.get('/admin',  admin);
router.get('/admin/:id',  admin_toggle);
router.post('/admin', imageUpload.array('image'), add_product);
// router.post('/admin', imageUpload.single('image'), add_product);


module.exports = router;