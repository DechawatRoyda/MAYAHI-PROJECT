const express = require('express');
const router = express.Router();
const eventModel = require('../models/event');

router.get("/getEvents", async(req, res)=>{
    try{
        const events = await eventModel.find({});
        return res.send(events);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.post("/createEvent", async(req, res)=>{
    const event = new eventModel({...req.body});
    try{
        const savedEvent = await event.save();
        return res.send(savedEvent);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.get("/getEventById/:userid", async(req, res)=>{
    try{
        const event = await eventModel.find({userid: req.params.userid});
        return res.send(event);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.put("/cancelEvent", async(req, res)=>{
    try{
        const event = await eventModel.findOne({_id: req.body.eventid});
        event.status = 'cancelled';
        await event.save();
        return res.send(event);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.put("/approveEvent", async(req, res)=>{
    try{
        const event = await eventModel.findOne({_id: req.body.eventid});
        event.status = 'approved';
        await event.save();
        return res.send(event);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.delete("/deleteEvent/:eventid", async(req, res)=>{
    try{
        const event = await eventModel.deleteOne({_id: req.params.eventid});
        return res.send(event);
    }catch(err){
        return res.status(400).send({error: err});
    }
});


module.exports = router;