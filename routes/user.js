const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require("../models");

let success=[]
//login page
router.get('/login',(req,res)=>{
  if(success.length>0){
    loginerrors = [];
    res.render("login",{success:success});
  }else{
    success=[];
    res.render("login",req.flash())
  }
})

//Registration Page
router.get('/register',(req,res)=>{
  res.render("register", {});
})

//register Handle
router.post('/register', (req,res)=>{
  const { name, email, password, password2 } = req.body;
  let errors = []
  //check require fields
  if(!name || !email || !password || !password2){
    errors.push("Please fill in all fields");
  }
  if(password!== password2){
    errors.push("Passwords do not match!");
  }
  if(password.length<6){
    errors.push("Password needs to be more then 6 characters");
  }

  if (errors.length>0){
    res.render("register",{
      hasErrors: true,
      errors: errors,
      name:name,
      email: email,
      password: password,
      password2: password2
    });
  }else {
    //Pass Validation
    db.User.findOne({email:email})
    .then((user)=>{
      if(user){
        errors.push("Email is already registered");
        res.render("register",{
          hasErrors: true,
          errors: errors,
          name:name,
          email: email,
          password: password,
          password2: password2
        });
      }else{
        const newUser = new User({
          name:name,
          email:email,
          password:password
        })

        //hash password
        bcrypt.genSalt(10, (err,salt)=>{
          bcrypt.hash(newUser.password,salt,(err, hash)=>{
            if(err) throw err;
            //Set Password to hash
            newUser.password = hash;
            //save User
            newUser.save()
              .then((user)=>{
                success.push("You have successfully logged in")
                res.redirect('/users/login')
              })
              .catch(err=> console.log(err))

          })
        })
      }
    });
  }

})
//login Users handles
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req,res,next);
});


router.get('/logout', (req,res)=>{
  req.logout();
  req.flash("success_msg","you are logged out")
  res.redirect("/users/login")
})

module.exports = router;