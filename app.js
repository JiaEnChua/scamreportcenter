var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var Comment = require("./models/comment");
var Review = require("./models/review");
var seedDB = require("./seeds");

seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/scamdoc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/reviews", function (req, res) {
  Review.find({}, function (err, allReviews) {
    if (err) {
      console.log(err);
    } else {
      console.log("Get /reviews");
      // res.render("reviews", {reviews: allReviews});
      res.status(200).json(allReviews);
    }
  });
});

app.post("/reviews", function (req, res) {
  //   console.log("Post /reviews");
  //   console.log(req.body.title);
  var title = req.body.title.toLowerCase();
  var newReview = { title: title };
  Review.findOne(newReview, function (err, foundReview) {
    if (err) {
      console.log(err);
    } else {
      if (foundReview != null) {
        res.status(200).json(foundReview);
      } else {
        Review.create(newReview, function (err, newlyCreatedReview) {
          if (err) {
            console.log(err);
          } else {
            // console.log(newlyCreatedReview);
            // res.redirect("/reviews");
            res.status(200).json(newlyCreatedReview);
          }
        });
      }
    }
  });
});

app.get("/reviews/new", function (req, res) {
  res.render("new");
});

app.get("/reviews/:id", function (req, res) {
  Review.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundReview) {
      if (err) {
        console.log(err);
      } else {
        // console.log(foundReview);
        // res.render("show", {review: foundReview});
        res.status(200).json(foundReview);
      }
    });
});

app.post("/reviews/:id", function (req, res) {
  var text = req.body.text;
  var author = req.body.author;
  var newComment = {
    text: text,
    author: author,
  };
  Review.findById(req.params.id, function (err, foundReview) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(newComment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          foundReview.comments.push(comment);
          foundReview.save();
          res.redirect("/reviews/" + req.params.id);
        }
      });
    }
  });
});

app.listen(8000, process.env.IP, function () {
  console.log("Server has started!");
});
