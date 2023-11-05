const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const configSchema = new mongoose.Schema({
  serverID: reqString,
  stream_channel: reqString,
  logger_channel: reqString,
});
const model = mongoose.model("servers configs", configSchema);
module.exports = model;
