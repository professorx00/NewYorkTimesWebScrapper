const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const ScrappedData = require('../models/ScrappedData')
var axios = require("axios");
var cheerio = require("cheerio");

router.get('/',(req,res)=>{
  res.render("welcome",{});
})

router.get('/dashboard', ensureAuthenticated, (req,res)=>{
  res.render("dashboard",{name: req.user.name})
})

router.get('/getarticles',ensureAuthenticated, (req,res)=>{
  let results = []
  axios.get("https://www.nytimes.com")
    .then((response)=>{
      const $ =  cheerio.load(response.data)
      $("article").each(function(i, element) {
        var title = $(element).children().text();
        var link = $(element).find("a").attr("href");
        let data = {title: title,link:"https://www.nytimes.com"+link}
        results.push(data)
      });
    }).then(()=>{
      res.render("dashboard",{articles:results})
    })
    .catch(err=>console.log(err))
})

module.exports = router;