const mongoose = require('mongoose');

var MONGO_URL = 'mongodb+srv://whanchinna:pwkIXeo730HAi49y@inaweek.delgucu.mongodb.net/test';

mongoose.connect(MONGO_URL, {useUnifiedTopology: true, useNewUrlParser: true});

var connection = mongoose.connection;

connection.on('error', ()=>{
    console.log('MongoDB connection failed');
});

connection.once('connected', ()=>{
    console.log('MongoDB connection successfull');
});

module.exports = mongoose;