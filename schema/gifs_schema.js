const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const gifsSchema = new mongoose.Schema({
  url: reqString,
  type: reqString,
});
const model = mongoose.model("gifs", gifsSchema);
module.exports = model;
