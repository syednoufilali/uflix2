const mongoose = require("mongoose");
const PaymentSchema = require("./payments");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favourites: {
    type: [],
    required: true,
    default: []
  },
  deleted: {
    type: Schema.Types.Boolean,
    required: true,
    default: false
  },

  payments: {
    type: [PaymentSchema.schema],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model("users", UserSchema);
