import mongoose from "mongoose";
const reqString = {
  type: String,
  required: true,
};

const liveSchema = new mongoose.Schema(
  {
    url: reqString,
    name: reqString,
    stream_channel: reqString,
  },
  { timestamps: true }
);
const model = mongoose.model("live", liveSchema);
export default model;
