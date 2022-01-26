const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const clsfd = require('./classified'); // use dotenv
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');


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
app.use(express.json());//To recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded({ extended: true }));//Accepting POST Form Data
app.use(morgan('dev'));
app.use(cookieParser());
app.use(checkUser);


// Routes
app.use(userRoutes);
app.use(productRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/about', (req, res) => res.render('about'));


// 404
app.use((req, res) => res.status(404).render('404'));