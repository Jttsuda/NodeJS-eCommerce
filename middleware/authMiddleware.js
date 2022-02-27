const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()


// Require Authentication
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // Verifying Token
    if (token) {
        jwt.verify(token, process.env.key, (err, decodedToken) => {
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
        jwt.verify(token, process.env.key, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                const user = await User.findById(decodedToken.id);
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