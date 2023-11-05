const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const pollSchema = new mongoose.Schema({
  channelID: reqString,
  vote_options: {
    type: [String],
    required: true,
    default: undefined,
  },
});
const model = mongoose.model("poll", pollSchema);
module.exports = model;
