const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Testowe!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option.setName("target").setDescription("Czyj avatar chcesz zobaczyć")
    ),
  async execute(interaction) {
        const user = interaction.options.getMember("target");
        const avatar_options = { dynamic: true, size: 4096, format: "png" }
    const embed = new EmbedBuilder()
      .setColor(interaction.member.displayColor)
      .setTitle(interaction.member.displayName)
      .setImage(user.displayAvatarURL(avatar_options));

    return interaction.reply({ embeds: [embed] });
  },
};
