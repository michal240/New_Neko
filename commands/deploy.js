const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deploy")
    .setDescription("Dodanie komend.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.user.id !== "581425303625138187") {
          return
      }
        require("../deploy-commands");
        return interaction.reply({ content: 'Dodano komendy!' , ephemeral: true})
  },
};
