const express = require('express');
const router = express.Router();


//login page
router.get('/login',(req,res)=>{
  res.render("login",{error: null});
})

//Registration Page
router.get('/register',(req,res)=>{
  res.render("register",{error: null});
})

module.exports = router;