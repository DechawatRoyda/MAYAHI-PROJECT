const express = require('express');
const foodModel = require('../models/food');
const router = express.Router();
const orderModel = require('../models/order');
const transactionModel = require('../models/transaction');

router.get("/getFoods", async(req, res)=>{
    try{
        const foods = await foodModel.find({});
        return res.send(foods);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.post("/addFood", async(req, res)=>{
    try{
        const food = new foodModel({...req.body});
        const savedFood = await food.save();
        return res.send(savedFood);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.post("/orderFood", async(req, res)=>{
    try{
        const order = new orderModel({...req.body, status: 'cooking'});
        const savedOrder = await order.save();

        const transaction = new transactionModel({
            userid: req.body.userid,
            transactionid: order._id,
            category: 'Food Order',
            amount: req.body.totalprice,
            paymentMethod: req.body.paymentMethod,
            status: 'waiting'
        });
        await transaction.save();

        return res.send(savedOrder);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.get("/getOrdersByUserId/:userid", async(req, res)=>{
    try{
        const orders = await orderModel.find({userid: req.params.userid});
        return res.send(orders);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.put("/cancelOrder", async(req, res)=>{
    try{
        const order = await orderModel.findOne({_id: req.body.orderid});
        order.status = 'cancelled';
        await order.save();

        const transaction = await transactionModel.findOne({transactionid: req.body.orderid});
        transaction.status = 'cancelled';
        await transaction.save();

        return res.send(order);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.get('/getFoodTypePopularity', async (req, res) => {
    try {
      const orders = await orderModel.find({});
      const foodTypes = await foodModel.distinct('CategoryName');
      const foodTypePopularity = {};
  
      foodTypes.forEach(foodType => {
        foodTypePopularity[foodType] = 0;
      });
  
      orders.forEach(order => {
        order.orderitems.forEach(orderitem => {
          foodTypePopularity[orderitem.category] += orderitem.count;
        });
      });
  
      return res.send(foodTypePopularity);
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
  });




module.exports = router;