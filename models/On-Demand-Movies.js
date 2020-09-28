const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const DemandedSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  titles: {
    type: []
  },
  status: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = Demand = mongoose.model("demandMovies", DemandedSchema);
