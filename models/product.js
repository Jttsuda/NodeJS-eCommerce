const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'placeholder.jpg',
    }
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);