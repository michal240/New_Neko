import mongoose from "mongoose";
const reqString = {
  type: String,
  required: true,
};

const authSchema = new mongoose.Schema({
  CLIENT_ID: reqString,
  auth_token: reqString,
});
const model = mongoose.model("auth", authSchema);
export default model;
