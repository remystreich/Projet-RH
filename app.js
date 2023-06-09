const express = require('express');
const mongoose = require("mongoose");
const session = require('express-session')
require('dotenv').config()
const userRouter = require('./routes/userRouter')
const dashboardRouter = require('./routes/dashboardRouter')

const app = express()

app.use(express.json())
app.use(express.static("./views/assets"))
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));
app.use(function(req, res, next) {
    req.session.userId = "6480589dca8e598608e7655b"
    next()
})
app.use(express.urlencoded({ extended: true }))
app.use(userRouter);;
app.use(dashboardRouter)

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`connecté au port ${process.env.PORT}`);
    }
})

try {
    mongoose.connect(process.env.BDD_URI);
    console.log("connecté a la base");

} catch (error) {
    console.log(error)
}
