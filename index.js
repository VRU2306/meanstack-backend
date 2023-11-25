require('dotenv').config();
const express= require('express');
const cors=require('cors')
const app=express();
const path = require("path");
const mongoose = require("mongoose");
const authRouter = require("./routes/AuthRouter/auth.route")
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const uri = process.env.DATABASE_URI
    .replace("<username>", username)
    .replace("<password>", password);

//Connection of mongodb url
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  mongoose.connection.once('open', () => {
    console.log('Connected to the database');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Error in DB connection: ', err);
  });
  
// Add middleware to parse forms
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}));


app.use("/auth", authRouter);
app.all("/");
const port = process.env.PORT || 1200;
// Starting the Server 
app.listen(port, () => {
    console.log(`server connected to ${port}`)
})