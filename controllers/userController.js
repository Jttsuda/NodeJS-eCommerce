const User = require('../models/user');
const jwt = require('jsonwebtoken');
const clsfd = require('../classified');


// Handle Errors
const handleErrors = (err) => {
    // console.log(err.message, err.code);
    let errors = { username: '', password: '' };

    // Duplicate Error Code
    if (err.code === 11000) {
        errors.username = 'Username Already Exists';
        return errors;
    }

    // Validation Errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}


// Create JWT
const maxAge = 3 * 24 * 60 * 60; // value in seconds
const createToken = (id) => {
    return jwt.sign({ id }, clsfd.secretKey, {
        expiresIn: maxAge
    });
}


// Register
const user_register = (req, res) => {
    res.render('users/register');
}

const user_register_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}


// Login
const user_login = (req, res) => {
    res.render('users/login');
}

const user_login_post = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        res.status(400).json({ error: 'Inavlid Username/Password' });
    }
}


// Logout
const user_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}


// User Home
const user_home = (req, res) => {
    res.render('users/user_home');
}



// Exports
module.exports = {
    user_register,
    user_register_post,
    user_login,
    user_login_post,
    user_logout,
    user_home
}
