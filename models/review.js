var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    title: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Review", reviewSchema);
