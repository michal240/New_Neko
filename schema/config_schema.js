import mongoose from "mongoose";

const reqString = {
  type: String,
  required: true,
};

const configSchema = new mongoose.Schema({
  serverID: reqString,
  stream_channel: reqString,
  logger_channel: reqString,
  members_count: reqString,
  online_count: reqString,
});

const model = mongoose.model("servers configs", configSchema);
export default model;
