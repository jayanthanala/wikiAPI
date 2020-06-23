const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = mongoose.Schema({
  title:String,
  content:String
});
const Article = new mongoose.model("Article",articleSchema);

////////////////////////////////////ROUTE TO ALL ARTICLES//////////////////////////////

app.route("/articles")

.get(function(req,res){
  Article.find({},function(err, results){
    if(!err){
      res.send(results);;
    }else{
      console.log(err);
    }
  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.")
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Successfully deleted all articles")
    }else{
      res.send(err);
    }
  });
});

////////////////////////////////////ROUTE TO SPECIFIED ARTICLE//////////////////////////////

app.route("/articles/:article")

.get(function(req,res){
  var article = req.params.article;
  Article.findOne({title: article},function(err,results){
    if(!err){
      res.send(results);
    }else{
      res.send(err);
    }
  })
})

.put(function(req,res){
  Article.updateOne(
    {title: req.params.article},
    {title: req.body.title, content: req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        console.log("Successfully updated");
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title: req.params.article},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("Successfully Patched");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.delete(
    {title:req.params.title},
    function(err){
      if(!err){
        console.log("Successfully Deleted");
      }else{
        console.log(err);
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
