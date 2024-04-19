require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mongoLink= process.env.MONGO_LINK;
const app = express();
app.listen(5000 ,()=>{
    console.log("the server is up and running");
});

mongoose.connect(mongoLink)
.then(() => {
    console.log("Connected to the Database");
}).catch((err) => {
    // console.log("Not Connected to the Database",mongoLink);
    console.log(err);   
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));