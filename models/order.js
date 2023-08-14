const  mongoose = require('mongoose');
const { productSchema } = require('./product');

const orderSchema = mongoose.Schema({   
    products: [
        {
            product: productSchema,
            qty: {
                type: Number,
                required: true
            }
        }
    ],
    userId: {
        type: String, 
        required: true
    },
    totalPrice : {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    orderTime: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;