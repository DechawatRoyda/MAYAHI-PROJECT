const express = require('express');
const roomModel = require('../models/room');
const router = express.Router();

router.get("/getRooms", async(req, res)=>{
    try{
        const rooms = await roomModel.find({});
        return res.send(rooms);
    }catch(err){
        return res.status(400).send({error: err});
    }
});

router.get("/getRoomByID/:roomid", async(req, res)=>{
    const roonID = req.params.roomid;
    try{
        const room = await roomModel.findOne({_id: roonID});
        return res.send(room);
    }catch(err){
        return res.status(400).send({error: err});
    }
});


module.exports = router;