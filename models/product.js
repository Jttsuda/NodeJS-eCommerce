const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: [String],
    categories: [String],
}, { timestamps: true });


const Product = mongoose.model('Product', productSchema);
module.exports = Product;