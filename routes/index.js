const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

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
      console.log(results)
      console.log("dashboard rerendering")
      res.render("dashboard",{articles:results})
    })
    .catch(err=>console.log(err))
})

router.post('/savearticle',ensureAuthenticated, (req,res)=>{
    console.log(req.body)
    res.send("working save article link")
})

module.exports = router;