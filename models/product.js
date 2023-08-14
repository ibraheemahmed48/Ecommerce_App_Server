const  mongoose = require('mongoose');
const reqtingSchema = require('./rate');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    description: {
        type: String,
        required: true, 
        trim: true
    },
    images: [
        {
            type: String,
            required: true, 
        }
    ],
    price: {
        type: Number,
        required: true, 
    },
    qty: {
        type: Number,
        required: true, 
    },
    category: {
        type: String,
        required: true, 
        trim: true
    },
    rating: [reqtingSchema]
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product , productSchema };