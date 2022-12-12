const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

// CREATE A SCHEMA for Wiki
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//CREATE A MODEL(a collection) for wiki
const Article = new mongoose.model("Article", articleSchema);

//app.route("/articles").get(req and res inside).post().delete();

app.route("/articles").get((req, res) => {
  // GET ALL articles

  Article.find(function(err, foundArticle) {
    // console.log(foundArticle);
    if (!err) {
      res.send(foundArticle);

    } else {
      res.send(err);


    }

  })

  //CREATE ONE ARTICLE

}).post((req, res) => {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content

  });

  newArticle.save(function(err) {
    if (!err) {
      res.send("Updated");

    } else {
      res.send(err);


    }

  })
  //DELETE ALL ARTICLES

}).delete((req, res) => {

  Article.deleteMany(function(err) {
    // console.log(foundArticle);
    if (!err) {
      res.send("Deleted All");

    } else {
      res.send(err);
    }

  })


});

app.route("/articles/:title")
.get((req, res)=>{  //GET ONE ARTICLE
  Article.findOne({title:req.params.titleArticle}, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send(err);
  }
});
})
.put(
  (req,res)=>{  //update whole ARTICLE
    Article.findOneAndReplace({title:req.params.titleArticle},req.body,function(err){
        if (!err) {
            res.send("Updated All content and title");
      
          } else {
            res.send(err);
      
          }
    
    });
    
    }
)
.patch(
  (req,res)=>{  //GET one part ARTICLE
    //whatever that the form from HTML request to change and send it to this js

Article.findOneAndUpdate(
  {title: req.params.articleTitle},
  {$set: req.body},
  function(err){
    if (!err){
      res.send("The article was updated Successfully")
    }
  }
)}
)
.delete((req, res) => { //Delete one article

  Article.deleteOne({title:req.params.titleArticle},function(err) {
    // console.log(foundArticle);
    if (!err) {
      res.send("Deleted the one");

    } else {
      res.send(err);
    }

  });


});






app.listen(27017, function() {
  console.log("Server started on port 27017");
});