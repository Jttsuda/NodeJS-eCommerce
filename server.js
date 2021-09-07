const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productsRoutes = require('./routes/productsRoutes');
const userRoutes = require('./routes/userRoutes');
const clsfd = require('./classified');
const cookieParser = require('cookie-parser');
const { cart_view, item_remove } = require('./controllers/productController');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const multer = require('multer')

// Initializing Express and View Engine (EJS)
const app = express();
app.set('view engine', 'ejs');


// Connect to MongoDB using Mongoose and Listening for Requests
const PORT = process.env.PORT || 3000;
mongoose.connect(clsfd.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then((result)  => { 
        console.log('connected to DB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));


// Middleware/Static Files
app.use(express.static('public'));//Setting up Static Files
app.use(express.json());//Auth for req.body
app.use(express.urlencoded({ extended: true }));//Accepting POST Form Data
app.use(morgan('dev'));
app.use(cookieParser());
app.use(checkUser);


// Routes
app.use(userRoutes);
app.use('/products', productsRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/about', (req, res) => res.render('about'));
app.get('/cart', cart_view);
app.delete('/cart', item_remove);


// 404 Page
app.use((req, res) => res.status(404).render('404'));
