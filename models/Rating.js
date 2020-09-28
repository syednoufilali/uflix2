const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  rating: {
    type: Number
  }
});
const model = mongoose.model("rating", schema);
module.exports = {
  model,
  schema
};
