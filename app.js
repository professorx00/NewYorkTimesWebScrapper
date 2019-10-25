const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const sessions = require('express-session');

//create appp
const app =  express();
//set port
const PORT = process.env.PORT || 3000;

require("./config/passport.js")(passport);

//databse Connection
const db = require("./config/keys.js").MongoURI;

//connect to monog
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true  })
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));
//decoders
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(sessions({
  secret: 'fishMongure',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// app.use((req,res,next)=>{

// })


//Routes
app.use('/',require('./routes/index.js'));
app.use('/users',require('./routes/user.js'));
//

//Public Statics
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
//Handle Bars 
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//initalization of Server
app.listen(PORT, console.log(`Server Stated on Port ${PORT}`));