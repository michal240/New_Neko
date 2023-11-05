const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const killingSchema = new mongoose.Schema({
  UserID: reqString,
  Items: {
    type: [String],
    required: true,
    default: undefined,
  },
});
const model = mongoose.model("killing profile", killingSchema);
module.exports = model;
