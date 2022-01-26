const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const handleErrors = (err) => {
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


const maxAge = 3 * 24 * 60 * 60; // value in seconds
const createToken = (id) => {
    return jwt.sign({ id }, process.env.key, {
        expiresIn: maxAge
    });
}


const register_page = (req, res) => {
    res.render('users/register');
}

const register_user = async (req, res) => {
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


const login_page = (req, res) => {
    res.render('users/login');
}

const login_user = async (req, res) => {
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

const logout_user = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}


const user_home = (req, res) => {
    res.render('users/user_home');
}


module.exports = {
    register_page,
    register_user,
    login_page,
    login_user,
    logout_user,
    user_home
}