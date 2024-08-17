import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const gifs_types_Schema = new mongoose.Schema({
  name: reqString,
  type: reqString,
  descPL: reqString,
  descEN: reqString,
});
const model = mongoose.model("gifs_types", gifs_types_Schema);
export default model;
