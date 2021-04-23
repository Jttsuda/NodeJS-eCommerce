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
        const { productId, quantity } = req.body;
        const userId = res.locals.user._id;
        const userCart = await User.findById(userId);
        let inventory = userCart.cart;

        // Checking For Duplicates
        for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].product === productId) {
                const qty = inventory[i].qty;
                const newQty = Number(quantity) + Number(qty);

                inventory.splice(i, 1);
                await User.findByIdAndUpdate(userId, { cart: [{ product: productId, qty: newQty }, ...inventory] });
                return res.json({ redirect: '/cart' });
            }
        }

        await User.findByIdAndUpdate(userId, { cart: [{ product: productId, qty: quantity }, ...inventory] });
        res.json({ redirect: '/cart' });
    } catch (error) {
        console.log(error);
        res.json({ msg: error });
    }
}


// Cart View
const cart_view = async (req, res) => {
    if (typeof res.locals.user === 'object') {
        const user = res.locals.user;
        let items = [];
        let subTotals = [];
        let subTotal = 0.0;
        let totalPrice = 0.0;
        // Getting Cart Objects, SubTotals, and Total Price
        for (let i = 0; i < user.cart.length; i++) {
            const pid = user.cart[i].product;
            const product = await Product.findById(pid);
            const qty = user.cart[i].qty;
            items.push(product);
            subTotal += Number(product.price) * Number(qty);
            subTotal = subTotal.toFixed(2);
            subTotals.push(subTotal);
            totalPrice += Number(subTotal);
            subTotal = 0;
        }

        res.locals.items = items;
        res.locals.subTotals = subTotals;
        res.locals.totalPrice = totalPrice;
    }
    res.render('products/cart');

}


module.exports = { 
    product_index, 
    product_details, 
    product_delete, 
    add_product,
    cart_view
}
