const { SlashCommandBuilder } = require("discord.js");
const { twitch_auth } = require("../twitch");
module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("test").setDescription("test"),
  async execute(interaction) {
    await twitch_auth();
    return interaction.reply(`testing`);
  },
};
