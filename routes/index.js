const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
let articles = [];
router.get('/', (req, res) => {
  res.render("welcome", {});
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  db.ScrappedData.find({}).then(data => {
    res.render("dashboard", { name: req.user.name, id: req.user.id, articles: data ,articleNum: articles.length})
  })
})
router.get('/getuserdata', ensureAuthenticated, (req, res) => {
  db.User.findById(req.user.id).then(data=>{
    res.json(data)
  })
})


router.get('/getarticles', ensureAuthenticated, (req, res) => {
  articles=[]
  axios.get("https://www.nytimes.com")
    .then((response) => {
      const $ = cheerio.load(response.data)
      
      $("article").each(function (i, element) {
        var title = $(element).children().find("p").text();
        var titleData = $(element).children().find("p").text().replace(/\s+/g, '')
        var link = "https://www.nytimes.com"+$(element).find("a").attr("href");
        if (title !== "") {
          let articleObject = {
            title,
            titleData,
            link
          }
          db.ScrappedData.find({ title: title }).then((data) => {
            if (data.length === 0) {
              articles.push(articleObject)
              db.ScrappedData.create(articleObject)
            } else {
              data.forEach(element => {
                if (articleObject.title !== element.title) {
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
        res.redirect('/dashboard')
      })
    })
    .catch(err => console.log(err));
});

router.post('/savearticle', ensureAuthenticated, (req, res) => {
  db.ScrappedData.findOne({ titleData: req.body.titleData })
    .then(function (dbScrappedData) {
      db.User.findOne({ articles: { $in: [dbScrappedData.id] } , _id: req.user.id }).then(data => {
        console.log(data)
        if (!data) {
          return db.User.findOneAndUpdate({ _id: req.user.id},{$push: { articles: dbScrappedData.id } }, { new: true })
            .then((dbUser) => {
              res.json(dbUser)
            })
            .catch(function (err) {
              console.log(err)
              res.json(err);
            });
        }
      });
    });
});

router.get('/userarticles',ensureAuthenticated,(req, res) => {
  db.User.findOne({_id:req.user.id}).populate('articles').then((data)=>{
    res.render("saved",{name:req.user.name,userid:req.user.id,articles:data.articles})
  })
})

router.post('/deleteSavedArticle',ensureAuthenticated,(req,res)=>{
  db.User.findById(req.user.id).then(data=>{
    let array = data.articles
    let index= array.indexOf(req.body.articleid)
    let array2 = array.slice(0,index).concat(array.slice(index+1))
    db.User.findOneAndUpdate({ _id: req.user.id },{ articles: array2 }, { new: true }).then((data)=>{
      res.json(data)
    })
  })
})

router.get('/getnote/:id',ensureAuthenticated,(req,res)=>{
  db.Note.find({article:req.params.id,user:req.user.id},(err,data)=>{
    res.json(data)
  }).catch(err=>{
    res.json(err)
  })
})

router.get('/delNote/:id',ensureAuthenticated,(req,res)=>{
  const id= req.params.id
  console.log(id)
  db.Note.deleteOne({_id:id},(data)=>{
    console.log(data)
  })
})

router.post('/saveNote',ensureAuthenticated,(req,res)=>{
  db.Note.create({
    note:req.body.note,
    article: req.body.article,
    user: req.user.id
  }).then(note=>{
    console.log(note)
    res.json(note)
  }).catch(err=>{
    res.json(err)
  })
})

module.exports = router;