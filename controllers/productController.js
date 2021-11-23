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


// Remove Product From Cart
const item_remove = async (req, res) => {
    try {
        const { objectid } = req.body;
        const user = res.locals.user;
        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i]._id.toString() === objectid) {
                const userCart = user.cart.filter(item => item._id.toString() !== objectid);
                await User.findByIdAndUpdate(user._id, { cart: userCart });
                return res.json({ redirect: '/cart' });
            } 
        }
        res.json({ redirect: '/cart' });
    } catch (err) {
        console.log(err);
        res.status(404).render('404');
    }
}


// Increment or Decrement Product QTY in Cart
const change_quantity = async (req, res) => {
    try {
        const { incId = false, decId = false } = req.body;
        const user = res.locals.user;
        const inventory = user.cart;
        if (incId){
            for (let i = 0; i < inventory.length; i++) {
                if (inventory[i]._id == incId) {
                    user.cart[i].qty = inventory[i].qty + 1;
                    await user.save();
                    break;
                } 
            }
        }
        else if (decId){
            for (let i = 0; i < inventory.length; i++) {
                if (inventory[i]._id == decId) {
                    const newQty = inventory[i].qty - 1;
                    newQty > 0 ? user.cart[i].qty = newQty : user.cart.splice(i, 1);
                    await user.save();
                    break;
                } 
            }
        }
        res.json({ redirect: '/cart' });
    }
    catch (err) {
        console.log(err);
    }
}


module.exports = { 
    product_index, 
    product_details, 
    product_delete, 
    add_product,
    cart_view,
    item_remove,
    change_quantity
}