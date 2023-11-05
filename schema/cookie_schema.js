const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const cookiesSchema = new mongoose.Schema({
  UserID: reqString,
  given: {
    type: Number,
    default: 0,
  },
  taken: {
    type: Number,
    default: 0,
  },
});
const model = mongoose.model("Cookies", cookiesSchema);
module.exports = model;
