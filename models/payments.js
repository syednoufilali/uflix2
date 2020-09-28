const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const schema = new Schema({
  transaction_id: {
    type: String,
    required: true
  },
  order_number: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});
const model = mongoose.model("payment", schema);
module.exports = {
  model,
  schema
};
