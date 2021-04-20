const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: [String],
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);