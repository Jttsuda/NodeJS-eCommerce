const express = require('express');
const router = express.Router();
const { product_index, product_details, product_delete, add_product } = require('../controllers/productController');


// Product Routes
router.get('/', product_index);
router.get('/:id', product_details);
router.delete('/:id', product_delete);
router.post('/:id', add_product);
// router.route('/:id').get(comment_details).delete(comment_delete);


module.exports = router;