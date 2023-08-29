const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const LoggerSchema = new mongoose.Schema({
  GuildID: reqString,
  ChannelID: reqString,
});
const model = mongoose.model("logger", LoggerSchema);
module.exports = model;
