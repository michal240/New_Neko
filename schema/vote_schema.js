const mongoose = require("mongoose");
const reqString = {
  type: String,
  required: true,
};

const voteSchema = new mongoose.Schema({
  userID: reqString,
  channelID: reqString,
  voted: reqString,
  expireAt: {
    type: Date,
    default: Date.now() + 30 * 24 * 60 * 60 * 1000,
    index: { expires: "2592000s" },
  },
});

const model = mongoose.model("voting", voteSchema);
module.exports = model;
