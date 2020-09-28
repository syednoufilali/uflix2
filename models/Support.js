const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const SuppportSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  query: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
module.exports = Suppport = mongoose.model("support", SuppportSchema);
