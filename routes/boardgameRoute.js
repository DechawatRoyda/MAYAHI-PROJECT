const express = require('express');
const router = express.Router();
const boardgameModel = require('../models/boardgame');
const borrowModel = require('../models/borrowboardgame');
const transactionModel = require('../models/transaction');

router.get("/getBoardgames", async(req, res)=>{
    try{
        const boardgames = await boardgameModel.find({});
        return res.send(boardgames);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.post("/borrowBoardgame", async(req, res)=>{
    try{
        const borrow = new borrowModel({...req.body, status: 'borrowing'});
        const savedBorrow = await borrow.save();

        const transaction = new transactionModel({
            userid: req.body.userid,
            transactionid: borrow._id,
            category: 'Boardgame Borrowing',
            amount: req.body.totalprice,
            paymentMethod: req.body.paymentMethod,
            status: 'waiting'
        });
        await transaction.save();

        return res.send(savedBorrow);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.get("/getBorrowsByUserId/:userid", async(req, res)=>{
    try{
        const borrows = await borrowModel.find({userid: req.params.userid});
        return res.send(borrows);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.put("/returnBoardgame", async(req, res)=>{
    try{
        const borrow = await borrowModel.findOne({_id: req.body.borrowid});
        borrow.status = 'returned';
        await borrow.save();

        return res.send(borrow);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.get("/getBoardgamePopularity", async(req, res)=>{
    try{
        const borrows = await borrowModel.find({});
        const boardgames = await boardgameModel.distinct('CategoryName');
        const boardgamePopularity = {};
        boardgames.forEach(boardgame => {
            boardgamePopularity[boardgame] = 0;
        });
        borrows.forEach(borrow => {
            borrow.boardgames.forEach(boardgame => {
                boardgamePopularity[boardgame.category] += boardgame.count;
            });
        });
        return res.send(boardgamePopularity);
    }catch(err){
        return res.status(400).send({error: err});
    }
});



module.exports = router;