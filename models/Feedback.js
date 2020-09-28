const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const FeedbackSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  review: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    required: true,
    max:5,
    min:1
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
module.exports = Feedback = mongoose.model("feedback", FeedbackSchema);
