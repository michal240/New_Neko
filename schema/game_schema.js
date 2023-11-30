const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};
const reqNumber = {
  type: Number,
  required: true,
};
const gameSchema = new mongoose.Schema({
  UserID: reqString,
  coins: { type: Number, required: true, default: 100 },
  wins: reqNumber,
  losses: reqNumber,
});
const model = mongoose.model("profile", gameSchema);
module.exports = model;
