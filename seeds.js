var mongoose = require("mongoose");
var Review = require("./models/review");
var Comment = require("./models/comment");

var data = [
  {
    title: "Shopthelike.com",
    score: 10,
  },
  {
    title: "Facebook.com",
    score: 15,
  },
  {
    title: "google.com",
    score: 20,
  },
];

function seedDB() {
  Review.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed all reviews");

      data.forEach(function (seed) {
        Review.create(seed, function (err, newlyCreatedReview) {
          if (err) {
            console.log(err);
          } else {
            console.log("added a new review " + seed.title);
            Comment.deleteMany({}, function (err) {
              if (err) {
                console.log(err);
              } else {
                Comment.create(
                  {
                    text: newlyCreatedReview.title + " is maybe a scam!",
                    author: "Homer",
                  },
                  function (err, comment) {
                    if (err) {
                      console.log(err);
                    } else {
                      newlyCreatedReview.comments.push(comment);
                      newlyCreatedReview.save();
                      console.log("New comment added");
                    }
                  }
                );
              }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
