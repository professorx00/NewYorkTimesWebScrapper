const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

router.get('/', (req, res) => {
  res.render("welcome", {});
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render("dashboard", { name: req.user.name, id: req.user.id })
})

router.get('/getarticles', ensureAuthenticated, (req, res) => {
  let articles = [];
  axios.get("https://www.nytimes.com")
    .then((response) => {
      const $ = cheerio.load(response.data)
      $("article").each(function (i, element) {
        var title = $(element).children().find("p").text();
        var titleData = $(element).children().find("p").text().replace(/\s+/g, '')
        var link = $(element).find("a").attr("href");
        if (title !== "") {
          let articleObject = {
            title,
            titleData,
            link
          }
          db.ScrappedData.find({ title: title }).then((data) => {
            if (data.length === 0) {
              db.ScrappedData.create(articleObject)
            } else {
              data.forEach(element => {
                if (articleObject.title !== element.title) {
                  console.log(element.title)
                  db.ScrappedData.create(articleObject)
                }
              })
            }
          })
        }
      });
    }).then(() => {
      db.ScrappedData.find({}).then(data => {
        console.log("loading Articles")
        res.render("dashboard", { articles: data })
      })
    })
    .catch(err => console.log(err));
});

router.post('/savearticle', ensureAuthenticated, (req, res) => {
  db.ScrappedData.findOne({ titleData: req.body.titleData })
    .then(function (dbScrappedData) {
      console.log(dbScrappedData.id)
      db.User.findOne({ articles: { $in: [dbScrappedData.id] } }, { _id: req.user.id }).then(data => {
        if (!data) {
          return db.User.findOneAndUpdate({ _id: req.user.id }, { $push: { articles: dbScrappedData.id } }, { new: true })
            .then((dbUser) => {
              res.json(dbUser)
            })
            .catch(function (err) {
              res.json(err);
            });
        }
      });
    });
});

router.get('/userarticles',ensureAuthenticated,(req, res) => {
  db.User.findOne({_id:req.user.id}).populate('articles').then((data)=>{
    res.render("saved",{name:req.user.name,articles:data.articles})
  })
})

module.exports = router;