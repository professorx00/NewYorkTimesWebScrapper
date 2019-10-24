const express = require('express');
const path = require("path");

//create appp
const app =  express();
//set port
const PORT = process.env.PORT || 3000;


//Routes
app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/user.js'));
//decoders
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Public Statics
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
//Handle Bars 
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//initalization of Server
app.listen(PORT, console.log(`Server Stated on Port ${PORT}`));