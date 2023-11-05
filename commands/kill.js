const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("kill")
    .setDescription("Zabijanie")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Kogo chcesz zabić?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getMember("target");
    const author = interaction.member;

    const embed = new EmbedBuilder()
      .setColor(author.displayColor)
      .setDescription(
        `**${author.displayName}** zabija **${target.displayName}**`
      )
      .setImage("https://c.tenor.com/HrBMJlqr9i4AAAAC/crow-killed.gif");
    return interaction.reply({ embeds: [embed] });
  },
};
