const express = require('express');
const userRouter = express.Router();
const auth = require('../components/my_auth');
const { Product } = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

userRouter.post('/api/add-to-cart', auth, async (req, res) => {
    try {
        const {id , qty} = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);
        if (user.cart.length == 0) {
            const cartSchema = {
                product ,
                qty: Number(qty)
            }
            user.cart.push(cartSchema);
        } else {
            let isFound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.equals(id)) {
                    user.cart[i].qty += Number(qty);
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                const cartSchema = {
                    product ,
                    qty: Number(qty)
                }
                user.cart.push(cartSchema);
            }
        }
        user = await user.save(); 
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.delete('/api/remove-to-cart/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        let user = await User.findById(req.user);
        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.equals(id)) {
                if (user.cart[i].qty > 1) {
                    user.cart[i].qty -= 1;
                } else {
                    user.cart.splice(i, 1);
                }
                break;
            }
        }
        user = await user.save(); 
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.post('/api/save-user-address', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user);
        const {address} = req.body;
        user.address = address;
        user = await user.save(); 
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.post('/api/order', auth, async (req, res) => {
    try {
        const { cart , totalPrice , address, paymentMethod} = req.body;
        let products = [];
        for (let i = 0; i < cart.length; i++) {
            let product =  await Product.findById(cart[i].product._id);
            if (product.qty >= cart[i].qty) {
                product.qty -= cart[i].qty;
                products.push({product , qty: cart[i].qty});
                product = await product.save();
            } else {    
                return res.status(400).json({msg: 'product is out of stock'});
            }
        }
        let user = await User.findById(req.user);
        user.cart = [];
        user = await user.save();

        let order = new Order({
            products,
            userId: req.user,
            totalPrice,
            address,
            orderTime: new Date().getTime(),
            status: 0,
            paymentMethod
        });
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

userRouter.get('/api/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.user});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

module.exports = userRouter;