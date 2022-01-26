const express = require('express');
const router = express.Router();
const { 
    product_index, 
    product_details, 
    delete_product, 
    add_product, 
    cart_view, 
    change_quantity, 
    remove_product } = require('../controllers/productController');


router.get('/products/', product_index);
router.get('/products/:id', product_details);
router.delete('/products/:id', delete_product);
router.post('/products/:id', add_product);
router.get('/cart', cart_view);
router.post('/cart', change_quantity);
router.delete('/cart', remove_product);
// router.route('/:id').get(comment_details).delete(comment_delete);


module.exports = router;