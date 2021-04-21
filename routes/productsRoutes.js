const express = require('express');
const router = express.Router();
const { product_index, product_details, product_delete } = require('../controllers/productController');


// Product Routes
router.get('/', product_index);
router.get('/:id', product_details);
router.delete('/:id', product_delete);
// router.route('/:id').get(comment_details).delete(comment_delete);


module.exports = router;