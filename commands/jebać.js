const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jebać")
    .setDescription("jebanie")
    .addUserOption((option) =>
      option.setName("target").setDescription("Kogo chcesz jebać?").setRequired(true)
    ),
    async execute(interaction) {
        const min = Math.ceil(0);
        const max = Math.floor(100);
        let procent = Math.floor(Math.random() * (max - min + 1)) + min;


        const user = interaction.options.getMember("target");
          const embed = new EmbedBuilder()
            .setColor(interaction.member.displayColor)
            .setDescription(
              `**${interaction.member.displayName}** jebie **${user.displayName}** na **${procent}%**`
            );

    return interaction.reply({ embeds: [embed] });
  },
};
