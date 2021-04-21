const Product = require('../models/product')
const fs = require('fs');


// Products Page
const product_index = (req, res) => {
    Product.find()
        .then((result) => {
            res.render('products/products', { products: result });
        })
        .catch((err) => {
            console.log(err);
        });
}


// Product Details Page
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


// Delete a Product and Images
const product_delete = async (req, res) => {
    let product = await Product.findById(req.params.id);
    fs.unlink('./public/images/products/' + product.image[0], (err) => {
        if (err) {
            throw err;
        }});
    fs.unlink('./public/images/products/' + product.image[1], (err) => {
        if (err) {
            throw err;
        }});
    Product.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.json({ redirect: '/products' });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('404', {});
        });
}


module.exports = { product_index, product_details, product_delete }