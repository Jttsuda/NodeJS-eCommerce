const express = require('express');
const router = express.Router();
// const {  } = require('../controllers/productController');


// Comment Routes
router.get('/', (req, res) => res.render('products'));
// router.post('/', comment_add);
// router.get('/:id', comment_details);
// router.delete('/:id', comment_delete);
// router.route('/:id').get(comment_details).delete(comment_delete);


module.exports = router;