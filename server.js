const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
require('dotenv').config()


// Initializing Express and View Engine (EJS)
const app = express();
app.set('view engine', 'ejs');


// Connect to MongoDB using Mongoose and Listening for Requests
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then((result)  => { 
        console.log('connected to DB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));


// Middleware/Static Files
app.use(express.static('public'));// Serves static files
app.use(express.json());// Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));// Parses incoming requests with urlencoded payloads
app.use(morgan('dev'));
app.use(cookieParser());
app.use(checkUser);


// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/about', (req, res) => res.render('about'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/productRoutes'));


// 404
app.use((req, res) => res.status(404).render('404'));