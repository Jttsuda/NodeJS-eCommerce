const express = require('express');
const router = express.Router();
const { product_index, product_details } = require('../controllers/productController');


// Comment Routes
router.get('/', product_index);
router.get('/:id', product_details);
// router.route('/:id').get(comment_details).delete(comment_delete);


module.exports = router;