const express = require('express');
const router = express.Router();


//login page
router.get('/login',(req,res)=>{
  res.send("Login Page");
})

//Registration Page
router.get('/register',(req,res)=>{
  res.send("registration Page");
})

module.exports = router;