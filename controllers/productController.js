const Product = require('../models/product')
const User = require('../models/user')
const fs = require('fs');


// Products Page
const product_index = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products/products', { products });
    } catch (err) {
        console.log(err);
    }
}


// Product Details Page
const product_details = (req, res) => {
    Product.findById(req.params.id)
        .then((result) => {
            res.render('products/product', { product: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('404');
        });
}


// Delete a Product and Images
const product_delete = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        fs.unlink('./public/images/products/' + product.image[0], 
        (err) => { if (err) { throw err; }});
        fs.unlink('./public/images/products/' + product.image[1], 
        (err) => { if (err) { throw err; }});
        product.delete();
        res.json({ redirect: '/products' });
    } catch (err) {
        console.log(err);
        res.status(404).render('404');
    }
}


// Add Product to Cart
const add_product = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const userCart = await User.findById(userId);
        let inventory = userCart.cart;

        // Checking For Duplicates
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].product === productId) {
                const qty = inventory[i].qty;
                const newQty = Number(quantity) + Number(qty);

                inventory.splice(i, 1);
                await User.findByIdAndUpdate(userId, { cart: [{ product: productId, qty: newQty }, ...inventory] });
                return res.json({ redirect: '/products' });
            }
        }

        await User.findByIdAndUpdate(userId, { cart: [{ product: productId, qty: quantity }, ...inventory] });
        res.json({ redirect: '/products' });
    } catch (error) {
        console.log(error);
        res.json({ msg: error });
    }
}


// Cart View
const cart_view = async (req, res) => {
    res.render('products/cart');
}


module.exports = { 
    product_index, 
    product_details, 
    product_delete, 
    add_product,
    cart_view
}
