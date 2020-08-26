var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  text: String,
  author: String,
  rating: 0,
});

module.exports = mongoose.model("Comment", commentSchema);
