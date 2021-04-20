const Product = require('../models/product')


const product_index = (req, res) => {
    Product.find()
        .then((result) => {
            res.render('products/products', { products: result });
        })
        .catch((err) => {
            console.log(err);
        });
}


const product_details = (req, res) => {
    Product.findById(req.params.id)
        .then((result) => {
                res.render('products/product', { product: result });
            })
            .catch((err) => {
                console.log(err);
                res.status(404).render('404', {});
            });
}


module.exports = { product_index, product_details }