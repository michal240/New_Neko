const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const thumbnailSchema = new mongoose.Schema(
  {
    title: reqString,
    ImageID: reqString,
    Channel: reqString,
  },
  { timestamps: true }
);
const model = mongoose.model("thumbnail", thumbnailSchema);
module.exports = model;
