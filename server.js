const express = require('express');
const app = express();
const dbConfig = require('./db');
const roomRoute = require('./routes/roomRoute');
const userRoute = require('./routes/userRoute');
const bookingRoute = require('./routes/bookingRoute');
const foodRoute = require('./routes/foodRoute');
const eventRoute = require('./routes/eventRoute');
const boardgameRoute = require('./routes/boardgameRoute');
const transactionRoute = require('./routes/transactionRoute');

app.use(express.json());

app.use("/api/rooms", roomRoute)
app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/foods", foodRoute);
app.use("/api/orders", foodRoute);
app.use("/api/events", eventRoute);
app.use("/api/boardgames", boardgameRoute);
app.use("/api/borrowboardgames", boardgameRoute);
app.use("/api/transactions", transactionRoute);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})