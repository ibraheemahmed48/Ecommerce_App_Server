const express = require('express');
const adminRouter = express.Router();
const admin = require('../components/my_admin');
const { Product}  = require('../models/product');
const Order = require('../models/order');

adminRouter.post('/admin/add-product', admin, async (req, res) => {
   try {
      const {name, description, images ,  price,qty, category} = req.body;
      let product = new Product({
        name, description, images ,  price,qty, category
      });
      product = await product.save();
      res.json(product);
   } catch (e) {
     res.status(500).json({error: e.message});
   }
});


adminRouter.get('/admin/get-products', admin, async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (e) {
      res.status(500).json({error: e.message});
    }
});

adminRouter.post('/admin/delete-products', admin, async (req, res) => {
  try {
    const {id} = req.body;
    let product = await Product.findByIdAndDelete(id);
   // product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

adminRouter.get('/api/all-orders-admin', admin, async (req, res) => {
  try {
      const orders = await Order.find({});
      res.json(orders);
  } catch (e) {
      res.status(500).json({error: e.message});
  }
});

adminRouter.post('/admin/update-order-status', admin, async (req, res) => {
  try {
    const {id , status} = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

adminRouter.get('/admin/analytics', admin, async (req, res) => { 
  try {
    const orders = await Order.find({});
    let totalSales = 0;

    for( let i = 0; i < orders.length; i++){
      for( let j = 0; j < orders[i].products.length; j++){
        totalSales += orders[i].products[j].product.price * orders[i].products[j].qty;
      }
    }

    const totalOrders = orders.length;
    const totalProducts = await Product.find({}).countDocuments();
    let catMobiles = await getCategoryTotalSale('Mobiles');
    let catAppliances = await getCategoryTotalSale('Appliances');
    let catFashion = await getCategoryTotalSale('Fashion');
    let catEssentials = await getCategoryTotalSale('Essentials');
    let catComputers = await getCategoryTotalSale('Computers');

    let totals = {
      totalSales,
      totalOrders,
      totalProducts,
      catMobiles,
      catAppliances,
      catFashion,
      catEssentials,
      catComputers
    };

   res.json(totals);
  } catch (e) { 
    res.status(500).json({error: e.message});
  }
});

async function getCategoryTotalSale (category) {
  const orders = await Order.find({ 'products.product.category':  category} );
  let totalSales = 0;
  for( let i = 0; i < orders.length; i++){
    for( let j = 0; j < orders[i].products.length; j++){
        totalSales += orders[i].products[j].product.price * orders[i].products[j].qty;
    }
  }
  return totalSales;
}

module.exports = adminRouter;