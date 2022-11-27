const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("form")
    .setDescription("Bluzy")
    .addStringOption((option) =>
      option
        .setName("size")
        .setDescription("Jaki ma być rozmiar?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("what")
        .setDescription("Co ma być na bluzie?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("where")
        .setDescription("Gdzie ta rzecz ma być?")
        .setRequired(true)
    ),

  async execute(interaction) {
    const size = interaction.options.getString("size");
    const what = interaction.options.getString("what");
    const where = interaction.options.getString("where");

    const embed = new EmbedBuilder()
      .setColor("#0000ff")
      .setTitle("Zgłoszenie")
      .setDescription(
        ` 1. ${size}
      2. ${what}
      3. ${where}`
      )
      .setFooter({ text: `Zgłoszenie od ${interaction.user.tag}.`});

    return interaction.reply({ embeds: [embed] });
  },
};
