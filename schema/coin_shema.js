const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const coinsSchema = new mongoose.Schema({
  UserID: reqString,
  heads: {
    type: Number,
    default: 0,
  },
  tails: {
    type: Number,
    default: 0,
  },
});
const model = mongoose.model("Coins", coinsSchema);
module.exports = model;
