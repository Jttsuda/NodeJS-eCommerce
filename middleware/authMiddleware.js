const jwt = require('jsonwebtoken');
const clsfd = require('../classified');
const User = require('../models/user');

// Require a JWT (Logged in)
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

// Get User Info
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
                // Get Cart Total QTY
                let totalQty = 0;
                for (let i = 0; i < user.cart.length; i++) {
                    totalQty += user.cart[i].qty;
                }
                res.locals.user = user;
                res.locals.totalQty = totalQty;
                next();
            }
        });
    }
    else {
        res.locals.user = undefined;
        next();
    }
};


module.exports = { requireAuth, checkUser };