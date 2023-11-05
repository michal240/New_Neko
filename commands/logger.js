const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config_schema = require("../schema/config_schema");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("logger")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription("Logger set up."),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const channelId = interaction.channel.id;

    await config_schema.findOneAndUpdate(
      { serverID: guildId },
      {
        serverID: guildId,
        logger_channel: channelId,
      },
      {
        upsert: true,
      }
    );

    return interaction.reply("testing");
  },
};
