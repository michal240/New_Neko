import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const gifsSchema = new mongoose.Schema({
  url: reqString,
  type: reqString,
});
const model = mongoose.model("gifs", gifsSchema);
export default model;
