const jwt = require('jsonwebtoken');
const clsfd = require('../classified');
const User = require('../models/user');
const Product = require('../models/product');


// Authorization
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // Verifying Token
    if (token) {
        jwt.verify(token, clsfd.secretKey, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        });
    }
    else {
        res.redirect('/login');
    }
};


// Getting User Info
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // Verifying Token
    if (token) {
        jwt.verify(token, clsfd.secretKey, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                // Check Cart Total QTY
                let total = 0;
                for (let i = 0; i < user.cart.length; i++) {
                    total += user.cart[i].qty;
                }
                res.locals.user = user;
                res.locals.total = total;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
};


// User Cart Info
const checkUserCart = (req, res, next) => {
    const token = req.cookies.jwt;
    // Verifying Token
    if (token) {
        jwt.verify(token, clsfd.secretKey, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                // Get Cart Objects
                let items = [];
                for (let i = 0; i < user.cart.length; i++) {
                    const pid = user.cart[i].product;
                    const product = await Product.findById(pid);
                    items.push(product);
                }
                res.locals.items = items;
                // Get Subtotals
                let subTotals = [];
                let subTotal = 0;
                for (let x = 0; x < items.length; x++) {
                    for (let i = 0; i < user.cart[x].qty; i++) {
                        subTotal += Number(items[x].price);
                    }
                    subTotals.push(subTotal);
                    subTotal = 0;
                }
                res.locals.subTotals = subTotals;
                next();
            }
        });
    }
    else {
        next();
    }
};


module.exports = { requireAuth, checkUser, checkUserCart };